import Deadline from "../models/deadlineModel.js";

const createDeadline = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, description, start, end } = req.body;

        // Cek apakah dokumen deadline milik user sudah ada
        const existing = await Deadline.findOne({ userId });

        if (existing) {
            // Jika sudah ada, tambahkan deadline baru
            const updated = await Deadline.findOneAndUpdate(
                { userId },
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
                userId,
                deadlines: [
                    {
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
        const { userId } = req.params;
        const deadline = await Deadline.findById(userId);

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
        const { userId, deadlinesId } = req.params;

        const deletedReply = await Deadline.findOneAndUpdate(
            {
                userId: userId,
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
        const { userId, deadlinesId } = req.params;

        const { title, description, start, end } = req.body;

        const updatedReply = await Deadline.findOneAndUpdate(
            {
                userId: userId,
                "deadlines._id": deadlinesId,
            },
            {
                $set: { "deadlines.$[elem].title": title },
                $set: { "deadlines.$[elem].description": description },
                $set: { "deadlines.$[elem].start": start },
                $set: { "deadlines.$[elem].end": end },
            },
            {
                new: true,
                arrayFilters: [{ "elem._id": deadlinesId }],
            }
        );
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

export { createDeadline, getDeadlines, editDeadline, deleteDeadline };
