import mongoose from 'mongoose';

const studentFundingSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  passportNumber: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  fundingAmount: {
    type: Number,
    required: true,
  },
  fundingType: {
    type: String,
    enum: ['Loan', 'Scholarship', 'Grant', 'Personal'],
    default: 'Loan',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    default: 'Pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
}, {
  timestamps: true,
});

const StudentFundingModel = mongoose.model('StudentFunding', studentFundingSchema);

export default StudentFundingModel;
