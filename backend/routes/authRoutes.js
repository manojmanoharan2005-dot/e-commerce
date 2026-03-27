import express from 'express';
import {
	register,
	verifyRegistrationOtp,
	login,
	requestLoginOtp,
	loginWithOtp,
	requestPasswordOtp,
	verifyPasswordOtp,
	changePasswordWithOtp,
	getMe,
	updateProfile,
	deleteAccount,
	lookupPincode
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-verify', verifyRegistrationOtp);
router.post('/login', login);
router.post('/request-otp', requestLoginOtp);
router.post('/login-otp', loginWithOtp);
router.post('/request-password-otp', protect, requestPasswordOtp);
router.post('/verify-password-otp', protect, verifyPasswordOtp);
router.post('/change-password-otp', protect, changePasswordWithOtp);
router.get('/pincode/:pincode', lookupPincode);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

export default router;
