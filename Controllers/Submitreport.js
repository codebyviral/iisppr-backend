import WeeklyStatus from "../Models/Report.js";

// POST: Submit a Weekly Status Report
export const submitWeeklyStatus = async (req, res) => {
  try {
    const { employee, department, date, tasksCompleted, tasksToBeginNextWeek, selfAssessmentComments } = req.body;

    // Validate required fields
    if (!employee || !department || !date || !tasksCompleted || !tasksToBeginNextWeek || !selfAssessmentComments) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new status report
    const newStatus = new WeeklyStatus({
      employee,
      department,
      date,
      tasksCompleted,
      tasksToBeginNextWeek,
      selfAssessmentComments,
    });

    await newStatus.save();
    res.status(201).json({ message: "Weekly Status Report submitted successfully.", data: newStatus });
  } catch (error) {
    console.error("Error submitting status report:", error);
    res.status(500).json({ error: "An error occurred while submitting the status report." });
  }
};

// GET: Retrieve all Weekly Status Reports
export const getAllWeeklyStatusReports = async (req, res) => {
  try {
    const reports = await WeeklyStatus.find().sort({ date: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching status reports:", error);
    res.status(500).json({ error: "An error occurred while fetching the status reports." });
  }
};
