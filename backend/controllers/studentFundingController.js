import StudentFundingModel from '../models/studentFundingModel.js';
import UserModel from '../models/user.js';

/**
 * AGENT CONTROLLERS
 */

// Add a new student funding request (Agent)
export const addStudentFunding = async (req, res) => {
  try {
    const agentId = req.user.id; // From authentication middleware

    const studentFundingData = {
      ...req.body,
      agentId,
      status: 'Pending',
    };

    const newStudentFunding = await StudentFundingModel.create(studentFundingData);

    res.status(201).json({
      success: true,
      message: 'Student funding request created successfully',
      data: newStudentFunding,
    });
  } catch (error) {
    console.error('Error creating student funding request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student funding request',
      error: error.message,
    });
  }
};

// Update student funding request (Agent)
export const updateStudentFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const agentId = req.user.id;

    // Find the record and check ownership
    const existingRecord = await StudentFundingModel.findOne({ _id: id, agentId });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Student funding request not found or you do not have permission to update it',
      });
    }

    // Agents can only update if status is Pending
    if (existingRecord.status !== 'Pending') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update a student funding request that is not pending',
      });
    }

    const updatedStudentFunding = await StudentFundingModel.findByIdAndUpdate(
      id,
      { ...req.body, agentId },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student funding request updated successfully',
      data: updatedStudentFunding,
    });
  } catch (error) {
    console.error('Error updating student funding request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student funding request',
      error: error.message,
    });
  }
};

// Get agent's student funding requests with filters
export const getStudentFundingByAgent = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { status, country, fundingType, startDate, endDate } = req.query;

    // Build filter object
    const filter = { agentId };

    if (status) filter.status = status;
    if (country) filter.country = country;
    if (fundingType) filter.fundingType = fundingType;
    if (startDate || endDate) {
      filter.applicationDate = {};
      if (startDate) filter.applicationDate.$gte = new Date(startDate);
      if (endDate) filter.applicationDate.$lte = new Date(endDate);
    }

    const studentFundings = await StudentFundingModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: studentFundings.length,
      data: studentFundings,
    });
  } catch (error) {
    console.error('Error fetching agent student funding requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student funding requests',
      error: error.message,
    });
  }
};

/**
 * ADMIN CONTROLLERS
 */

// Get all student funding requests with filters and analytics (Admin)
export const getAllStudentFundings = async (req, res) => {
  try {
    const { status, country, fundingType, agentId, startDate, endDate } = req.query;

    // Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (country) filter.country = country;
    if (fundingType) filter.fundingType = fundingType;
    if (agentId) filter.agentId = agentId;
    if (startDate || endDate) {
      filter.applicationDate = {};
      if (startDate) filter.applicationDate.$gte = new Date(startDate);
      if (endDate) filter.applicationDate.$lte = new Date(endDate);
    }

    const studentFundings = await StudentFundingModel.find(filter)
      .populate('agentId', 'name email agentCode')
      .sort({ createdAt: -1 });

    // Calculate analytics
    const totalAmount = studentFundings.reduce((sum, record) => sum + (record.fundingAmount || 0), 0);
    const statusCounts = studentFundings.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: studentFundings.length,
      analytics: {
        totalAmount,
        statusCounts,
      },
      data: studentFundings,
    });
  } catch (error) {
    console.error('Error fetching all student funding requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student funding requests',
      error: error.message,
    });
  }
};

// Get single student funding request by ID (Admin)
export const getStudentFundingById = async (req, res) => {
  try {
    const { id } = req.params;

    const studentFunding = await StudentFundingModel.findById(id).populate('agentId', 'name email agentCode');

    if (!studentFunding) {
      return res.status(404).json({
        success: false,
        message: 'Student funding request not found',
      });
    }

    res.status(200).json({
      success: true,
      data: studentFunding,
    });
  } catch (error) {
    console.error('Error fetching student funding request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student funding request',
      error: error.message,
    });
  }
};

// Update status and remarks (Admin)
export const updateStudentFundingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['Pending', 'Approved', 'Rejected', 'Under Review'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const updatedStudentFunding = await StudentFundingModel.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate('agentId', 'name email agentCode');

    if (!updatedStudentFunding) {
      return res.status(404).json({
        success: false,
        message: 'Student funding request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updatedStudentFunding,
    });
  } catch (error) {
    console.error('Error updating student funding status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message,
    });
  }
};

// Update full student funding record (Admin)
export const updateStudentFundingAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStudentFunding = await StudentFundingModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('agentId', 'name email agentCode');

    if (!updatedStudentFunding) {
      return res.status(404).json({
        success: false,
        message: 'Student funding request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student funding request updated successfully',
      data: updatedStudentFunding,
    });
  } catch (error) {
    console.error('Error updating student funding request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student funding request',
      error: error.message,
    });
  }
};

// Delete student funding request (Admin)
export const deleteStudentFunding = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudentFunding = await StudentFundingModel.findByIdAndDelete(id);

    if (!deletedStudentFunding) {
      return res.status(404).json({
        success: false,
        message: 'Student funding request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student funding request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student funding request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student funding request',
      error: error.message,
    });
  }
};
