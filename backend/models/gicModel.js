// import { type } from '@testing-library/user-event/dist/types/utility';
import mongoose from 'mongoose';


const gicSchema = new mongoose.Schema({
  agentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  studentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
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
  accOpeningDate: {
    type: Date,
  },
  bankVendor: {
    type: String,
    enum: ['ICICI', 'RBC', 'CIBC', 'BOM', 'TD'],
  },
  accOpeningMonth: {
    type: String,
  },
  fundingMonth: {
    type: String,
    default: 'Not Funded Yet',
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
    enum: ['Not Received', 'Paid', 'Under Processing'],
  },

  studentDocuments: {
    aadhar: {
      fileId: {
        type: String,
      },
      documentFile: {
        type: String, // Store the file path or URL of the uploaded document
      },
    },
    pan: {
      fileId: {
        type: String,
      },
      documentFile: {
        type: String, // Store the file path or URL of the uploaded document
        
      },
    },
    ol: {
      fileId: {
        type: String,
      },
      documentFile: {
        type: String, // Store the file path or URL of the uploaded document
       
      },
    },
    passport: { 
      fileId: {
        type: String,
      },
      documentFile: {
        type: String, // Store the file path or URL of the uploaded document
      },
    },
  },
});

const GICModel = mongoose.model('GIC', gicSchema);

export default GICModel;
