import {
  createFolder,
  uploadFile,
  getOrCreateAgentFolder,
  getOrCreateStudentFolder,
} from './googleDrive.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import StudentModel from '../models/student.js';
import mongoose from 'mongoose';

// Ensure 'uploads/' directory exists
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File type not allowed'), false);
    }
    cb(null, true);
  },
});

export const multipleFileUploadMiddleware = upload.array('files', 6);

/**
 * Utility to delete a file
 * @param {string} filePath - Path to the file to delete
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error.message);
    }
  }
};

/**
 * Upload multiple files to Google Drive under a dynamic subfolder
 * @route POST /api/upload-multiple
 */
export const uploadFileController = [
  multipleFileUploadMiddleware,
  async (req, res) => {
    try {
      const { folderId, type, studentRef } = req.body;

      // Validate required parameters
      console.log(req.files,'body -',req.body)
      if (!folderId || !studentRef || !req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: 'Missing required parameters or files' });
      }

      // Validate studentRef as a valid MongoDB ObjectId
      if (!mongoose.isValidObjectId(studentRef)) {
        return res.status(400).json({ message: 'Invalid studentRef provided' });
      }

      // Retrieve student data
      const student = await StudentModel.findById(studentRef);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Get or create folder structure
      const agentFolderId = await getOrCreateAgentFolder(folderId, student.agentCode);
      const studentFolderId = await getOrCreateStudentFolder(agentFolderId, student.studentCode);
      const types = type.split(',')
      // Process file uploads
      const uploadResults = [];
      for (const [index, file] of req.files.entries()) {
        const { path: filePath, originalname } = file;
        const timestamp = Date.now();
        const fileExtension = path.extname(originalname);
        const fileName = `${student.name}_${types[index]}_${timestamp}${fileExtension}`;

        try {
          // Upload file to Google Drive
          const { fileId, viewLink } = await uploadFileWithDetails(
            filePath,
            studentFolderId,
            fileName
          );

          uploadResults.push({ fileId, viewLink });
        } catch (error) {
          console.error(`Error uploading file ${originalname}:`, error.message);
        } finally {
          // Optionally delete local file after upload
          deleteFile(filePath);
        }
      }

      // Check if any files were uploaded successfully
      if (uploadResults.length === 0) {
        return res.status(500).json({ message: 'No files were successfully uploaded' });
      }

      // Respond with upload details
      res.status(201).json({
        message: 'Files uploaded successfully',
        studentFolderId,
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
 * @param {string} fileName - Name of the file to be uploaded
 * @returns {Promise<object>} - Object containing fileId and viewLink
 */
const uploadFileWithDetails = async (filePath, folderId, fileName) => {
  try {
    const { fileId, viewLink } = await uploadFile(filePath, folderId, fileName);
    return { fileId, viewLink };
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new Error('Failed to upload file');
  }
};

/**
 * Create a new folder in Google Drive
 * @route POST /api/folder
 */
export const createFolderController = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folderId = await createFolder(folderName);
    if (!folderId) {
      throw new Error('Failed to create folder on Google Drive');
    }

    res.status(201).json({ message: 'Folder created successfully', folderId });
  } catch (error) {
    console.error('Error creating folder:', error.message);
    res
      .status(500)
      .json({ message: 'Failed to create folder', error: error.message });
  }
};
