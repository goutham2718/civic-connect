import { baseApi } from './baseApi'

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query({
      query: () => '/analytics/overview',
      transformResponse: (response) => response.data,
      providesTags: ['Analytics']
    }),
    getResolutionTimeAnalytics: builder.query({
      query: () => '/analytics/resolution-time',
      transformResponse: (response) => response.data,
      providesTags: ['Analytics']
    })
  }),
  overrideExisting: false
})

export const {
  useGetAnalyticsOverviewQuery,
  useGetResolutionTimeAnalyticsQuery
} = analyticsApi