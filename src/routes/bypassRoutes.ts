import express from 'express';
import { uploadFileMultiple, uploadFileSingle } from '../controllers/imageController';
import { uploadFileWithoutSave } from '../utils/uploadFileWithoutSave';
import { callBackAfterPayment } from '../controllers/paymentController';
const router = express.Router();

router.post("/upload",uploadFileWithoutSave(false),uploadFileSingle)
router.post("/upload-multiple",uploadFileWithoutSave(true),uploadFileMultiple);
router.post('/razorpay/callback', callBackAfterPayment);
export default router;
