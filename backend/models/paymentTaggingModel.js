import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
});

const paymentTaggingSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    mobile: {
      type: String,
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
    },
    paymentReferenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentInstructionLetter: {
      type: String,
      required: true,
    },
    dateOfLetterGeneration: {
      type: Date,
      required: true,
    },
    letterType: {
      type: String,
      required: true,
      enum: ['Flywire', 'Convera', 'Cibc'],
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    agentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentTaggingSchema.index({ agentRef: 1, status: 1 });
paymentTaggingSchema.index({ letterType: 1 });
paymentTaggingSchema.index({ paymentReferenceNumber: 1 });

const PaymentTaggingModel = mongoose.model('PaymentTagging', paymentTaggingSchema);

export default PaymentTaggingModel;
