import PaymentTaggingModel from '../models/paymentTaggingModel.js';
import Student from '../models/student.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

// ==================== AGENT ENDPOINTS ====================

// Add Payment Tagging (Agent)
export const addPaymentTagging = async (req, res) => {
  try {
    const {
      studentRef,
      email,
      mobile,
      institutionName,
      paymentReferenceNumber,
      paymentInstructionLetter,
      dateOfLetterGeneration,
      letterType,
      documents,
      agentRef,
    } = req.body;

    // Validate required fields
    if (
      !studentRef ||
      !email ||
      !mobile ||
      !institutionName ||
      !paymentReferenceNumber ||
      !paymentInstructionLetter ||
      !dateOfLetterGeneration ||
      !letterType ||
      !agentRef
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(studentRef)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student reference',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(agentRef)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent reference',
      });
    }

    // Validate letter type
    if (!['Flywire', 'Convera', 'Cibc'].includes(letterType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid letter type. Must be one of: Flywire, Convera, Cibc',
      });
    }

    // Check if student exists and get student name
    const student = await Student.findById(studentRef);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with the provided reference',
      });
    }

    // Check if agent exists
    const agent = await User.findById(agentRef);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found with the provided reference',
      });
    }

    // Check for duplicate payment reference number
    const existingPayment = await PaymentTaggingModel.findOne({
      paymentReferenceNumber,
    });
    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: 'Payment reference number already exists',
      });
    }

    // Create new payment tagging record with auto-populated student name
    const paymentTagging = new PaymentTaggingModel({
      studentRef,
      studentName: student.name,
      email,
      mobile,
      institutionName,
      paymentReferenceNumber,
      paymentInstructionLetter,
      dateOfLetterGeneration,
      letterType,
      documents: documents || [],
      agentRef,
      status: 'Active',
      remarks: '',
    });

    await paymentTagging.save();

    // Populate references for response
    const populatedPayment = await PaymentTaggingModel.findById(
      paymentTagging._id
    )
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode');

    res.status(201).json({
      success: true,
      message: 'Payment tagging record created successfully',
      data: populatedPayment,
    });
  } catch (error) {
    console.error('Error in addPaymentTagging:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment tagging record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update Payment Tagging (Agent)
export const updatePaymentTagging = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment tagging ID',
      });
    }

    // Find existing record
    const existingRecord = await PaymentTaggingModel.findById(id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payment tagging record not found',
      });
    }

    // If studentRef is being updated, fetch and update student name
    if (updateData.studentRef) {
      if (!mongoose.Types.ObjectId.isValid(updateData.studentRef)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student reference',
        });
      }

      const student = await Student.findById(updateData.studentRef);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found with the provided reference',
        });
      }
      updateData.studentName = student.name;
    }

    // Validate letter type if provided
    if (
      updateData.letterType &&
      !['Flywire', 'Convera', 'Cibc'].includes(updateData.letterType)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid letter type. Must be one of: Flywire, Convera, Cibc',
      });
    }

    // Check for duplicate payment reference number (excluding current record)
    if (updateData.paymentReferenceNumber) {
      const duplicatePayment = await PaymentTaggingModel.findOne({
        paymentReferenceNumber: updateData.paymentReferenceNumber,
        _id: { $ne: id },
      });
      if (duplicatePayment) {
        return res.status(409).json({
          success: false,
          message: 'Payment reference number already exists',
        });
      }
    }

    // Update the record
    const updatedPayment = await PaymentTaggingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode');

    res.status(200).json({
      success: true,
      message: 'Payment tagging record updated successfully',
      data: updatedPayment,
    });
  } catch (error) {
    console.error('Error in updatePaymentTagging:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment tagging record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get Payment Tagging by Agent
export const getPaymentTaggingByAgent = async (req, res) => {
  try {
    const { agentRef, letterType, status, page = 1, limit = 10 } = req.query;

    // Validate agent reference
    if (!agentRef) {
      return res.status(400).json({
        success: false,
        message: 'Agent reference is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(agentRef)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent reference',
      });
    }

    // Build query
    const query = { agentRef };

    if (letterType) {
      query.letterType = letterType;
    }

    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await PaymentTaggingModel.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    // Fetch records
    const paymentTaggings = await PaymentTaggingModel.find(query)
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Payment tagging records fetched successfully',
      data: paymentTaggings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        recordsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error in getPaymentTaggingByAgent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment tagging records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// Get All Payment Taggings (Admin)
export const getAllPaymentTaggings = async (req, res) => {
  try {
    const {
      agentRef,
      letterType,
      status,
      institutionName,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {};

    if (agentRef && mongoose.Types.ObjectId.isValid(agentRef)) {
      query.agentRef = agentRef;
    }

    if (letterType) {
      query.letterType = letterType;
    }

    if (status) {
      query.status = status;
    }

    if (institutionName) {
      query.institutionName = { $regex: institutionName, $options: 'i' };
    }

    // Search across multiple fields
    if (searchTerm) {
      query.$or = [
        { studentName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { paymentReferenceNumber: { $regex: searchTerm, $options: 'i' } },
        { institutionName: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRecords = await PaymentTaggingModel.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Fetch records
    const paymentTaggings = await PaymentTaggingModel.find(query)
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode')
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate analytics
    const allRecords = await PaymentTaggingModel.find(query);
    const letterTypeBreakdown = {
      Flywire: 0,
      Convera: 0,
      Cibc: 0,
    };
    const statusBreakdown = {
      Active: 0,
      Pending: 0,
      Completed: 0,
      Cancelled: 0,
    };

    allRecords.forEach((record) => {
      if (letterTypeBreakdown.hasOwnProperty(record.letterType)) {
        letterTypeBreakdown[record.letterType]++;
      }
      if (statusBreakdown.hasOwnProperty(record.status)) {
        statusBreakdown[record.status]++;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment tagging records fetched successfully',
      data: paymentTaggings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        recordsPerPage: parseInt(limit),
      },
      analytics: {
        totalRecords: allRecords.length,
        letterTypeBreakdown,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error('Error in getAllPaymentTaggings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment tagging records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get Payment Tagging by ID (Admin)
export const getPaymentTaggingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment tagging ID',
      });
    }

    // Fetch record
    const paymentTagging = await PaymentTaggingModel.findById(id)
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode phone');

    if (!paymentTagging) {
      return res.status(404).json({
        success: false,
        message: 'Payment tagging record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment tagging record fetched successfully',
      data: paymentTagging,
    });
  } catch (error) {
    console.error('Error in getPaymentTaggingById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment tagging record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update Payment Tagging Status (Admin)
export const updatePaymentTaggingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment tagging ID',
      });
    }

    // Validate status if provided
    if (
      status &&
      !['Active', 'Pending', 'Completed', 'Cancelled'].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Must be one of: Active, Pending, Completed, Cancelled',
      });
    }

    // Build update object
    const updateData = {};
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;

    // Update record
    const updatedPayment = await PaymentTaggingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode');

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment tagging record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment tagging status updated successfully',
      data: updatedPayment,
    });
  } catch (error) {
    console.error('Error in updatePaymentTaggingStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment tagging status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update Payment Tagging (Full) (Admin)
export const updatePaymentTaggingFull = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment tagging ID',
      });
    }

    // Find existing record
    const existingRecord = await PaymentTaggingModel.findById(id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payment tagging record not found',
      });
    }

    // If studentRef is being updated, fetch and update student name
    if (updateData.studentRef) {
      if (!mongoose.Types.ObjectId.isValid(updateData.studentRef)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student reference',
        });
      }

      const student = await Student.findById(updateData.studentRef);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found with the provided reference',
        });
      }
      updateData.studentName = student.name;
    }

    // Validate letter type if provided
    if (
      updateData.letterType &&
      !['Flywire', 'Convera', 'Cibc'].includes(updateData.letterType)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid letter type. Must be one of: Flywire, Convera, Cibc',
      });
    }

    // Validate status if provided
    if (
      updateData.status &&
      !['Active', 'Pending', 'Completed', 'Cancelled'].includes(
        updateData.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Must be one of: Active, Pending, Completed, Cancelled',
      });
    }

    // Check for duplicate payment reference number (excluding current record)
    if (updateData.paymentReferenceNumber) {
      const duplicatePayment = await PaymentTaggingModel.findOne({
        paymentReferenceNumber: updateData.paymentReferenceNumber,
        _id: { $ne: id },
      });
      if (duplicatePayment) {
        return res.status(409).json({
          success: false,
          message: 'Payment reference number already exists',
        });
      }
    }

    // Update the record
    const updatedPayment = await PaymentTaggingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('studentRef', 'name email studentCode')
      .populate('agentRef', 'name email agentCode');

    res.status(200).json({
      success: true,
      message: 'Payment tagging record updated successfully',
      data: updatedPayment,
    });
  } catch (error) {
    console.error('Error in updatePaymentTaggingFull:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment tagging record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete Payment Tagging (Admin)
export const deletePaymentTagging = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment tagging ID',
      });
    }

    // Delete record
    const deletedPayment = await PaymentTaggingModel.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment tagging record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment tagging record deleted successfully',
      data: deletedPayment,
    });
  } catch (error) {
    console.error('Error in deletePaymentTagging:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment tagging record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
