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
 * Create a folder in Google Drive
 * @param {string} name - The name of the folder
 * @returns {string} - The folder ID
 */
export const createFolder = async (name) => {
  const fileMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  return response.data.id;
};

/**
 * Upload a file to a specific folder in Google Drive and return its view link with view-only access
 * @param {string} filePath - Local file path
 * @param {string} folderId - Destination folder ID
 * @returns {string} - View link for the uploaded file
 */
export const uploadFile = async (filePath, folderId,fileName) => {
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
    fields: 'id, webViewLink',
  });

  const fileId = response.data.id;

  // Grant view-only access to the file
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader', // View-only access
      type: 'anyone', // Access for anyone with the link
    },
  });

  return response.data.webViewLink;
};



/**
 * Search for an existing folder by name inside a specific parent folder
 * @param {string} parentFolderId - The parent folder ID where we search for the agent folder
 * @param {string} agentCode - The agent code (used as the folder name)
 * @returns {Promise<string | null>} - Returns the folder ID if found, otherwise null
 */
const searchFolder = async (parentFolderId, agentCode) => {
  try {
    // Search for a folder with the agentCode name inside the parent folder
    const query = `name = '${agentCode}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents`;
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
 * Create a new folder in Google Drive within the specified parent folder
 * @param {string} folderName - The name of the folder to create
 * @param {string} parentFolderId - The parent folder ID
 * @returns {Promise<string>} - Returns the created folder ID
 */
const createFolder1 = async (folderName, parentFolderId) => {
  try {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId], // Set the parent folder
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
 * Get or create an agent folder inside a parent folder
 * @param {string} parentFolderId - The parent folder ID
 * @param {string} agentCode - The agent code used as the folder name
 * @returns {Promise<string>} - Returns the folder ID (either existing or newly created)
 */
export const getOrCreateAgentFolder = async (parentFolderId, agentCode) => {
  try {
    // Search for an existing subfolder by name (agentCode)
    const existingFolderId = await searchFolder(parentFolderId, agentCode);

    if (existingFolderId) {
      return existingFolderId; // Return if folder exists
    }

    // If folder doesn't exist, create a new one
    const folderId = await createFolder1(agentCode, parentFolderId);
    return folderId; // Return the newly created folder ID
  } catch (error) {
    console.error('Error creating or retrieving agent folder:', error);
    throw new Error('Failed to retrieve or create agent folder');
  }
};