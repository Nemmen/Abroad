import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    SNo: {
        type: Number,
        required: true
    },
    REP: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Agency: {
        type: String,
        required: true
    },
    StudentName: {
        type: String,
        required: true
    },
    CNTRY: {
        type: String,
        required: true
    },
    CurrencyBooked: {
        type: String,
        required: true
    },
    RateShared: {
        type: Number,
        required: true
    },
    RateBooked: {
        type: Number,
        required: true
    },
    Quotation: {
        type: String,
        required: true
    },
    StudentPaid: {
        type: Number,
        required: true
    },
    TotalCommission: {
        type: Number,
        required: true
    },
    AgentCommission: {
        type: Number,
        required: true
    },
    AECommission: {
        type: Number,
        required: true
    },
    TDS5Percent: {
        type: Number,
        required: true
    },
    CommissionPayment: {
        type: Number,
        required: true
    },
    paidDate: {
        type: String,
        required: true
    },
    TCS: {
        type: Number,
        required: true
    },
    SubAgent: {
        type: Number,
        required: true
    },
    TDS: {
        type: Number,
        required: true
    },
    Net: {
        type: Number,
        required: true
    },
    MOP: {
        type: String,
        required: true
    },
    FileUpdatedProof: {
        type: String,
        required: false
    },
    Remarks: {
        type: String,
        required: false
    }
}, { timestamps: true });

const RecordModel = mongoose.model('records', recordSchema);

export default RecordModel;
