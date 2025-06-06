import express from "express";
import {
    createPost,
    getPosts,
    editPost,
    deletePost,
    getPostByUid,
    getPostById,
} from "../controllers/postController.js";

const router = express.Router();

//CRUD
router.post("/create", createPost);
router.get("/posts", getPosts);
router.get("/:uid/own", getPostByUid);
router.get("/:postId", getPostById);
router.put("/:postId/editPost", editPost);
router.delete("/:postId/deletePost", deletePost);

export default router;
