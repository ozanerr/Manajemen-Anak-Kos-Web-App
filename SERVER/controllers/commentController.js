import Post from "../models/commentModel.js";
import Comment from "../models/commentModel.js";

const createComment = async (req, res) => {
    const postId = req.params.postId;

    const { username, comment } = req.body;
    try {
        const createdComment = await Comment.create({
            postId,
            username,
            comment,
        });

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

        const { username, reply } = req.body;

        const createdReply = await Comment.findOneAndUpdate(
            { _id: commentId, postId: postId },
            {
                $push: {
                    replies: {
                        username: username,
                        reply: reply,
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

export {
    createComment,
    getComments,
    deleteComment,
    editComment,
    createReply,
    getReplies,
};
