import UserModel from '../models/user.js';
import ForexModel from '../models/forexModel.js';
import GICModel from '../models/gicModel.js';
import OshcModel from '../models/oshcModel.js';
import StudentFundingModel from '../models/studentFundingModel.js';
import PaymentTaggingModel from '../models/paymentTaggingModel.js';
import moment from 'moment';
// import RecordModel from '../models/record.js';
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendBlockNotification,
  sendUnblockNotification,
} from '../services/emailService.js';
const Getuser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'intenral server error' });
    console.log(error);
  }
};

// deleteUser but the user is not deleted just flaged as deleted
const deletUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // check if the user is admin
    const checkAdmin = await UserModel.findById(userId);
    if (checkAdmin.role == 'admin') {
      return res.status(409).json({ message: 'you can not delete admin' });
    }
    const user = await UserModel.findByIdAndUpdate(userId, { isDeleted: true });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ message: 'user deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'intenral server error' });
    console.log(error);
  }
};

// addUser
const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organization,
      phoneNumber,
      state,
      city,
      // abroadReason,
      businessDivision,
    } = req.body;
    const user = await UserModel.create({
      name,
      email,
      password,
      role,
      organization,
      phoneNumber,
      state,
      city,
      userStatus: 'active',
      // abroadReason,
      businessDivision,
    });
    res.status(200).json({ message: 'user added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'intenral server error' });
    console.log(error);
  }
};

// blockUser
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { userStatus: 'block' },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email notification
    await sendBlockNotification(user.email, user.name);

    res.status(200).json({ message: 'User blocked successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(error);
  }
};
// get user that are flagged as deleted

const getDeletedUser = async () => {
  try {
    const users = await UserModel.find({ isDeleted: true });
    return users;
  } catch (error) {
    console.log(error);
  }
};

// get users that are flagged as pending
const getPendingUser = async () => {
  try {
    const users = await UserModel.find({ userStatus: 'pending' });
    return users;
  } catch (error) {
    console.log(error);
  }
};

// get users that are flagged as block
const getBlockUser = async () => {
  try {
    const users = await UserModel.find({ userStatus: 'block' });
    return users;
  } catch (error) {
    console.log(error);
  }
};
// unblock user

