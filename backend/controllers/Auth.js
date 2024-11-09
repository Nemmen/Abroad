import UserModel from '../models/user.js';
import accountRecordModel from '../models/accountRec.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { sendRegistrationEmail } from '../services/emailService.js';
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
      document1,
      document2
    } = req.body;

    // Validate required fields
    if (
      !name || !email || !password || !organization ||
      !phoneNumber || !state || !city || !document1 || !document2
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields, including both documents, are required.'
      });
    }

    // Validate if user already exists
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(401).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      organization,
      phoneNumber,
      state,
      city,
      abroadReason,
      document1, 
      document2,
      businessDivision,
    });

    await newUser.save();
    // Send registration email
    await sendRegistrationEmail(email);

    res.status(200).json({ message: 'User registered successfully', newUser });
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



// account controllers

const addAccountRecord = async (req, res) => {
  try {
    
    const {
      vendor,
      openingMonth,
      date,
      studentName,
      contact,
      email,
      pwd,
      passport,
      accountNo,
      payout,
      poc,
      paymentStatus,
      fundingMonth
    } = req.body;

    // Validate that all required fields are provided
    if (
      !vendor ||
      !openingMonth ||
      !date ||
      !studentName ||
      !contact ||
      !email ||
      !pwd ||
      !passport ||
      !accountNo ||
      !payout ||
      !poc ||
      !paymentStatus ||
      !fundingMonth
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create a new student record
    const newRecord = new accountRecordModel({
      vendor,
      openingMonth,
      date,
      studentName,
      contact,
      email,
      pwd,
      passport,
      accountNo,
      payout,
      poc,
      paymentStatus,
      fundingMonth
    });

    // Save the new record to the database
    await newRecord.save();

    res.status(201).json({ message: 'Record added successfully', data: newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding record', error: error.message });
  }
};

// get all account records
const getAccountRecords = async (req, res) => {
  try {
    // get records for the current user
    const records = await accountRecordModel.find({});

    if (!records) {
      return res.status(404).json({ message: 'No records found' });
    }
    res.status(200).json({ message: 'Records fetched successfully', data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};

  




export { register, login, logout , getCurrentUser,addAccountRecord, getAccountRecords};

