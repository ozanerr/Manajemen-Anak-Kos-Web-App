import Post from "../models/commentModel.js";
import Comment from "../models/commentModel.js";

const createComment = async (req, res) => {
    const postId = req.params.postId;

    const { uid, username, comment, imageProfile } = req.body;
    try {
        const createdComment = await Comment.create({
            uid,
            postId,
            username,
            comment,
            imageProfile,
        });

        const io = req.app.get("socketio");
        io.to(postId).emit("newComment", createdComment);

        return res.status(201).json({
            status: "Success",
            data: createdComment,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId }).sort({
            createdAt: "desc",
        });

        return res.status(201).json({
            status: "Success",
            data: comments,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const deletedComment = await Comment.findOneAndDelete({
            _id: commentId,
            postId: postId,
        });

        const io = req.app.get("socketio");
        io.to(postId).emit("commentDeleted", {
            postId: postId,
            commentId: commentId,
        });

        return res.status(201).json({
            status: "Success",
            data: deletedComment,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const editComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const { comment } = req.body;

        const editedComment = await Comment.findOneAndUpdate(
            { _id: commentId, postId: postId },
            { $set: { comment: comment } },
            { new: true }
        );

        const io = req.app.get("socketio");
        io.to(postId).emit("commentUpdated", editedComment);

        return res.status(201).json({
            status: "Success",
            data: editedComment,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const createReply = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const { uid, username, reply, imageProfile } = req.body;

        const createdReply = await Comment.findOneAndUpdate(
            { _id: commentId, postId: postId },
            {
                $push: {
                    replies: {
                        uid: uid,
                        username: username,
                        reply: reply,
                        imageProfile: imageProfile,
                    },
                },
            }
        );

        return res.status(201).json({
            status: "Success",
            data: createdReply,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getReplies = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const replies = await Comment.findOne({
            _id: commentId,
            postId: postId,
        });

        return res.status(201).json({
            status: "Success",
            data: replies.replies,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const editReply = async (req, res) => {
    try {
        const { postId, commentId, replyId } = req.params;
        const { reply } = req.body;

        const updatedReply = await Comment.findOneAndUpdate(
            {
                _id: commentId,
                postId: postId,
                "replies._id": replyId,
            },
            {
                $set: { "replies.$[elem].reply": reply },
            },
            {
                new: true,
                arrayFilters: [{ "elem._id": replyId }],
            }
        );

        return res.status(201).json({
            status: "Success",
            data: updatedReply,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const deleteReply = async (req, res) => {
    try {
        const { postId, commentId, replyId } = req.params;

        const deletedReply = await Comment.findOneAndUpdate(
            {
                _id: commentId,
                postId: postId,
            },
            {
                $pull: { replies: { _id: replyId } },
            },
            {
                new: true,
            }
        );

        return res.status(201).json({
            status: "Success",
            data: deletedReply,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

export {
    createComment,
    getComments,
    deleteComment,
    editComment,
    createReply,
    getReplies,
    editReply,
    deleteReply,
};
