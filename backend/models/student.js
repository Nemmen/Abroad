import mongoose from "mongoose";

// Function to generate unique IDs (same as before)
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

// Define the schema for students
const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        studentCode: { type: String }, // Student code generated automatically
        email: { type: String, required: true, unique: true },
        userStatus: {
            type: String,
            enum: ["active", "pending", "block"],
            default: "pending",
        },
        password: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        phoneNumber: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        // documents: [{ type: String }],
        program: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    { timestamps: true }
);

// Middleware to generate `studentCode` for students
studentSchema.pre("save", async function (next) {
    // Check if the role is "student" and the studentCode is not already set
    if (this.role === "student" && !this.studentCode) {
        try {
            this.studentCode = await generateUniqueId("STD", "ST"); // Generate ID with STD prefix and ST suffix
        } catch (error) {
            return next(error); // Pass the error to the next middleware
        }
    }
    next();
});

// Create and export the model
const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
