import { rootApi } from "../api/rootApi";

export const postsApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: () => "/posts/posts",
            providesTags: ["POST"],
        }),

        fetchSinglePost: builder.query({
            query: (postId) => `/posts/${postId}`,
        }),

        fetchOwnPost: builder.query({
            query: (uid) => ({
                url: `posts/${uid}/own`,
            }),
        }),

        addPost: builder.mutation({
            query: (data) => ({
                url: "posts/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["POST"],
        }),
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `posts/${postId}/deletePost`,
                method: "DELETE",
            }),
            invalidatesTags: ["POST"],
        }),
        editPost: builder.mutation({
            query: ({ postId, data }) => ({
                url: `posts/${postId}/editPost`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["POST"],
        }),
    }),
});

export const {
    useFetchPostsQuery,
    useFetchSinglePostQuery,
    useAddPostMutation,
    useDeletePostMutation,
    useEditPostMutation,
    useFetchOwnPostQuery,
} = postsApi;
