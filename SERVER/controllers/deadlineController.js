import Deadline from "../models/deadlineModel.js";

const createDeadline = async (req, res) => {
    try {
        const { uid } = req.params;
        const { title, description, start, end } = req.body;

        const existing = await Deadline.findOne({ uid });

        if (existing) {
            const updated = await Deadline.findOneAndUpdate(
                { uid },
                {
                    $push: {
                        deadlines: {
                            title,
                            description,
                            start,
                            end,
                        },
                    },
                },
                { new: true }
            );

            return res.status(200).json({
                status: "Success",
                message: "Deadline added to existing user",
                data: updated,
            });
        } else {
            // Jika belum ada, buat dokumen baru
            const newDeadline = await Deadline.create({
                uid,
                deadlines: [
                    {
                        uid,
                        title,
                        description,
                        start,
                        end,
                    },
                ],
            });

            return res.status(201).json({
                status: "Success",
                message: "New deadline created for user",
                data: newDeadline,
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getDeadlines = async (req, res) => {
    try {
        const { uid } = req.params;
        const deadline = await Deadline.findOne({ uid: uid });

        return res.status(201).json({
            status: "Success",
            data: deadline.deadlines,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const deleteDeadline = async (req, res) => {
    try {
        const { uid, deadlinesId } = req.params;

        const deletedReply = await Deadline.findOneAndUpdate(
            {
                uid: uid,
            },
            {
                $pull: { deadlines: { _id: deadlinesId } },
            },
            {
                new: true,
            }
        );

        return res.status(201).json({
            status: "Success",
            data: deletedReply,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const editDeadline = async (req, res) => {
    try {
        const { uid, deadlinesId } = req.params;

        const { title, description, start, end } = req.body;

        const editedDeadline = await Deadline.findOneAndUpdate(
            {
                uid: uid,
                "deadlines._id": deadlinesId,
            },
            {
                $set: {
                    "deadlines.$[elem].title": title,
                    "deadlines.$[elem].description": description,
                    "deadlines.$[elem].start": start,
                    "deadlines.$[elem].end": end,
                },
            },
            {
                new: true,
                arrayFilters: [{ "elem._id": deadlinesId }],
            }
        );

        return res.status(201).json({
            status: "Success",
            data: editedDeadline,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

export { createDeadline, getDeadlines, editDeadline, deleteDeadline };
