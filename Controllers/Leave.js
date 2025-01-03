// controllers/leaveController.js
import Leave from '../Models/leave.js';
import axios from 'axios';

// POST route to submit leave application by intern
export const postLeaveApplication = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const intern = req.user;

    const leaveDates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      leaveDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const newLeave = new Leave({
      internid: intern.id,
      leaveType,
      startDate,
      endDate,
      leaveDates,
      reason,
      status: 'Pending',
    });

    await newLeave.save();

    res.status(201).json({
      message: 'Leave application submitted successfully!',
      leave: newLeave,
    });
  } catch (error) {
    console.error('Error submitting leave application:', error);
    res.status(500).json({ message: 'Error submitting leave application', error });
  }
};


// GET route to fetch all leave applications for admin
export const getAllLeaveApplications = async (req, res) => {
  try {
    const leaves = await Leave.find()
    .populate('internid', 'name email') // Populate 'userId' with only 'name' and 'email' fields from User
    .exec(); // Optionally, filter by status or other parameters

    res.status(200).json({ leaves });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ message: 'Error fetching leave applications', error });
  }
};

// PUT route to update leave application status by admin
export const updateLeaveStatus = async (req, res) => {
  const leaveId = req.params.id;
  const { status, updatedBy } = req.body;

  try {
    // Validate the status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    // Update the leave application
    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status, updatedBy, updatedAt: Date.now() },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    // Hit notification API to send notification
    const notificationPayload = {
      userId: leave.internid,
      taskId: leave._id,
      status,
      message: `Your leave application has been ${status.toLowerCase()}.`,
    };

    try {
      await axios.post(`${process.env.BACKEND_ENDPOINT}/send/notification`, notificationPayload);
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError.response?.data || notificationError.message);
    }

    res.status(200).json({
      message: 'Leave application updated successfully and notification sent!',
      leave,
    });
  } catch (error) {
    console.error('Error updating leave application:', error);
    res.status(500).json({ message: 'Error updating leave application', error });
  }
};
