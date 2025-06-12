import { rootApi } from "../api/rootApi";

export const commentsApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (postId) => `/comments/${postId}/comments`,
            providesTags: ["COMMENT"],
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
                socket.emit("joinPostRoom", postId);

                try {
                    await cacheDataLoaded;
                    console.log(
                        "Comment cache loaded, ready to listen for events..."
                    );

                    const handleEvent = (event, data) => {
                        console.log(`Socket event received: ${event}`, data);
                        updateCachedData((draft) => {
                            if (!draft.data) return;

                            if (event === "newComment") {
                                const commentExist = draft.data.some(
                                    (comment) => comment._id === data._id
                                );
                                if (!commentExist) {
                                    draft.data.unshift(data);
                                }
                            }
                            if (event === "commentUpdated") {
                                const index = draft.data.findIndex(
                                    (comment) => comment._id === data._id
                                );
                                if (index !== -1) {
                                    draft.data[index] = data;
                                }
                            }
                            if (event === "commentDeleted") {
                                draft.data = draft.data.filter(
                                    (comment) => comment._id !== data.commentId
                                );
                            }
                        });
                    };

                    socket.on("newComment", (data) =>
                        handleEvent("newComment", data)
                    );
                    socket.on("commentUpdated", (data) =>
                        handleEvent("commentUpdated", data)
                    );
                    socket.on("commentDeleted", (data) =>
                        handleEvent("commentDeleted", data)
                    );
                } catch (error) {
                    console.error("Failed to start socket listener:", error);
                }

                await cacheEntryRemoved;
                socket.emit("leavePostRoom", postId);

                console.log("Removing listeners and disconnecting socket.");
                socket.off("newComment");
                socket.off("commentUpdated");
                socket.off("commentDeleted");
                socket.disconnect();
            },
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
