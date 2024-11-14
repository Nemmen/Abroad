// import { type } from '@testing-library/user-event/dist/types/utility';
import mongoose from 'mongoose';

const gicSchema = new mongoose.Schema({
  accOpeningDate: {
    type: Date,
     
  },
  studentName: {
    type: String,
     
  },
  amount:{
    type: String,
  },
  passportNo: {
    type: String,
     
  },
  bankVendor: {
    type: String,
    enum: ["ICICI", "RBC", "CIBC", "BOM", "TD"],
     
  },
  accOpeningMonth: {
    type: String,
     
  },
  fundingMonth: {
    type: String,
     
  },
  commissionAmt: {
    type: String,
     
  },
  tds: {
    type: String,
     
  },
  netPayable: {
    type: String,
     
  },
  commissionStatus: {
    type: String,
    enum: ["Not Received", "Paid", "Under Processing"],
     
  },
  agentRef:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
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

const GICModel = mongoose.model('GIC', gicSchema);

export default GICModel;
