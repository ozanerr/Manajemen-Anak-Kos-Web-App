import express from "express";
const router = express.Router();

router.get("/:uid/getFinance");
router.post("/:uid/createFinance");
router.delete("/:uid/:financeId/deleteFinance");
router.put("/:uid/:financeId/editFinance");

export default router;
