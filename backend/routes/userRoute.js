import express from "express"
import { loginUser, registerUser, getMe } from "../controllers/userController.js";
import {
  requestPasswordReset,
  verifyResetOtp,
  resetPassword,
  changePassword
} from "../controllers/passwordController.js";
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  otpRateLimiter
} from '../middleware/rateLimiter.js'
import { authenticate } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/login',loginLimiter, loginUser);
userRouter.post('/register',registerLimiter, registerUser);
userRouter.get('/me', authenticate, getMe);

// Password recovery (public — user isn't logged in yet)
userRouter.post('/forgot-password',forgotPasswordLimiter, requestPasswordReset);
userRouter.post('/verify-reset-otp',otpRateLimiter, verifyResetOtp);
userRouter.post('/reset-password',otpRateLimiter, resetPassword);

// Change password (authenticated — user knows current password)
userRouter.post('/change-password', authenticate, changePassword);

export default userRouter;