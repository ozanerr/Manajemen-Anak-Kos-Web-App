import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        judul: {
            type: String,
            required: true,
        },
        deskripsi: {
            type: String,
            required: true,
        },
        kota: {
            type: String,
            required: true,
        },
        gambar: {
            type: String,
            default: null,
        },
        username: {
            type: String,
            required: true,
        },
        imageProfile: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
