import multer from 'multer';
import path from 'path';

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix + '-' + file.originalname); // Prevent file name collisions
    }
});

// Create a reusable upload middleware
export const upload = (isMultiple: boolean = false) => {
    return isMultiple ? 
        multer({ storage }).array('files', 10) : // Allow up to 10 files for multiple uploads
        multer({ storage }).single('file'); // Handle single file upload
};
