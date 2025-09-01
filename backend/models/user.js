import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
// import CounterModel from "./counterModel";

// Function to generate unique IDs
const counterSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., "AGT" or "STD"
    seq: { type: Number, default: 0 }, // The current sequence number
});

const CounterModel = mongoose.model("counters", counterSchema);

const generateUniqueId = async (prefix, suffix) => {
    try {
        const counter = await CounterModel.findOneAndUpdate(
            { key: prefix },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // Create the counter if it doesn't exist
        );

        const seqNumber = counter.seq.toString().padStart(4, "0"); // Format sequence as 4 digits
        return `${prefix}${seqNumber}${suffix}`;
    } catch (error) {
        console.error("Error generating unique ID:", error);
        throw error;
    }
};

// Define the schema for users
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        agentCode: { type: String }, // Agent code generated automatically
        email: { type: String, required: true, unique: true },
        userStatus: {
            type: String,
            enum: ["active", "pending", "block"],
            default: "pending",
        },
        organization: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        password: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        phoneNumber: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        // abroadReason: { type: String },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
        document1: { type: String },
        document2: { type: String },
        businessDivision: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        gic: { type: mongoose.Schema.Types.ObjectId, ref: "GIC" },
        blockedAcc: { type: mongoose.Schema.Types.ObjectId, ref: "BLOCKED" },
    },
    { timestamps: true }
);
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

// Middleware to generate `agentCode` for agents
userSchema.pre("save", async function (next) {
    // Check if the role is "admin" (representing an agent) and the agentCode is not already set
    if (this.role === "user" && !this.agentCode) {
        try {
            this.agentCode = await generateUniqueId("AGT", "AE"); // Generate ID with AGT prefix and AE suffix
        } catch (error) {
            return next(error); // Pass the error to the next middleware
        }
    }
    next();
});

// Create and export the model
const UserModel = mongoose.model("users", userSchema);

export default UserModel;
