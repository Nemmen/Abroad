import UserModel from '../models/user.js';
import StudentModel from '../models/student.js';
import { createFolder, uploadFile } from './googleDrive.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
// import {uploadFileToCloudinary} from './uploadController.js'
import { sendRegistrationEmail,sendOtpEmail, verifyOtp } from '../services/emailService.js';
import ForexModel from '../models/forexModel.js';
import GICModel from '../models/gicModel.js';
// import BLOCKEDModel from '../models/blockedModel.js';
dotenv.config();

export const sendOtp = async (req, res) => {
  try {
      const { email } = req.body;

      // Check if the user exists
      const user = await UserModel.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Send OTP email
      await sendOtpEmail(email);

      res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP and reset password
export const verifyAndResetPassword = async (req, res) => {
  try {
      const { email, otp, newPassword } = req.body;

      // Verify OTP
      const isOtpValid = verifyOtp(email, otp);
      if (!isOtpValid) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(newPassword, 10);

      // Update the user's password in the database
      await UserModel.findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
      );

      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      organization,
      phoneNumber,
      state,
      city,
      abroadReason,
      businessDivision,
    } = req.body;

    // Validate required fields, including files
    if (
      !name ||
      !email ||
      !password ||
      !organization ||
      !phoneNumber ||
      !state ||
      !city ||
      !businessDivision
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields, including both documents, are required.',
      });
    }

    // Check if the user already exists
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(401).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Upload documents to Cloudinary
    // if(!req.files || !req.files.document1 || !req.files.document2) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Both documents are required'
    //   });
    // }
    // const document1Url = await uploadFileToCloudinary(req.files.document1[0].path, 'documents');
    // const document2Url = await uploadFileToCloudinary(req.files.document2[0].path, 'documents');

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      organization,
      phoneNumber,
      state,
      city,
      abroadReason,
      businessDivision,
      // document1: document1Url,
      // document2: document2Url,
    });

    await newUser.save();

    // Send registration email
    await sendRegistrationEmail(email);

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
    console.log(error);
  }
};

// login if the user status is active then login, if pending then show the message that your account is pending, if block then show the message that your account is blocked
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    if (user.userStatus === 'pending') {
      return res.status(401).json({
        success: false,
        message: 'Wait for admin approval',
      });
    }
    if (user.userStatus === 'block') {
      return res.status(401).json({
        success: false,
        message: 'Your account is blocked',
      });
    }
    const ispassaowrdValid = await bcryptjs.compare(password, user.password);
    if (!ispassaowrdValid) {
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });
    res
      .status(200)
      .json({
        success: true,
        message: 'Login successfully',
        user: { ...user._doc, password: undefined },
        token,
      }); // Hide password
  } catch (error) {
    console.error('Login Error:', error); // Log the error
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }); // Include error message in response
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res
      .status(200)
      .json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const checkUser = async (req, res) => {
  try {
    const user = req.user; // Assuming middleware populates req.user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    return res.status(200).json({
      success: true,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error('Check User Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Assuming middleware populates req.user
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } }); // Hide password
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// user adding data in the form of gic form

