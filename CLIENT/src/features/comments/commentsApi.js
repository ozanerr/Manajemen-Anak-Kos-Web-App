import { rootApi } from "../api/rootApi";
import { socket } from "../../socket.js";

export const commentsApi = rootApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (postId) => `/comments/${postId}/comments`,
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const postId = arg;

                socket.emit("joinPostRoom", postId);

                try {
                    await cacheDataLoaded;

                    const handleEvent = (event, data) => {
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

                    const newCommentListener = (data) =>
                        handleEvent("newComment", data);
                    const commentUpdatedListener = (data) =>
                        handleEvent("commentUpdated", data);
                    const commentDeletedListener = (data) =>
                        handleEvent("commentDeleted", data);

                    socket.on("newComment", newCommentListener);
                    socket.on("commentUpdated", commentUpdatedListener);
                    socket.on("commentDeleted", commentDeletedListener);

                    await cacheEntryRemoved;

                    socket.emit("leavePostRoom", postId);
                    socket.off("newComment", newCommentListener);
                    socket.off("commentUpdated", commentUpdatedListener);
                    socket.off("commentDeleted", commentDeletedListener);
                } catch (error) {
                    console.error("Failed to start socket listener:", error);
                }
            },
        }),

        addComment: builder.mutation({
            query: ({ postId, data }) => ({
                url: `comments/${postId}/createComment`,
                method: "POST",
                body: data,
            }),
        }),

        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `comments/${postId}/${commentId}/deleteComment`,
                method: "DELETE",
            }),
        }),

        editComment: builder.mutation({
            query: ({ postId, commentId, data }) => ({
                url: `comments/${postId}/${commentId}/editComment`,
                method: "PUT",
                body: data,
            }),
        }),

        addReply: builder.mutation({
            query: ({ postId, commentId, data }) => ({
                url: `comments/${postId}/${commentId}/createReply`,
                method: "POST",
                body: data,
            }),
        }),

        getReplies: builder.query({
            query: ({ postId, commentId }) => ({
                url: `comments/${postId}/${commentId}/replies`,
                method: "GET",
            }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const { commentId } = arg;

                try {
                    await cacheDataLoaded;

                    const handleReplyEvent = (event, data) => {
                        if (data.commentId !== commentId) return;

                        updateCachedData((draft) => {
                            if (!draft || !draft.data) return;
                            if (event === "newReply") {
                                if (
                                    !draft.data.some(
                                        (r) => r._id === data.reply._id
                                    )
                                ) {
                                    draft.data.push(data.reply);
                                }
                            }
                            if (event === "replyUpdated") {
                                const index = draft.data.findIndex(
                                    (r) => r._id === data.reply._id
                                );
                                if (index !== -1)
                                    draft.data[index] = data.reply;
                            }
                            if (event === "replyDeleted") {
                                draft.data = draft.data.filter(
                                    (r) => r._id !== data.replyId
                                );
                            }
                        });
                    };

                    const newReplyListener = (data) =>
                        handleReplyEvent("newReply", data);
                    const replyUpdatedListener = (data) =>
                        handleReplyEvent("replyUpdated", data);
                    const replyDeletedListener = (data) =>
                        handleReplyEvent("replyDeleted", data);

                    socket.on("newReply", newReplyListener);
                    socket.on("replyUpdated", replyUpdatedListener);
                    socket.on("replyDeleted", replyDeletedListener);

                    await cacheEntryRemoved;

                    socket.off("newReply", newReplyListener);
                    socket.off("replyUpdated", replyUpdatedListener);
                    socket.off("replyDeleted", replyDeletedListener);
                } catch (error) {
                    console.error(
                        "Gagal memulai listener socket untuk replies:",
                        error
                    );
                }
            },
        }),

        editReply: builder.mutation({
            query: ({ postId, commentId, replyId, data }) => ({
                url: `comments/${postId}/${commentId}/${replyId}/editReply`,
                method: "PUT",
                body: data,
            }),
        }),

        deleteReply: builder.mutation({
            query: ({ postId, commentId, replyId }) => ({
                url: `comments/${postId}/${commentId}/${replyId}/deleteReply`,
                method: "DELETE",
            }),
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
