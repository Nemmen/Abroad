import mongoose from "mongoose";

// Function to generate unique IDs
const generateUniqueId = async (prefix, suffix) => {
    try {
        // Find the highest studentCode in the collection
        const lastStudent = await StudentModel.findOne()
            .sort({ createdAt: -1 }) // Sort by latest created document
            .select("studentCode");  // Only select studentCode field

        let seqNumber = 1; // Default sequence number if no documents exist

        if (lastStudent && lastStudent.studentCode) {
            // Extract the numeric part of the studentCode
            const lastSeq = parseInt(lastStudent.studentCode.slice(prefix.length, -suffix.length), 10);
            if (!isNaN(lastSeq)) {
                seqNumber = lastSeq + 1;
            }
        }

        // Format sequence as 4 digits
        const formattedSeq = seqNumber.toString().padStart(4, "0");
        return `${prefix}${formattedSeq}${suffix}`;
    } catch (error) {
        console.error("Error generating unique ID:", error);
        throw error;
    }
};

// Define the schema for students
const studentSchema = new mongoose.Schema(
    {
        name: { type: String },
        studentCode: { type: String, unique: true }, // Student code generated automatically
        agentCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        email: { type: String, unique: true },
        isDeleted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Middleware to generate `studentCode`
studentSchema.pre("save", async function (next) {
    if (!this.studentCode) {
        try {
            // Generate ID with STD prefix and ST suffix
            this.studentCode = await generateUniqueId("STD", "AE");
        } catch (error) {
            return next(error); // Pass the error to the next middleware
        }
    }
    next();
});

// Create and export the model
const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
