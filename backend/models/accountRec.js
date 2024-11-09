import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  vendor: {
    type: String,
    enum: ["blocked", "GIC", "ICICI"],
    
  },
  openingMonth: {
    type: String,
    
  },
  date: {
    type: Date,
    
  },
  saleBy: {
    // the type should be the reference to the one who is selling the product that is the user
    type: String,
    
  },
  agency: {
    type: String,
    
  },
  type: {
    type: String,
    
  },
  studentName: {
    type: String,
    
  },
  contact: {
    type: String,
  },
  email: {
    type: String,
  },
  pwd: {
    type: String,
  },
  passport: {
    type: String,
  },
  accountNo: {
    type: String,
  },
  poc: {
    type: String,
     
  },
  payout: {
    type: Number,
     
  },
  paymentStatus: {
    type: String,
     
  },
  fundingMonth: {
    type: String,
     
  },
  agencyCodeConfirmationFromBank: {
    type: String,
     
  },
  commissionPaidStatus: {
    type: String,
     
  },
});

const accountRecordModel = mongoose.model('account', accountSchema);

export default accountRecordModel;
