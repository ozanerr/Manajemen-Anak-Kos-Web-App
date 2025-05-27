import express from "express";
import {
    createDeadline,
    deleteDeadline,
    editDeadline,
    getDeadlines,
} from "../controllers/deadlineController.js";

const router = express.Router();

router.get("/:userId/getDeadline", getDeadlines);
router.post("/createDeadline", createDeadline);
router.put("/:userId/:deadlinesId/editDeadline", editDeadline);
router.delete("/:userId/:deadlinesId/deleteDeadline", deleteDeadline);

export default router;
