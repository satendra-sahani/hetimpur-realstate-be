import multer from "multer";

// Memory storage for file uploads (files stored in memory as Buffer)
const storage = multer.memoryStorage();

// Upload middleware, handles both single and multiple file uploads
export const uploadFileWithoutSave = (isMultiple: boolean = false) => {
  return isMultiple
    ? multer({ storage }).array('files', 10) // For multiple files, up to 10 files
    : multer({ storage }).single('file');    // For a single file
};

