import express from "express";

const router = express.router();

router.get("/:userId/getDeadline");
router.post("/createDeadline");
router.put("/:userId/:deadlinesId/editDeadline");
router.delete("/:userId/:deadlinesId/deleteDeadline");

export default router;
