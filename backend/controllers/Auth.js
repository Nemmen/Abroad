import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { sendRegistrationEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
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

    // Hash password and save user
    const hashedPassword = bcryptjs.hashSync(password, 10);
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
    await sendRegistrationEmail(email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      newUser: { ...newUser._doc, password: undefined }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval.'
      });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account is blocked.'
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { ...user._doc, password: undefined },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
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
