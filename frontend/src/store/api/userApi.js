import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials
      })
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data
      })
    }),

    getMe: builder.query({
      query: () => '/user/me',
      providesTags: ['Me']
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/user/forgot-password',
        method: 'POST',
        body: { email }
      })
    }),

    verifyResetOtp: builder.mutation({
      query: (payload) => ({
        url: '/user/verify-reset-otp',
        method: 'POST',
        body: payload
      })
    }),

    resetPassword: builder.mutation({
      query: (payload) => ({
        url: '/user/reset-password',
        method: 'POST',
        body: payload
      })
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/user/change-password',
        method: 'POST',
        body: payload
      })
    })
  }),
  overrideExisting: false
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation
} = userApi