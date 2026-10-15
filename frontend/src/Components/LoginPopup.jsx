import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { baseApi } from '../store/api/baseApi'
import { setShowLogin } from '../store/slices/uiSlice'
import { setToken } from '../store/slices/authSlice'
import {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation
} from '../store/api/userApi'

const LoginPopup = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const redirectAfterLogin = useSelector((state) => state.ui.redirectAfterLogin)

  const [login] = useLoginMutation()
  const [register] = useRegisterMutation()
  const [forgotPassword, { isLoading: sendingOtp }] = useForgotPasswordMutation()
  const [verifyResetOtp, { isLoading: verifyingOtp }] = useVerifyResetOtpMutation()
  const [resetPassword, { isLoading: resettingPassword }] = useResetPasswordMutation()

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false) // NEW

  const [resetEmail, setResetEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onChangeHandler = (e) => {
    setData(data => ({ ...data, [e.target.name]: e.target.value }))
  }

  const onLogin = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.error('Please accept the Terms & Conditions and Privacy Policy to continue')
      return
    }

    try {
      const response = currState === "Login"
        ? await login(data).unwrap()
        : await register(data).unwrap()

      if (response.success) {
        dispatch(baseApi.util.resetApiState())
        dispatch(setToken(response.token));
        dispatch(setShowLogin(false))
        navigate(redirectAfterLogin)
      } else {
        toast.error(response.msg)
      }
    } catch (error) {
      toast.error(error.data?.msg || 'Something went wrong')
    }
  }

  // ---- Forgot password flow (unchanged) ----

  const submitForgotPassword = async (e) => {
    e.preventDefault()
    try {
      const response = await forgotPassword(resetEmail).unwrap()
      if (response.success) {
        toast.success('If this email exists, a reset code has been sent')
        setCurrState("VerifyOtp")
      }
    } catch (error) {
      toast.error(error.data?.message || 'Something went wrong')
    }
  }

  const submitVerifyOtp = async (e) => {
    e.preventDefault()
    try {
      const response = await verifyResetOtp({ email: resetEmail, otp }).unwrap()
      if (response.success) {
        toast.success('Code verified')
        setCurrState("ResetPassword")
      }
    } catch (error) {
      toast.error(error.data?.message || 'Invalid code')
    }
  }

  const submitResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    try {
      const response = await resetPassword({ email: resetEmail, newPassword }).unwrap()
      if (response.success) {
        toast.success('Password reset successfully. Please log in.')
        setResetEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setCurrState("Login")
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to reset password')
    }
  }

  return (
    <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>

      {/* ---- LOGIN / SIGN UP ---- */}
      {(currState === "Login" || currState === "Sign Up") && (
        <form onSubmit={onLogin} className='m-auto max-w-[max(23vw,330px)] text-gray-600 bg-white flex flex-col gap-6 py-6 px-7 rounded-2xl border-2 text-[14px]'>
          <div className="flex justify-between items-center text-black">
            <h1 className='text-2xl font-bold'>{currState}</h1>
            <img className='cursor-pointer' onClick={() => dispatch(setShowLogin(false))} src={assets.cross_icon} alt="" />
          </div>
          <div className="flex flex-col gap-4">
            {currState === "Sign Up" ?
              <input className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg' name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required /> : <></>
            }
            <input className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg' name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
            <input className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg' name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
          </div>

          {currState === "Login" && (
            <p
              className='text-[13px] text-blue-400 font-medium cursor-pointer -mt-4 text-right'
              onClick={() => setCurrState("Forgot")}
            >
              Forgot password?
            </p>
          )}

          <button className='p-2.5 rounded-lg text-white bg-blue-400 text-base cursor-pointer' type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>

          {/* FIXED checkbox — controlled, linked via htmlFor/id, links don't toggle the box */}
          <div className="flex items-start gap-2.5 mt-[-15px]">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="acceptTerms" className='text-[13px] leading-4 text-gray-500 cursor-pointer'>
              By continuing, I agree to the{' '}
              <Link
                to="/terms"
                onClick={() => dispatch(setShowLogin(false))}
                className="text-blue-500 font-medium hover:underline"
              >
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                onClick={() => dispatch(setShowLogin(false))}
                className="text-blue-500 font-medium hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {
            currState === "Sign Up" ?
              <p className='text-[13px] tracking-tighter leading-4'>Already have an account ? <span className='text-blue-400 font-medium cursor-pointer' onClick={() => setCurrState("Login")}>Login here</span></p> :
              <p className='text-[13px] tracking-tighter leading-4'>Create a new account ? <span className='text-blue-400 font-medium cursor-pointer' onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          }
        </form>
      )}

      {/* ---- rest of the file (Forgot/VerifyOtp/ResetPassword) stays exactly the same ---- */}
      {currState === "Forgot" && (
        <form onSubmit={submitForgotPassword} className='m-auto max-w-[max(23vw,330px)] text-gray-600 bg-white flex flex-col gap-6 py-6 px-7 rounded-2xl border-2 text-[14px]'>
          <div className="flex justify-between items-center text-black">
            <h1 className='text-2xl font-bold'>Reset Password</h1>
            <img className='cursor-pointer' onClick={() => dispatch(setShowLogin(false))} src={assets.cross_icon} alt="" />
          </div>
          <p className='text-slate-500'>Enter your email and we'll send you a reset code.</p>
          <input
            className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg'
            type="email" placeholder='Email address' required
            value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
          />
          <button disabled={sendingOtp} className='p-2.5 rounded-lg text-white bg-blue-400 text-base cursor-pointer disabled:bg-blue-200' type='submit'>
            {sendingOtp ? 'Sending...' : 'Send Reset Code'}
          </button>
          <p className='text-[13px] tracking-tighter leading-4'>
            Remembered your password ? <span className='text-blue-400 font-medium cursor-pointer' onClick={() => setCurrState("Login")}>Back to login</span>
          </p>
        </form>
      )}

      {currState === "VerifyOtp" && (
        <form onSubmit={submitVerifyOtp} className='m-auto max-w-[max(23vw,330px)] text-gray-600 bg-white flex flex-col gap-6 py-6 px-7 rounded-2xl border-2 text-[14px]'>
          <div className="flex justify-between items-center text-black">
            <h1 className='text-2xl font-bold'>Enter Code</h1>
            <img className='cursor-pointer' onClick={() => dispatch(setShowLogin(false))} src={assets.cross_icon} alt="" />
          </div>
          <p className='text-slate-500'>We sent a 6-digit code to <span className='font-medium text-slate-700'>{resetEmail}</span></p>
          <input
            className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg text-center tracking-[8px] text-lg'
            type="text" placeholder='------' maxLength={6} required
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          />
          <button disabled={verifyingOtp} className='p-2.5 rounded-lg text-white bg-blue-400 text-base cursor-pointer disabled:bg-blue-200' type='submit'>
            {verifyingOtp ? 'Verifying...' : 'Verify Code'}
          </button>
          <p className='text-[13px] tracking-tighter leading-4'>
            Didn't get a code ? <span className='text-blue-400 font-medium cursor-pointer' onClick={() => setCurrState("Forgot")}>Resend</span>
          </p>
        </form>
      )}

      {currState === "ResetPassword" && (
        <form onSubmit={submitResetPassword} className='m-auto max-w-[max(23vw,330px)] text-gray-600 bg-white flex flex-col gap-6 py-6 px-7 rounded-2xl border-2 text-[14px]'>
          <div className="flex justify-between items-center text-black">
            <h1 className='text-2xl font-bold'>New Password</h1>
            <img className='cursor-pointer' onClick={() => dispatch(setShowLogin(false))} src={assets.cross_icon} alt="" />
          </div>
          <input
            className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg'
            type="password" placeholder='New password' required minLength={8}
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className='outline-none border border-[#c9c9c9] p-2.5 rounded-lg'
            type="password" placeholder='Confirm new password' required minLength={8}
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button disabled={resettingPassword} className='p-2.5 rounded-lg text-white bg-blue-400 text-base cursor-pointer disabled:bg-blue-200' type='submit'>
            {resettingPassword ? 'Saving...' : 'Reset Password'}
          </button>
        </form>
      )}

    </div>
  )
}

export default LoginPopup