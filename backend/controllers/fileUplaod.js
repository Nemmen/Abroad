import { createFolder, uploadFile , getOrCreateAgentFolder } from './googleDrive.js'; // Import Google Drive helper functions
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import StudentModel from '../models/student.js';

// Ensure 'uploads/' directory exists
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory); // Create the directory if it doesn't exist
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Temporary storage for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Initialize Multer for handling multiple files
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    console.log('File mimetype:', file.mimetype);
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Allowed file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File type is not allowed'), false); // Reject invalid file types
    }
    cb(null, true); // Accept valid files
  }  
});

export const multipleFileUploadMiddleware = upload.array('files', 6); // Middleware to handle up to 4 files

/**
 * Upload multiple files to Google Drive under a dynamic subfolder
 * @route POST /api/upload-multiple
 */
export const uploadFileController = [
  multipleFileUploadMiddleware,
  async (req, res) => {
    try {
      const { folderId, type, studentRef } = req.body;

      if (!folderId || !studentRef || !req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Missing required parameters or files' });
      }
      

      const Student = await StudentModel.findOne({ _id: studentRef });


      const agentFolderId = await getOrCreateAgentFolder(folderId, studentRef);

      const uploadResults = [];
      for (const file of req.files) {
        const { path: filePath, originalname } = file;
        console.log('Processing file:', filePath);
    
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            continue; // Skip processing if file doesn't exist
        }
    
        const timestamp = Date.now();
        const fileExtension = path.extname(originalname);
        const fileName = `${Student.name}_${type}_${timestamp}${fileExtension}`;
    
        // Upload file to Google Drive
        const { fileId, webViewLink } = await uploadFileWithDetails(filePath, agentFolderId, fileName);
    
        uploadResults.push({ studentRef, fileId, webViewLink });
    
        // Delete the file after successful upload
        fs.unlinkSync(filePath);
    }
    

      res.status(201).json({
        message: 'Files uploaded successfully',
        uploads: uploadResults,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Failed to upload files', error: error.message });
    }
  },
];

/**
 * Upload a file to Google Drive and return file details
 * @param {string} filePath - Local path of the file to be uploaded
 * @param {string} folderId - ID of the destination folder in Google Drive
 * @returns {Promise<object>} - Object containing fileId and webViewLink
 */
const uploadFileWithDetails = async (filePath, folderId, fileName) => {
  try {
    const fileId = await uploadFile(filePath, folderId, fileName); // Pass fileName here

    return { fileId };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};



/**
 * Create a new folder in Google Drive
 * @route POST /api/folder
 */
export const createFolderController = async (req, res) => {
  try {
    const { folderName } = req.body; // Get folder name from the request body
    if (!folderName) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folderId = await createFolder(folderName); // Call the createFolder function
    res.status(201).json({ message: 'Folder created successfully', folderId });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Failed to create folder', error: error.message });
  }
};