const addGicForm = async (req, res) => {
  try {
    const {
      studentRef,
      commissionAmt,
      fundingMonth,
      tds,
      netPayable,
      commissionStatus,
      accOpeningDate,
      agentRef,
      accOpeningMonth,
      bankVendor,
      studentEmail,
      studentPhoneNo,
      studentPassportNo,
      studentDocuments,
    } = req.body;

    if (
      !studentRef ||
      !agentRef ||
      !studentEmail ||
      !studentPhoneNo ||
      !studentPassportNo ||
      !studentDocuments
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    const newGIC = new GICModel({
      studentRef,
      commissionAmt,
      fundingMonth,
      tds,
      netPayable,
      commissionStatus,
      agentRef,
      accOpeningMonth,
      accOpeningDate,
      bankVendor,
      studentEmail,
      studentPhoneNo,
      studentPassportNo,
      studentDocuments,
    });

    await newGIC.save();

    res.status(200).json({
      success: true,
      message: 'GIC form added successfully',
      newGIC,
    });
  } catch (error) {
    console.error('Add GIC Form Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// view all gic form
const viewAllGicForm = async (req, res) => {
  try {
    const gicForms = await GICModel.find()
      .populate('agentRef', 'agentCode name')
      .populate('studentRef', 'name email studentCode');
    res.status(200).json({ success: true, gicForms });
  } catch (error) {
    console.error('View GIC Form Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



// Update GIC Form
const updateGicForm = async (req, res) => {
  try {
    const { id } = req.params; // Get the GIC form ID from params
    const {
      studentPhoneNo,
      studentPassportNo,
      bankVendor,
      fundingMonth,
      commissionAmt,
      tds,
      netPayable,
      commissionStatus,
    } = req.body; // Get editable fields from request body

    const updatedFields = {
      studentPhoneNo,
      studentPassportNo,
      bankVendor,
      fundingMonth,
      commissionAmt,
      tds,
      netPayable,
      commissionStatus,
    };

    // Update the GIC form in the database
    const updatedGIC = await GICModel.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true } // Return the updated document
    );

    if (!updatedGIC) {
      return res.status(404).json({
        success: false,
        message: 'GIC form not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'GIC form updated successfully',
      updatedGIC,
    });
  } catch (error) {
    console.error('Update GIC Form Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const addForexForm = async (req, res) => {
  try {
    const {
      studentRef,
      country,
      currencyBooked,
      quotation,
      studentPaid,
      docsStatus,
      ttCopyStatus,
      agentCommission,
      tds,
      netPayable,
      date,
      commissionStatus,
      agentRef,
      documents,
      passportFile, // Added passport file
      offerLetterFile, // Added offer letter file
    } = req.body;

    // Validation checks
    if (
      !studentRef ||
      !country ||
      !currencyBooked ||
      !quotation ||
      !studentPaid
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing.',
      });
    }

    if (!documents || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one document must be provided.',
      });
    }

    const newForex = new ForexModel({
      date,
      studentRef,
      agentRef,
      country,
      currencyBooked,
      quotation,
      studentPaid,
      docsStatus: docsStatus || 'Pending',
      ttCopyStatus: ttCopyStatus || 'Pending',
      agentCommission,
      tds,
      netPayable,
      commissionStatus: commissionStatus || 'Not Received',
      agentRef,
      documents,
      passportFile, // Save passport file
      offerLetterFile, // Save offer letter file
    });

    await newForex.save();

    res.status(200).json({
      success: true,
      message: 'Forex form added successfully.',
      data: newForex,
    });
  } catch (error) {
    console.error('Add Forex Form Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// Controller to fetch all Forex account details
const viewAllForexForms = async (req, res) => {
  try {
    const forexForms = await ForexModel.find()
      .populate('agentRef', 'agentCode name')
      .populate('studentRef', 'name email studentCode');
    res.status(200).json({ success: true, forexForms });
  } catch (error) {
    console.error('View Forex Forms Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const updateForexForm = async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedForm = await ForexModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (updatedForm) {
      res.status(200).json({ success: true, message: 'Forex form updated successfully.', data: updatedForm });
    } else {
      res.status(404).json({ success: false, message: 'Forex form not found.' });
    }
  } catch (error) {
    console.error('Update Forex Form Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


// const createBlockedData = async (req, res) => {
//   try {
//     const { studentName } = req.body;

//     if (!studentName) {
//       return res.status(400).json({
//         success: false,
//         message: 'Student name is required',
//       });
//     }

//     // Step 1: Create a folder for the student in Google Drive
//     const folderName = `${studentName}-Blocked-Data-Documents`;
//     const folderId = await createFolder(folderName);

//     // Step 2: Upload files if present
//     const uploadedFiles = {};
//     if (req.files) {
//       for (const key of Object.keys(req.files)) {
//         const file = req.files[key];
//         const fileId = await uploadFile(file.path, folderId);
//         uploadedFiles[key] = fileId;

//         // Remove the file from local storage
//         fs.unlinkSync(file.path);
//       }
//     }

//     // Step 3: Merge uploaded file IDs into documents
//     const documents = {
//       ...req.body.documents,
//       ...uploadedFiles,
//     };

//     // Step 4: Create the Blocked Data entry
//     const blockedData = new BLOCKEDModel({
//       ...req.body,
//       documents,
//     });

//     const savedBlockedData = await blockedData.save();

//     res.status(201).json({
//       message: 'Blocked data created successfully',
//       data: savedBlockedData,
//     });
//   } catch (error) {
//     console.error('Error creating blocked data:', error);
//     res.status(500).json({ message: 'Error creating blocked data', error });
//   }
// };

// Get all blocked data
const getAllBlockedData = async (req, res) => {
  try {
    const blockedData = await BLOCKEDModel.find().populate('agentRef');
    res.status(200).json({
      message: 'Blocked data fetched successfully',
      data: blockedData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blocked data', error });
  }
};

export const getAgentStats = async (req, res) => {
  try {
    const agentId = req.user.id; // Extracted from middleware

    // Count GIC transactions for the logged-in agent
    const gicCount = await GICModel.countDocuments({ agentRef: agentId });

    // Count forex transactions for the logged-in agent
    const forexCount = await ForexModel.countDocuments({ agentRef: agentId });

    // Count blocked transactions for the logged-in agent
    // const blockedCount = await BLOCKEDModel.countDocuments({ agentRef: agentId });

    res.status(200).json({
      message: "Agent stats fetched successfully",
      gicCount,
      forexCount,
      // blockedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent stats", error });
  }
};

const getAllusers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      message: 'All users fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

const studentCreate = async (req, res) => {
  try {
    const { name, email, agentRef } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const student = await StudentModel.findOne({ email });
    if (student) {
      if (student.name === name && String(student.agentCode) === String(agentRef)) {
        return res
          .status(200)
          .json({ message: 'student fetched', newStudent: student });
      } else {
        return res
          .status(400)
          .json({ message: 'Student with this email already exists in other AGENT or please type name properly' });
      }
    }
    const newStudent = new StudentModel({ name, email, agentCode: agentRef });
    await newStudent.save();
    const agent = await UserModel.findById(agentRef);
    if (agent) {
      agent.students.push(newStudent._id);
      await agent.save();
    } else {
      res.status(400).json({ message: 'Agent not found' });
    }
    res
      .status(201)
      .json({ message: 'Student created successfully', newStudent });
  } catch (error) {
    console.error('Create Student Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to create student', error: error.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const students = await StudentModel.find();
    res
      .status(200)
      .json({ message: 'All students fetched successfully', students });
  } catch (error) {
    console.error('Get Students Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch students', error: error.message });
  }
};

export {
  register,
  login,
  logout,
  getAllusers,
  studentCreate,
  getCurrentUser,
  addGicForm,
  getStudent,
  viewAllGicForm,updateGicForm,
  addForexForm,
  viewAllForexForms,
 updateForexForm,getAllBlockedData,
};
