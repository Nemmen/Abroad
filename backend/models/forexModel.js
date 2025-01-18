import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  documentOf: {
    type: String,
    enum: [
      'Self',
      'Brother',
      'Sister',
      'Husband',
      'Father',
      'Mother',
      'Grand Father',
      'Grand Mother',
    ],
    required: true,
  },
  documentType: {
    type: String,
    enum: [
      'Aadhar',
      'Pan',
      'Account statement',
      'Passbook Front',
      'Cheque Copy',
    ],
    required: true,
  },
  fileId: {
    type: String,
  },
  documentFile: {
    type: String, // Store the file path or URL of the uploaded document
    required: true,
  },
});

const forexSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
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
    type: String,
    required: true,
  },
  studentPaid: {
    type: String,
    required: true,
  },
  docsStatus: {
    type: String,
    enum: ['Pending', 'Received', 'Verified'],
    default: 'Pending',
  },
  ttCopyStatus: {
    type: String,
    enum: ['Pending', 'Received', 'Verified'],
    default: 'Pending',
  },
  agentCommission: {
    type: String,
    required: true,
  },
  tds: {
    type: String,
    required: true,
  },
  netPayable: {
    type: String,
    required: true,
  },
  commissionStatus: {
    type: String,
    enum: ['Not Received', 'Paid', 'Under Processing'],
    default: 'Not Received',
  },
  passportFile: {
    fileId: {
      type: String,
    },
    documentFile: {
      type: String, // Store the file path or URL for the passport
    },
  },
  offerLetterFile: {
    fileId: {
      type: String,
    },
    documentFile: {
      type: String, // Store the file path or URL for the passport
    },
  },
  documents: {
    type: [documentSchema], // Array of documents related to guardians or self
  },
  agentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  studentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true,
  },
});

const ForexModel = mongoose.model('Forex', forexSchema);

export default ForexModel;
