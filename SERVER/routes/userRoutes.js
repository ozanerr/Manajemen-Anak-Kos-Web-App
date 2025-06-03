import express from "express";
import { uploadImageFromUrlToCloudinary } from "../controllers/userController.js";

const router = express.Router();

router.post("/getUrl", uploadImageFromUrlToCloudinary);

export default router;
