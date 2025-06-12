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
                if (socket.connected) {
                    console.log(
                        "Socket is already connected. Skipping duplicate setup."
                    );
                    return;
                }

                socket.connect();

                try {
                    await cacheDataLoaded;
                    console.log(
                        "Posts cache loaded, ready to listen for events..."
                    );

                    const handleEvent = (event, data) => {
                        console.log(`Socket event received: ${event}`, data);
                        updateCachedData((draft) => {
                            if (!draft.data) return;

                            if (event === "newPost") {
                                const postExists = draft.data.some(
                                    (p) => p._id === data._id
                                );
                                if (!postExists) {
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

                    socket.on("newPost", (data) =>
                        handleEvent("newPost", data)
                    );
                    socket.on("postUpdated", (data) =>
                        handleEvent("postUpdated", data)
                    );
                    socket.on("postDeleted", (data) =>
                        handleEvent("postDeleted", data)
                    );
                } catch (error) {
                    console.error("Failed to start socket listener:", error);
                }

                await cacheEntryRemoved;

                console.log("Removing listeners and disconnecting socket.");
                socket.off("newPost");
                socket.off("postUpdated");
                socket.off("postDeleted");
                socket.disconnect();
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
            async onQueryStarted(arg, { queryFulfilled }) {
                console.log("--- addPost MUTATION STARTED ---");
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error("Failed to run addPost mutation:", err);
                }
            },
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
