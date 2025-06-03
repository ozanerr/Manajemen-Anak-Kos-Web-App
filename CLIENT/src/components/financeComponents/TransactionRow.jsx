import { Edit2, Trash2 } from "lucide-react";

const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Math.abs(amount));

const TransactionRow = ({ transaction, onEdit, onDelete }) => {
    const { _id, transaksi, tipe, jumlah, tanggal } = transaction;
    return (
        <tr className="hover:bg-blue-500/5 transition-colors duration-150 ease-in-out">
            <td className="py-3.5 px-4">
                <span className="text-gray-700 font-medium">{transaksi}</span>
            </td>
            <td className="py-3.5 px-4">
                <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tipe === "Pemasukan"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {tipe === "Pemasukan" ? "Pemasukan" : "Pengeluaran"}
                </span>
            </td>
            <td className="py-3.5 px-4 text-left">
                <span
                    className={`font-semibold ${
                        tipe === "Pemasukan" ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {tipe === "Pemasukan" ? "+" : "-"}
                    {formatRupiah(jumlah)}
                </span>
            </td>
            <td className="py-3.5 px-4">
                <span className="text-gray-500">
                    {new Date(tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            </td>
            <td className="py-3.5 px-4 text-center">
                <div className="flex justify-center items-center gap-1">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionRow;
