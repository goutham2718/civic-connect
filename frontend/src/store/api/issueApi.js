import { baseApi } from './baseApi'

export const issueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query({
      query: (params = {}) => ({
        url: '/issues',
        params
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Issue', id: _id })), { type: 'Issue', id: 'LIST' }]
          : [{ type: 'Issue', id: 'LIST' }]
    }),

    getIssueById: builder.query({
      query: (id) => `/issues/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Issue', id }]
    }),

    getMyIssues: builder.query({
      query: () => '/issues/myissues',
      transformResponse: (response) => response.data,
      providesTags: [{ type: 'Issue', id: 'MINE' }]
    }),

    createIssue: builder.mutation({
      query: (formData) => ({
        url: '/issues',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: [{ type: 'Issue', id: 'LIST' }, { type: 'Issue', id: 'MINE' }, 'Analytics']
    }),

    checkNearbyIssues: builder.mutation({
      query: (payload) => ({
        url: '/issues/check-nearby',
        method: 'POST',
        body: payload
      })
    }),

    deleteIssue: builder.mutation({
      query: (id) => ({
        url: '/issues',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: [{ type: 'Issue', id: 'LIST' }, { type: 'Issue', id: 'MINE' }, 'Analytics']
    }),

    // ---- Admin-facing ----
    getAdminIssues: builder.query({
      query: (params = {}) => ({
        url: '/issues/admin',
        params
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'AdminIssue', id: _id })), { type: 'AdminIssue', id: 'LIST' }]
          : [{ type: 'AdminIssue', id: 'LIST' }]
    }),

    updateIssueStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body: { status, note }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminIssue', id },
        { type: 'AdminIssue', id: 'LIST' },
        { type: 'Issue', id },
        'Analytics'
      ]
    }),

    reassignRoadType: builder.mutation({
      query: ({ id, note }) => ({
        url: `/issues/${id}/reassign-road-type`,
        method: 'PATCH',
        body: { note }
      }),
      invalidatesTags:(result,error,{id})=>[{ type: 'AdminIssue', id: 'LIST' },{ type: 'Issue', id }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useGetMyIssuesQuery,
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useGetAdminIssuesQuery,
  useUpdateIssueStatusMutation,
  useReassignRoadTypeMutation,
  useCheckNearbyIssuesMutation
} = issueApi