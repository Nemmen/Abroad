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
 * Upload a file to a specific folder in Google Drive
 * @param {string} filePath - Local file path
 * @param {string} folderId - Destination folder ID
 * @returns {string} - Uploaded file ID
 */
export const uploadFile = async (filePath, folderId) => {
  const fileName = path.basename(filePath);
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
    fields: 'id',
  });

  return response.data.id;
};
