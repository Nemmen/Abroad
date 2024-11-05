import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
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

    // Validate request body
    if (
      !name ||
      !email ||
      !password ||
      !organization ||
      !phoneNumber ||
      !state ||
      !city ||
      !document1||
      !document2
    ) {
      return res.status(400).json({ success: false, message: 'All fields, including both documents, are required.' });
    }

    // Validate file types (should be PDFs)


    // if (document1.mimetype !== 'application/pdf' || document2.mimetype !== 'application/pdf') {
    //   return res.status(400).json({ success: false, message: 'Both documents must be in PDF format.' });
    // }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
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
    res.status(201).json({ success: true, message: 'User registered successfully', newUser });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    console.log('Email:', email, 'Password:', password); // Debugging line

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
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
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const checkUser = async (req, res) => {
  try {
    const user = req.user; // Assuming middleware populates req.user
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } }); // Hide password
  } catch (error) {
    console.error('Check User Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { register, login, logout, checkUser };
