import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        deadlines: [
            {
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                start: {
                    type: String,
                    required: true,
                },
                end: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const Deadline = mongoose.model("Deadline", deadlineSchema);

export default Deadline;
