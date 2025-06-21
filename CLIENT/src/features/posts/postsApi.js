import { rootApi } from "../api/rootApi.js";
import { socket } from "../../socket.js";

export const postsApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: () => "/posts/posts",
            providesTags: ["POST"],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                if (!socket.connected) {
                    socket.connect();
                }

                try {
                    await cacheDataLoaded;

                    const handleEvent = (event, data) => {
                        updateCachedData((draft) => {
                            if (!draft || !draft.data) return;

                            if (event === "newPost") {
                                if (
                                    !draft.data.some((p) => p._id === data._id)
                                ) {
                                    draft.data.unshift(data);
                                }
                            }
                            if (event === "postUpdated") {
                                const index = draft.data.findIndex(
                                    (post) => post._id === data._id
                                );
                                if (index !== -1) {
                                    draft.data[index] = data;
                                }
                            }
                            if (event === "postDeleted") {
                                draft.data = draft.data.filter(
                                    (post) => post._id !== data.postId
                                );
                            }
                        });
                    };

                    const newPostListener = (data) =>
                        handleEvent("newPost", data);
                    const postUpdatedListener = (data) =>
                        handleEvent("postUpdated", data);
                    const postDeletedListener = (data) =>
                        handleEvent("postDeleted", data);

                    socket.on("newPost", newPostListener);
                    socket.on("postUpdated", postUpdatedListener);
                    socket.on("postDeleted", postDeletedListener);

                    await cacheEntryRemoved;

                    socket.off("newPost", newPostListener);
                    socket.off("postUpdated", postUpdatedListener);
                    socket.off("postDeleted", postDeletedListener);
                } catch (error) {
                    console.error(
                        "Gagal memulai listener socket untuk posts:",
                        error
                    );
                }
            },
        }),

        fetchSinglePost: builder.query({
            query: (postId) => `/posts/${postId}`,
            providesTags: (result, error, arg) => [{ type: "POST", id: arg }],
        }),

        fetchOwnPost: builder.query({
            query: (uid) => `posts/${uid}/own`,
            providesTags: ["POST"],
        }),

        addPost: builder.mutation({
            query: (data) => ({
                url: "posts/create",
                method: "POST",
                body: data,
            }),
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
