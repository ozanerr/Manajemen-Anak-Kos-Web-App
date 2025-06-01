import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        finances: [
            {
                transaksi: {
                    type: String,
                    required: true,
                },
                tipe: {
                    type: String,
                    required: true,
                },
                jumlah: {
                    type: String,
                    required: true,
                },
                tanggal: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const Finance = mongoose.model("Finance", financeSchema);

export default Finance;
