import ExcelJS from "exceljs";
import User from "../Models/User.js";
import PDFDocument from "pdfkit";

const generateReport = async (req, res) => {
	try {
		const { format } = req.query;

		const internsData = await getInternsData(); //fetch the interns data as a json by aggregation

		switch (format) {
			case "pdf":
				await generatePdfReport(res, internsData); //handle the pdf report generation
				break;
			case "excel":
				await generateExcelReport(res, internsData); //handle the excel report generation
				break;
			default:
				throw new Error(
					"Invalid format parameter. Accepted values are 'pdf' or 'excel'"
				);
		}
	} catch (error) {
		res.status(500).json({
			message: "Error fetching report",
			error: error.message,
		});
	}
};

export default generateReport;

async function generateExcelReport(res, internsData) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("interns-report");

	worksheet.columns = [
		{ header: "ID", key: "id", width: 8 },
		{ header: "Name", key: "name", width: 20 },
		{ header: "Attendance", key: "attendance", width: 12 },
		{ header: "Task Update", key: "taskUpdate", width: 40 },
		{ header: "Department", key: "department", width: 15 },
		{ header: "Task Status", key: "taskStatus", width: 15 },
		{ header: "Performance", key: "performance", width: 12 },
	];

	const headerRow = worksheet.getRow(1);
	headerRow.font = { bold: true };
	headerRow.alignment = { vertical: "middle", horizontal: "center" };

	//add rows with interns report data
	internsData.forEach((intern, index) => {
		const row = worksheet.addRow({
			id: index + 1,
			name: intern.name,
			attendance: `${intern.attendance}%`,
			taskUpdate: intern.taskUpdate,
			department: intern.department,
			taskStatus: intern.taskStatus,
			performance: `${intern.performance}%`,
		});
		row.alignment = { vertical: "middle", horizontal: "center" };
	});

	// response header type to receive the data in xlsx format
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);

	// response as a downloadable file
	res.setHeader(
		"Content-Disposition",
		"attachment; filename=intern-report.xlsx"
	);

	await workbook.xlsx.write(res);
	res.end();
}

async function generatePdfReport(res, internsData) {
	try {
		const doc = new PDFDocument({
			margin: 30,
			size: "A4",
		});

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=intern-report.pdf"
		);

		doc.pipe(res); //streams the binary data in res

		doc.fontSize(20)
			.font("Helvetica-Bold")
			.text(`Intern Report - ${new Date().toLocaleDateString()} `, {
				align: "left",
			});

		doc.moveDown(1);

		const columns = [
			{ id: "id", header: "ID", width: 20 },
			{ id: "name", header: "Name", width: 100 },
			{ id: "attendance", header: "Attendance", width: 70 },
			{ id: "taskUpdate", header: "Task Update", width: 120 },
			{ id: "department", header: "Department", width: 60 },
			{ id: "taskStatus", header: "Task Status", width: 60 },
			{ id: "performance", header: "Performance", width: 70 },
		];

		// table header start position/co-oridinates
		let x = 20;
		let y = 80;

		//header styles
		doc.fillColor("#f5f5f5")
			.rect(x, y, doc.page.width - 20, 20)
			.fill();

		// adds header contents from columns[]
		doc.fillColor("#000000");
		columns.forEach((column) => {
			doc.font("Helvetica-Bold")
				.fontSize(10)
				.text(column.header, x, y + 5, {
					width: column.width,
					align: "left",
				});
			x += column.width + 10;
		});

		// add table rows from internsData[]
		y += 25;
		internsData.forEach((intern, index) => {
			x = 20;
			intern.id = index + 1;
			// Add subtle row background for even rows
			if (index % 2 === 0) {
				doc.fillColor("#fafafa")
					.rect(x, y - 5, doc.page.width - 100, 20)
					.fill();
			}

			doc.fillColor("#000000");
			columns.forEach((column) => {
				let value = intern[column.id];

				// Format numbers with % symbol in attendance and in performance
				if (column.id === "attendance" || column.id === "performance") {
					value = `${value}%`;
				}

				doc.font("Helvetica").fontSize(9).text(value.toString(), x, y, {
					width: column.width,
					align: "left",
				});
				x += column.width + 10;
			});
			y += 20;

			// Add new page if content exceeds page height and with a margin-y 50
			if (y > doc.page.height - 50) {
				doc.addPage();
				y = 50;
			}
		});

		// END OF PDF --byte stream(pipe) ends
		doc.end();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Error creating pdf", error: error.message });
	}
}

async function getInternsData() {
	return await User.aggregate([
		//initiating pipeline
		// group the results of each query
		{
			$match: {
				role: "intern",
			},
		},
		{
			$lookup: {
				from: "attendances",
				localField: "_id",
				foreignField: "userId",
				as: "attendanceRecords", // adding a new field attendanceRecords [] in each user document
			},
		},
		{
			$lookup: {
				from: "tasks",
				localField: "_id",
				foreignField: "assignedTo",
				as: "tasks", //adding a new field tasks [] in each user document
			},
		},
		{
			$addFields: {
				totalDays: {
					$size: "$attendanceRecords", //adding total days as size of the attendanceRecords[]
				},
				presentDays: {
					$size: {
						$filter: {
							input: "$attendanceRecords",
							as: "record",
							cond: { $eq: ["$$record.status", "Present"] },
						},
					},
				},
			},
		},
		{
			$addFields: {
				attendancePercentage: {
					$cond: [
						{ $gt: ["$totalDays", 0] }, //if total days > 0 calculate percentage else 0
						{
							$multiply: [
								{ $divide: ["$presentDays", "$totalDays"] },
								100,
							],
						},
						0, //default 0
					],
				},
				completedTasks: {
					// completed tasks count by filtering
					$size: {
						$filter: {
							input: "$tasks",
							as: "task",
							cond: { $eq: ["$$task.status", "Completed"] },
						},
					},
				},
				totalTasks: { $size: "$tasks" },
			},
		},
		{
			$addFields: {
				performance: {
					$cond: [
						{ $gt: ["$totalTasks", 0] },
						{
							$multiply: [
								{ $divide: ["$completedTasks", "$totalTasks"] },
								100,
							],
						},
						0,
					],
				},
				// adding all the tasks of the user with their status
				taskUpdates: {
					$reduce: {
						input: "$tasks",
						initialValue: "",
						in: {
							$concat: [
								"$$value",
								{ $cond: [{ $eq: ["$$value", ""] }, "", "; "] }, //if string is "" add "" else add ";"
								"$$this.title",
								" (",
								"$$this.status",
								")",
							],
						},
					},
				},
			},
		},
		//combine and appends the results for each users Document
		{
			$project: {
				_id: 0,
				id: 1,
				name: 1,
				attendance: { $round: ["$attendancePercentage", 0] }, //round to 0 decimal places
				taskUpdate: "$taskUpdates",
				department: "$role",
				taskStatus: {
					$cond: [
						{ $gt: ["$completedTasks", 0] },
						"Completed",
						"Pending",
					],
				},
				performance: { $round: ["$performance", 0] },
			},
		},
	]);
}
