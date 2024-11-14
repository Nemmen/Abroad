import UserModel from '../models/user.js';

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import {uploadFileToCloudinary} from './uploadController.js'
import { sendRegistrationEmail } from '../services/emailService.js';
import GICModel from '../models/gicModel.js';
dotenv.config()


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
      !name || !email || !password || !organization ||
      !phoneNumber || !state || !city || !businessDivision) {
      return res.status(400).json({
        success: false,
        message: 'All fields, including both documents, are required.'
      });
    }

    // Check if the user already exists
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(401).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Upload documents to Cloudinary
    if(!req.files || !req.files.document1 || !req.files.document2) {
      return res.status(400).json({
        success: false,
        message: 'Both documents are required'
      });
    }
    const document1Url = await uploadFileToCloudinary(req.files.document1[0].path, 'documents');
    const document2Url = await uploadFileToCloudinary(req.files.document2[0].path, 'documents');

    // Create new user instance
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
      document1: document1Url,
      document2: document2Url,
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });



    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });
    res.status(200).json({ success: true, message: 'Login successfully', user: { ...user._doc, password: undefined }, token }); // Hide password
  } catch (error) {
    console.error('Login Error:', error); // Log the error
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message }); // Include error message in response
  }
};


const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const checkUser = async (req, res) => {
  try {
    const user = req.user; // Assuming middleware populates req.user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(200).json({
      success: true,
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    console.error('Check User Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Assuming middleware populates req.user
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } }); // Hide password
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// user adding data in the form of gic form
const addGicForm = async (req, res) => {
  try {
    const {
      studentName,
      commissionAmt,
      tds,
      netPayable,
      commissionStatus,
      agentRef,
      studentEmail,
      studentPhoneNo,
      studentPassportNo,
      studentDocuments,
    } = req.body;

    // atleast student name, commissionAmt, tds, netPayable, commissionStatus, agentRef, studentEmail, studentPhoneNo, studentPassportNo are required

    if ( !studentName || !commissionAmt || !tds || !netPayable || !commissionStatus || !agentRef || !studentEmail || !studentPhoneNo || !studentPassportNo) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    // Create new GIC instance
    const newGIC = new GICModel({
      studentName,
      commissionAmt,
      tds,
      netPayable,
      commissionStatus,
      agentRef,
      studentEmail,
      studentPhoneNo,
      studentPassportNo,
      studentDocuments,
    });

    await newGIC.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'GIC form added successfully',
      newGIC,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
    console.log(error);
  }
};

// view all gic form
const viewAllGicForm = async (req, res) => {
  try {
    const gicForms = await GICModel.find();
    res.status(200).json({ success: true, gicForms });
  } catch (error) {
    console.error('View GIC Form Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};






  




export { register, login, logout , getCurrentUser, addGicForm, viewAllGicForm};

