import Finance from "../models/financeModel.js";

const createFinance = async (req, res) => {
    try {
        const { uid } = req.params;
        const { transaksi, tipe, jumlah, tanggal } = req.body;

        // Cek apakah dokumen Finance milik user sudah ada
        const existing = await Finance.findOne({ uid });

        if (existing) {
            // Jika sudah ada, tambahkan Finance baru
            const updated = await Finance.findOneAndUpdate(
                { uid },
                {
                    $push: {
                        finances: {
                            transaksi,
                            tipe,
                            jumlah,
                            tanggal,
                        },
                    },
                },
                { new: true }
            );

            return res.status(200).json({
                status: "Success",
                message: "Finance added to existing user",
                data: updated,
            });
        } else {
            // Jika belum ada, buat dokumen baru
            const newFinance = await Finance.create({
                uid,
                finances: [
                    {
                        uid,
                        transaksi,
                        tipe,
                        jumlah,
                        tanggal,
                    },
                ],
            });

            return res.status(201).json({
                status: "Success",
                message: "New Finance created for user",
                data: newFinance,
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getFinances = async (req, res) => {
    try {
        const { uid } = req.params;
        const getFinances = await Finance.findOne({ uid: uid });

        if (!getFinances) {
            await Finance.create({
                uid: uid,
                finances: [],
            });
        }

        return res.status(201).json({
            status: "Success",
            data: getFinances.finances,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const deleteFinance = async (req, res) => {
    try {
        const { uid, financeId } = req.params;

        const deletedReply = await Finance.findOneAndUpdate(
            {
                uid: uid,
            },
            {
                $pull: { finances: { _id: financeId } },
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

const editFinance = async (req, res) => {
    try {
        const { uid, financeId } = req.params;

        const { transaksi, tipe, jumlah, tanggal } = req.body;

        const editedFinance = await Finance.findOneAndUpdate(
            {
                uid: uid,
                "finances._id": financeId,
            },
            {
                $set: {
                    "finances.$[elem].transaksi": transaksi,
                    "finances.$[elem].tipe": tipe,
                    "finances.$[elem].jumlah": jumlah,
                    "finances.$[elem].tanggal": tanggal,
                },
            },
            {
                new: true,
                arrayFilters: [{ "elem._id": financeId }],
            }
        );

        return res.status(201).json({
            status: "Success",
            data: editedFinance,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

export { createFinance, getFinances, editFinance, deleteFinance };
