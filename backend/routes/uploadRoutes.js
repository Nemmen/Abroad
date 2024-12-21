// import express from 'express';
// import upload from '../config/multerConfig.js';
// import { uploadGICDocuments, uploadBlockedAccountDocuments } from '../controllers/uploadController.js';

// const router = express.Router();

// // Route for GIC document uploads
// router.post('/gic', upload.fields([
//     { name: 'passport', maxCount: 1 },
//     { name: 'offerLetter', maxCount: 1 },
//     { name: 'aadhaarCard', maxCount: 1 },
//     { name: 'panCard', maxCount: 1 },
// ]), uploadGICDocuments);

// // Route for Blocked Account document uploads
// router.post('/blocked-account', upload.fields([
//     { name: 'passport', maxCount: 1 },
//     { name: 'offerLetter', maxCount: 1 },
//     { name: 'aadhaarCard', maxCount: 1 },
//     { name: 'panCard', maxCount: 1 },
// ]), uploadBlockedAccountDocuments);

// export default router;

// "folderId": "1WkdyWmBhKQAI6W_M4LNLbPylZoGZ7y6V" for gic
// 1f8tN2sgd_UBOdxpDwyQ1CMsyVvi1R96f for forex


import express from 'express';
import {uploadFileController , createFolderController} from '../controllers/fileUplaod.js';

const router = express.Router();


router.post('/upload', uploadFileController);
router.post('/folder', createFolderController);

export default router;
