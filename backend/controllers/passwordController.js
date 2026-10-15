import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { sendOtpEmail } from '../utils/sendEmail.js'

const OTP_EXPIRY_MINUTES = 10
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString() // 6-digit

// POST /api/user/forgot-password
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      // Deliberately vague — don't reveal whether an email exists in the system
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset code has been sent'
      })
    }

    const otp = generateOtp()
    const salt = await bcrypt.genSalt(10)
    const hashedOtp = await bcrypt.hash(otp, salt)

    user.resetPasswordOtp = hashedOtp
    user.resetPasswordOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
    user.resetPasswordVerified = false
    await user.save()

    await sendOtpEmail(user.email, otp, user.name)

    res.status(200).json({
      success: true,
      message: 'Reset code has been sent'
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process request'})
  }
}

// POST /api/user/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    const user = await userModel.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpiry')

    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' })
    }

    if (user.resetPasswordOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'This code has expired. Please request a new one.' })
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect code' })
    }

    user.resetPasswordVerified = true
    await user.save()

    res.status(200).json({ success: true, message: 'Code verified. You can now reset your password.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to verify code'})
  }
}

// POST /api/user/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }

    const user = await userModel.findOne({ email }).select('+resetPasswordOtp +resetPasswordOtpExpiry +resetPasswordVerified')

    if (!user || !user.resetPasswordVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your reset code first' })
    }

    if (user.resetPasswordOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Your session has expired. Please start over.' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    // Clear all reset fields so this OTP can't be reused
    user.resetPasswordOtp = undefined
    user.resetPasswordOtpExpiry = undefined
    user.resetPasswordVerified = false

    await user.save()

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset password'})
  }
}

// POST /api/user/change-password (authenticated — for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' })
    }

    const user = await userModel.findById(req.user._id)
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password'})
  }
}