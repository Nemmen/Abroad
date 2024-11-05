import cloudinary from '../config/cloudinaryConfig.js';

// Helper function to upload a single file to Cloudinary
const uploadFileToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload_stream({ folder });
        return result.secure_url;
    } catch (error) {
        throw new Error('Error uploading to Cloudinary');
    }
};

// Controller for uploading GIC documents
export const uploadGICDocuments = async (req, res) => {
    const { email, contactNumber } = req.body;
    try {
        const files = req.files;
        const uploadedFiles = {};

        for (const key in files) {
            const file = files[key][0];
            const result = await uploadFileToCloudinary(file, `GIC/${email}`);
            uploadedFiles[key] = result;
        }

        res.status(200).json({
            message: 'GIC documents uploaded successfully',
            uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for uploading Blocked Account documents
export const uploadBlockedAccountDocuments = async (req, res) => {
    const { email, contactNumber } = req.body;
    try {
        const files = req.files;
        const uploadedFiles = {};

        for (const key in files) {
            const file = files[key][0];
            const result = await uploadFileToCloudinary(file, `BlockedAccount/${email}`);
            uploadedFiles[key] = result;
        }

        res.status(200).json({
            message: 'Blocked Account documents uploaded successfully',
            uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
