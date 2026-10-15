import { baseApi } from './baseApi'

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: () => '/admin/admins',
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Admin', id: _id })), { type: 'Admin', id: 'LIST' }]
          : [{ type: 'Admin', id: 'LIST' }]
    }),

    createDeptAdmin: builder.mutation({
      query: (payload) => ({
        url: '/admin/create-dept-admin',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }]
    }),

    updateAdminDepartments: builder.mutation({
      query: ({ id, department }) => ({
        url: `/admin/admins/${id}`,
        method: 'PATCH',
        body: { department }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }, { type: 'Admin', id: 'LIST' }]
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetAllAdminsQuery,
  useCreateDeptAdminMutation,
  useUpdateAdminDepartmentsMutation,
  useDeleteAdminMutation
} = adminApi