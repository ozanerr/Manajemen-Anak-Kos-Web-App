import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        imageProfile: {
            type: String,
            // required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        replies: [
            {
                username: {
                    type: String,
                    required: true,
                },
                imageProfile: {
                    type: String,
                    // required: true,
                },
                reply: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Comment", commentSchema);

export default Post;
