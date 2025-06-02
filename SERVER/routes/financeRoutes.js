import express from "express";
import {
    createFinance,
    deleteFinance,
    editFinance,
    getFinances,
} from "../controllers/financeController.js";
const router = express.Router();

router.get("/:uid/getFinance", getFinances);
router.post("/:uid/createFinance", createFinance);
router.delete("/:uid/:financeId/deleteFinance", deleteFinance);
router.put("/:uid/:financeId/editFinance", editFinance);

export default router;
