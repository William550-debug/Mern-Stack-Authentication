import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyOtp , sendResetOtp, resetPassword, isAuthenticated, verifyResetOtp} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';



const authRouter = express.Router();


authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/verify-otp', userAuth, verifyOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp)

authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;