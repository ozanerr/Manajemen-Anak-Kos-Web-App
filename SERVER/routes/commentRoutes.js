import express from "express";
import {
    createComment,
    createReply,
    deleteComment,
    deleteReply,
    editComment,
    editReply,
    getComments,
    getReplies,
} from "../controllers/commentController.js";

const router = express.Router();

// CRUD Comment
router.post("/:postId/createComment", createComment);
router.get("/:postId/comments", getComments);
router.put("/:postId/:commentId/editComment", editComment);
router.delete("/:postId/:commentId/deleteComment", deleteComment);

//CRUD Reply
router.post("/:postId/:commentId/createReply", createReply);
router.get("/:postId/:commentId/replies", getReplies);
router.put("/:postId/:commentId/:replyId/editReply", editReply);
router.delete("/:postId/:commentId/:replyId/deleteReply", deleteReply);

export default router;