const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { userStatus: 'active' },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email notification
    await sendUnblockNotification(user.email, user.name);

    res.status(200).json({ message: 'User unblocked successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(error);
  }
};
// pending to either active or block
const approveUser = async (req, res) => {
  try {
    const {approvedBy}=req.body
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(userId, {
      userStatus: 'active',
      approvedBy
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendApprovalEmail(user.email); // Send approval email
    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(error);
  }
};

const rejectUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndUpdate(userId, {
      userStatus: 'block',
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendRejectionEmail(user.email); // Send rejection email
    res.status(200).json({ message: 'User rejected successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(error);
  }
};

//get user by id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
    console.log(error);
  }
};

// Import necessary modules


// Controller function to get Forex data for the current month

export const getCurrentMonthForexData = async (req, res) => {
  try {
    // Get the start and end of the current month using moment.js
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Query the database for forex data within the current month
    const forexData = await ForexModel.find({
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    // Count the total number of forex entries for the current month
    const totalEntries = forexData.length;

    res.status(200).json({
      month: moment().format('MMMM YYYY'), // e.g., "January 2025"
      totalEntries, // Total number of forex entries
    });
  } catch (error) {
    console.error('Error fetching current month forex data:', error);
    res.status(500).json({ error: 'Failed to fetch forex data for the current month' });
  }
};


export const getYearlyForexData = async (req, res) => {
  try {
    // Get the start of the month 12 months ago and the end of the current month
    const startDate = moment().subtract(12, 'months').startOf('month').toDate();
    const endDate = moment().endOf('month').toDate();

    // Query the database for forex data within the date range
    const forexData = await ForexModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Transform the data for use in the graph
    const transformedData = forexData.map((item) => ({
      month: moment(item.date).format('YYYY-MM'), // Format as "YYYY-MM"
    }));

    // Group data by month and count the number of forexes
    const groupedData = {};
    transformedData.forEach(({ month }) => {
      groupedData[month] = (groupedData[month] || 0) + 1;
    });

    // Prepare the xAxis and series for the graph
    const months = [];
    const counts = [];
    for (let i = 0; i < 12; i++) {
      const currentMonth = moment().subtract(11 - i, 'months').format('YYYY-MM');
      months.push(currentMonth);
      counts.push(groupedData[currentMonth] || 0);
    }

    res.status(200).json({ xAxis: months, series: counts });
  } catch (error) {
    console.error('Error fetching past year forex data:', error);
    res.status(500).json({ error: 'Failed to fetch forex data for the past year' });
  }
};

export const getYearlyGICData = async (req, res) => { 
  try {
    // Get the current date and the start of the previous 12 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12); // Go back 12 months

    // Format the start and end dates for comparison (for the past 12 months)
    const startMonth = new Date(startDate.setDate(1)); // First day of the starting month
    const endMonth = new Date(); // Current date

    // console.log("Start Month:", startMonth);
    // console.log("End Month:", endMonth);

    // Query the database for GIC data where the accOpeningDate is within the past 12 months
    const gicData = await GICModel.aggregate([
      {
        $match: {
          accOpeningDate: {
            $gte: startMonth, // Greater than or equal to the start date (12 months ago)
            $lte: endMonth, // Less than or equal to the current date
          }
        }
      },
      {
        $project: {
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$accOpeningDate" }, // Convert Date to YYYY-MM format
          }
        }
      },
      {
        $group: {
          _id: '$yearMonth', // Group by yearMonth (YYYY-MM)
          count: { $sum: 1 }, // Count the number of entries for each month
        }
      },
      {
        $sort: { _id: 1 } // Sort by yearMonth (ascending)
      }
    ]);

    // console.log("GIC Data:", gicData);

    // Prepare the xAxis and series for the graph
    const months = [];
    const counts = [];

    for (let i = 0; i < 12; i++) {
      const currentMonth = new Date();
      currentMonth.setMonth(currentMonth.getMonth() - (11 - i));
      const monthStr = currentMonth.toISOString().slice(0, 7); // Format as YYYY-MM

      // Find the count for the current month
      const monthData = gicData.find(data => data._id === monthStr);
      months.push(monthStr);
      counts.push(monthData ? monthData.count : 0); // If no data, push 0
    }

    res.status(200).json({ xAxis: months, series: counts });
  } catch (error) {
    // console.error('Error fetching past year GIC data:', error);
    res.status(500).json({ error: 'Failed to fetch GIC data for the past year' });
  }
};
export const getForexAndGicData = async (req, res) => {
  try {
    // Fetch the count of forex entries
    const forexCount = await ForexModel.countDocuments();

    // Fetch the count of GIC entries
    const gicCount = await GICModel.countDocuments();

    // Fetch the count of OSHC entries
    const oshcCount = await OshcModel.countDocuments();

    // Fetch the count of Student Funding entries
    const studentFundingCount = await StudentFundingModel.countDocuments();

    // Fetch the count of Payment Tagging entries
    const paymentTaggingCount = await PaymentTaggingModel.countDocuments();

    // Return the data in the format required for the dashboard
    res.json({
      forexCount,
      gicCount,
      oshcCount,
      studentFundingCount,
      paymentTaggingCount,
    });
  } catch (error) {
    // console.error('Error fetching forex and GIC data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

export const getCurrentMonthGICs = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

    // Fetch GIC data with accOpeningMonth matching the current month
    const gicData = await GICModel.find({ accOpeningMonth: currentMonth });

    // Prepare data for the graph
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const xAxis = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Days of the current month
    const series = Array(daysInMonth).fill(0); // Initialize the series with zeros

    // Populate the series array based on the account opening dates
    gicData.forEach(gic => {
      const openingDate = new Date(gic.accOpeningDate);
      const day = openingDate.getDate();
      if (day >= 1 && day <= daysInMonth) {
        series[day - 1] += 1; // Increment the count for the specific day
      }
    });

    // Send the data back to the client
    res.status(200).json({
      xAxis,
      series,
    });
  } catch (error) {
    // console.error('Error fetching GIC data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  Getuser,
  deletUser,
  addUser,
  blockUser,
  getDeletedUser,
  getPendingUser,
  getBlockUser,
  unblockUser,
  approveUser,
  rejectUser,
  getUserById
};
