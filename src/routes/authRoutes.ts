import express from 'express';
import { login, register } from '../controllers/userController';
import { getUser } from '../controllers/commonController';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get("/profile", authMiddleware(["admin","user","client"]), getUser)

export default router;
