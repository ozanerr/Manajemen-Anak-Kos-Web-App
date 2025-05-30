import { rootApi } from "../api/rootApi";

export const commentsApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (postId) => `/comments/${postId}/comments`,
            providesTags: ["COMMENT"],
        }),

        addComment: builder.mutation({
            query: ({ postId, data }) => ({
                url: `comments/${postId}/createComment`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["COMMENT"],
        }),

        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `comments/${postId}/${commentId}/deleteComment`,
                method: "DELETE",
            }),
            invalidatesTags: ["COMMENT"],
        }),

        editComment: builder.mutation({
            query: ({ postId, commentId, data }) => ({
                url: `comments/${postId}/${commentId}/editComment`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["COMMENT"],
        }),

        addReply: builder.mutation({
            query: ({ postId, commentId, data }) => ({
                url: `comments/${postId}/${commentId}/createReply`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["REPLY"],
        }),

        getReplies: builder.query({
            query: ({ postId, commentId }) => ({
                url: `comments/${postId}/${commentId}/replies`,
                method: "GET",
            }),
            providesTags: ["REPLY"],
        }),

        editReply: builder.mutation({
            query: ({ postId, commentId, replyId, data }) => ({
                url: `comments/${postId}/${commentId}/${replyId}/editReply`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["REPLY"],
        }),

        deleteReply: builder.mutation({
            query: ({ postId, commentId, replyId }) => ({
                url: `comments/${postId}/${commentId}/${replyId}/deleteReply`,
                method: "DELETE",
            }),
            invalidatesTags: ["REPLY"],
        }),
    }),
});

export const {
    useFetchCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useAddReplyMutation,
    useGetRepliesQuery,
    useEditReplyMutation,
    useDeleteReplyMutation,
} = commentsApi;
