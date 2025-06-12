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
import http from "http";
import { Server } from "socket.io";

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

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.set("socketio", io);

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/deadline", deadlineRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/user", usersRoutes);

ConnectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

export default app;
