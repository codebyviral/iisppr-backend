import LeaveApplication from "../Models/LeaveApplication";

// Create a new leave application
const createLeaveApplication = async (req, res) => {
  const { reason, description, startDate, endDate } = req.body;

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ message: 'End date must be after start date' });
  }

  const leaveApplication = new LeaveApplication({
    userId: req.user.id,
    reason,
    description,
    startDate,
    endDate,
  });

  try {
    await leaveApplication.save();
    res.status(201).json({
      message: 'Leave application created successfully',
      leaveApplication,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating leave application', error: err });
  }
};

// Get all leave applications (for admin)
const getAllLeaveApplications = async (req, res) => {
  try {
    const leaveApplications = await LeaveApplication.find().populate('userId', 'firstName lastName');
    res.status(200).json(leaveApplications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leave applications', error: err });
  }
};

// Update leave application status (admin)
const updateLeaveApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Disapproved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const leaveApplication = await LeaveApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    if (!leaveApplication) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(200).json({
      message: 'Leave application status updated',
      leaveApplication,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave application status', error: err });
  }
};

export { createLeaveApplication, getAllLeaveApplications, updateLeaveApplicationStatus };
