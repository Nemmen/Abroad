import mongoose, { Mongoose } from 'mongoose';

const blockedSchema = new mongoose.Schema({
  accOpeningDate: {
    type: Date, 
  },
  agentRef:{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  studentName: {
    type: String,
     
  },
  passportNo: {
    type: String,
     
  },
  bankVendor: {
    type: String,
    enum: ["ICICI", "RBC", "CIBC", "BOM", "TD", "Fintiba", "Expatrio"],
     
  },
  accOpeningMonth: {
    type: String,
     
  },
  fundingMonth: {
    type: String,
     
  },
  commissionAmt: {
    type: Number,
     
  },
  tds: {
    type: Number,
     
  },
  netPayable: {
    type: Number,
     
  },
  commissionStatus: {
    type: String,
    enum: ["Not Received", "Paid", "Under Processing"],
     
  },
  
  studentEmail: {
    type: String,
     
  },
  studentPhoneNo: {
    type: String,
     
  },
  studentPassportNo: {
    type: String,
     
  },
  studentDocuments: {
    aadhar: {
      type: String,
       
    },
    pan: {
      type: String,
       
    },
    ol: {
      type: String,
       
    },
    passport: {
      type: String,
       
    },
  },
});

const BLOCKEDModel = mongoose.model('BLOCKED', blockedSchema);

export default BLOCKEDModel;
