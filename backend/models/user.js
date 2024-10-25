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
        enum: ['active', 'block'],
        default: 'active'
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
    }
}, { timestamps: true });

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
