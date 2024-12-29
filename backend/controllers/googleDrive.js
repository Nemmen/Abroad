import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Load service account credentials
const KEYFILE_PATH = path.join('config', 'service-account-key.json'); // Adjust this if needed
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Upload a file to a specific folder in Google Drive and return its file ID and view link
 * @param {string} filePath - Local file path
 * @param {string} folderId - Destination folder ID
 * @param {string} fileName - Name of the file to be uploaded
 * @returns {Promise<{ fileId: string, viewLink: string }>} - Object containing file ID and view link
 */
export const uploadFile = async (filePath, folderId, fileName) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink', // Request both file ID and webViewLink
    });

    const fileId = response.data.id;
    const viewLink = response.data.webViewLink;

    // Grant view-only access to the file
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader', // View-only access
        type: 'anyone', // Access for anyone with the link
      },
    });

    return { fileId, viewLink }; // Return both file ID and view link
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};


/**
 * Create a folder in Google Drive
 * @param {string} name - The name of the folder
 * @returns {string} - The folder ID
 */
export const createFolder = async (folderName, parentFolderId) => {
  try {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : [], // Optional parent folder
    };

    const res = await drive.files.create({
      resource: fileMetadata,
      fields: 'id', // Only return the folder ID
    });

    return res.data.id; // Return the newly created folder ID
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }
};

/**
 * Search for an existing folder by name inside a specific parent folder
 * @param {string} parentFolderId - The parent folder ID where we search for the folder
 * @param {string} folderName - The name of the folder to search for
 * @returns {Promise<string | null>} - Returns the folder ID if found, otherwise null
 */
const searchFolder = async (parentFolderId, folderName) => {
  try {
    const query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents`;
    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name)', // Get the file ID and name
    });

    const folder = res.data.files[0]; // Get the first matching folder
    return folder ? folder.id : null; // Return folder ID if found, else null
  } catch (error) {
    console.error('Error searching for folder:', error);
    throw new Error('Failed to search for folder');
  }
};

/**
 * Get or create an agent folder inside a parent folder
 * @param {string} parentFolderId - The parent folder ID
 * @param {string} agentCode - The agent code used as the folder name
 * @returns {Promise<string>} - Returns the folder ID (either existing or newly created)
 */
export const getOrCreateAgentFolder = async (parentFolderId, agentCode) => {
  try {
    const existingFolderId = await searchFolder(parentFolderId, agentCode);

    if (existingFolderId) {
      return existingFolderId; // Return if folder exists
    }

    const folderId = await createFolder(agentCode, parentFolderId);
    return folderId; // Return the newly created folder ID
  } catch (error) {
    console.error('Error creating or retrieving agent folder:', error);
    throw new Error('Failed to retrieve or create agent folder');
  }
};

/**
 * Get or create a student folder inside an agent folder
 * @param {string} agentFolderId - The parent agent folder ID
 * @param {string} studentName - The student name or ID used as the folder name
 * @returns {Promise<string>} - Returns the folder ID (either existing or newly created)
 */
export const getOrCreateStudentFolder = async (agentFolderId, studentName) => {
  try {
    const existingFolderId = await searchFolder(agentFolderId, studentName);

    if (existingFolderId) {
      return existingFolderId; // Return if the folder already exists
    }

    const folderId = await createFolder(studentName, agentFolderId);
    return folderId; // Return the newly created folder ID
  } catch (error) {
    console.error('Error creating or retrieving student folder:', error);
    throw new Error('Failed to retrieve or create student folder');
  }
};
