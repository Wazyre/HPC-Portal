import express from 'express';
import multer from 'multer'; //  Import multer for file upload handling
import path from 'path';
import fs from 'fs';
import { 
  createChangeRequest, 
  getAllChangeRequests, 
  updateChangeRequestStatus,
  deleteChangeRequest,
  updateAttachment // Added import for the new attachment update function
} from '../controllers/changeRequestController.ts';

const router = express.Router();

//  Define absolute path to uploads folder so it works correctly
// regardless of where the server is run from
const uploadsDir = path.join(process.cwd(), 'uploads');

//  Create uploads folder automatically if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

//  Configure multer to save uploaded files into backend/uploads/
// Files are stored with their original name to make them identifiable
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files using absolute path
  },
  filename: (req, file, cb) => {
    // Prefix filename with timestamp to avoid duplicate file name conflicts
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Accept all file types
// Frontend already restricts file types via the accept attribute in ChangeRequest.tsx
const fileFilter = (req: any, file: any, cb: any) => {
  cb(null, true); 
};

const upload = multer({ storage, fileFilter });

router.post('/create', upload.single('attachedFile'), createChangeRequest); //  Added multer middleware to handle file on create
router.get('/all', getAllChangeRequests);
router.patch('/update/:id', updateChangeRequestStatus); 
router.delete('/delete/:id', deleteChangeRequest);
// New route to handle attachment updates (remove or replace) for PENDING logs
router.patch('/update-attachment/:id', upload.single('attachedFile'), updateAttachment);

export default router;