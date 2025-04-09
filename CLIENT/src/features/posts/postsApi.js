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

        addPost: builder.mutation({
            query: (data) => ({
                url: "posts/create",
                method: "POST",
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
} = postsApi;
