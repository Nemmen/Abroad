import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  documentOf: {
    type: String,
    enum: ['Self', 'Brother', 'Sister', 'Husband', 'Father', 'Mother', 'Grand Father', 'Grand Mother'],
    required: true,
  },
  documentType: {
    type: String,
    enum: ['Aadhar', 'Pan', 'Account statement', 'Passbook Front', 'Cheque Copy'],
    required: true,
  },
  documentFile: {
    type: String, // Store the file path or URL of the uploaded document
    required: true,
  },
});

const forexSchema = new mongoose.Schema({
  sNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  studentName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  currencyBooked: {
    type: String,
    required: true,
  },
  quotation: {
    type: Number,
    required: true,
  },
  studentPaid: {
    type: Number,
    required: true,
  },
  docsStatus: {
    type: String,
    enum: ['Pending', 'Submitted', 'Verified'],
    required: true,
  },
  ttCopyStatus: {
    type: String,
    enum: ['Pending', 'Received', 'Verified'],
    required: true,
  },
  agentCommission: {
    type: Number,
    required: true,
  },
  tds: {
    type: Number,
    required: true,
  },
  netPayable: {
    type: Number,
    required: true,
  },
  commissionStatus: {
    type: String,
    enum: ['Not Received', 'Paid', 'Under Processing'],
    required: true,
  },
  passportFile: {
    type: String, // Store the file path or URL for the passport
  },
  offerLetterFile: {
    type: String, // Store the file path or URL for the offer letter
  },
  documents: [documentSchema], // Array of documents related to guardians or self
  agentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

const ForexModel = mongoose.model('Forex', forexSchema);

export default ForexModel;
