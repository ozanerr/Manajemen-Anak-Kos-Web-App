import express from "express";
import {
    createDeadline,
    deleteDeadline,
    editDeadline,
    getDeadlines,
} from "../controllers/deadlineController.js";

const router = express.Router();

router.get("/:uid/getDeadlines", getDeadlines);
router.post("/:uid/createDeadline", createDeadline);
router.put("/:uid/:deadlinesId/editDeadline", editDeadline);
router.delete("/:uid/:deadlinesId/deleteDeadline", deleteDeadline);

export default router;
