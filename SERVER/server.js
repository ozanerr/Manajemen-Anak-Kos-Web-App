import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import cloudinary from "cloudinary";
import cors from "cors";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app = express();
app.use(express.json());
app.use(cors());

//route
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/deadline", deadlineRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/user", usersRoutes);

//connect database
ConnectDB();

//port
const port = process.env.PORT;

//server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
export default app;
