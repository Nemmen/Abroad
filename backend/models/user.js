import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userStatus: {
        type: String,
        enum: ['active','pending', 'block'],
        default: 'pending'
    },
    organization: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', "user"],
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    phoneNumber: {  // Added field for phone number
        type: String,
        required: true
    },
    state: {  // Added field for state
        type: String,
        required: true
    },
    city: {  // Added field for city
        type: String,
        required: true
    },
    abroadReason: {
        type: String,
        required: true 
    },
    document1: {  // Change type to Mixed
        type: String,
        required: true
    },
    document2: {  // Change type to Mixed
        type: String,
        required: true 
    },
    businessDivision: {
        type: String, 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    approvedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
