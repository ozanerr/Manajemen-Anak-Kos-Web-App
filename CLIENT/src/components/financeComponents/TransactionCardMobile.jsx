import { Edit2, Trash2 } from "lucide-react";

const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Math.abs(amount));

const TransactionCardMobile = ({ transaction, onEdit, onDelete }) => {
    const { transaksi, tipe, jumlah, tanggal } = transaction;
    return (
        <div className="block mb-4 rounded-lg shadow-md overflow-hidden border border-gray-200/50 bg-slate-50/50 p-4">
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-start">
                    <span className="text-gray-700 font-semibold text-base mr-2 break-words">
                        {transaksi}
                    </span>
                    <span
                        className={`font-semibold text-base whitespace-nowrap ${
                            tipe === "Pemasukan"
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {tipe === "Pemasukan" ? "+ " : "- "}
                        {formatRupiah(jumlah)}
                    </span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>
                        {new Date(tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tipe === "Pemasukan"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {tipe === "Pemasukan" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200/50 flex justify-end gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-600 hover:text-blue-800 active:bg-blue-100 rounded-md"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-red-500 hover:text-red-700 active:bg-red-100 rounded-md"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TransactionCardMobile;
