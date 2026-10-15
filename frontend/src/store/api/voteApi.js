import { baseApi } from './baseApi'

export const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyVotes: builder.query({
      query: () => '/vote/myVotes',
      transformResponse: (response) => response.data,
      providesTags: ['Vote']
    }),

    upvoteIssue: builder.mutation({
      query: (issueId) => ({
        url: '/vote/upvote',
        method: 'POST',
        body: { issueId }
      }),
      // Update the "my votes" cache instantly, undo if the server fails
      async onQueryStarted(issueId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          voteApi.util.updateQueryData('getMyVotes', undefined, (draft) => {
            if (!draft.includes(issueId)) draft.push(issueId)
          })
        )
        try {
          const { data } = await queryFulfilled
          if (!data.success) patch.undo()
        } catch {
          patch.undo()
        }
      },
      // Refresh only this issue's data in the background (no Vote refetch)
      invalidatesTags: (result, error, issueId) => [{ type: 'Issue', id: issueId }]
    }),

    removeUpvote: builder.mutation({
      query: (issueId) => ({
        url: '/vote/upvote',
        method: 'DELETE',
        body: { issueId }
      }),
      async onQueryStarted(issueId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          voteApi.util.updateQueryData('getMyVotes', undefined, (draft) => {
            const index = draft.indexOf(issueId)
            if (index !== -1) draft.splice(index, 1)
          })
        )
        try {
          const { data } = await queryFulfilled
          if (!data.success) patch.undo()
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: (result, error, issueId) => [{ type: 'Issue', id: issueId }]
    })
  }),
  overrideExisting: false
})

export const {
  useGetMyVotesQuery,
  useUpvoteIssueMutation,
  useRemoveUpvoteMutation
} = voteApi