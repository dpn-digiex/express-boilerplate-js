import express from 'express';

import {
  generateNewAccessToken,
  login,
  logout,
  forgetPassword,
  verifyCode,
  resetPassword
} from '../controller/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-code', verifyCode);
router.post('/logout', verifyToken, logout);
router.post('/refresh-access-token', generateNewAccessToken);
router.post('/reset-password', resetPassword);
export default router;
