import { baseApi } from './baseApi'

export const localBodyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocalBodies: builder.query({
      query: () => '/local-bodies',
      transformResponse: (response) => response.data
    })
  }),
  overrideExisting: false
})

export const { useGetLocalBodiesQuery } = localBodyApi