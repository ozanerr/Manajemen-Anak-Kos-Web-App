import { useState, useEffect } from "react";
import {
    X,
    DollarSign,
    Edit3,
    TrendingUp,
    Calendar as CalendarIcon,
    AlertCircle,
    Save,
    Trash2,
    Loader2,
} from "lucide-react";

const FinanceModal = ({
    initialTransaction,
    modalMode,
    onClose,
    onDelete,
    onSave,
}) => {
    const defaultTransaction = {
        name: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
    };

    const [transaction, setTransaction] = useState({
        ...defaultTransaction,
        ...initialTransaction,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTransaction({
            ...defaultTransaction,
            ...initialTransaction,
            amount: initialTransaction?.amount
                ? String(Math.abs(initialTransaction.amount))
                : "",
            date: initialTransaction?.date || defaultTransaction.date,
            type: initialTransaction?.type || defaultTransaction.type,
        });
        setErrors({});
    }, [initialTransaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "type") {
            setTransaction((prev) => ({ ...prev, [name]: value }));
        } else {
            setTransaction((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleAmountChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, "");
        setTransaction((prev) => ({ ...prev, amount: value }));
        if (errors.amount) {
            // Hapus error amount jika ada
            setErrors((prevErrors) => ({ ...prevErrors, amount: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const numericAmount = parseFloat(transaction.amount);

        if (!transaction.name?.trim()) {
            newErrors.name = "Nama transaksi harus diisi";
        }
        if (!transaction.amount?.trim()) {
            newErrors.amount = "Jumlah harus diisi";
        } else if (isNaN(numericAmount) || numericAmount <= 0) {
            newErrors.amount = "Jumlah harus berupa angka positif";
        }
        if (!transaction.date) {
            newErrors.date = "Tanggal transaksi harus diisi";
        }
        if (!transaction.type) {
            newErrors.type = "Tipe transaksi harus dipilih";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const transactionToSave = {
                ...transaction,
                amount: parseFloat(transaction.amount),
            };
            await onSave(transactionToSave);
        } catch (error) {
            console.error("Failed to save transaction from modal:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await onDelete();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] transform transition-all duration-300 ease-out scale-100 flex flex-col overflow-hidden" // Ditambahkan overflow-hidden
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative">
                    {" "}
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 right-3.5 text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/20 cursor-pointer"
                        aria-label="Close Modal"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {modalMode === "edit"
                                    ? "Edit Transaksi"
                                    : "Tambah Transaksi"}
                            </h2>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-grow overflow-y-auto"
                >
                    <div className="p-6 space-y-5">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="name"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <Edit3 size={16} className="text-slate-500" />{" "}
                                Nama Transaksi *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={transaction.name || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="mis. Bahan Makanan, Gaji"
                            />
                            {errors.name && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="amount"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <DollarSign
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Jumlah (IDR) *
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="text"
                                inputMode="numeric"
                                value={transaction.amount || ""}
                                onChange={handleAmountChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.amount
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="mis. 50000"
                            />
                            {errors.amount && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.amount}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <TrendingUp
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Tipe *
                            </label>
                            <div className="flex gap-x-6 gap-y-2 pt-1 flex-wrap">
                                {" "}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={transaction.type === "income"}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">
                                        Pemasukan
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={transaction.type === "expense"}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out focus:ring-red-500"
                                    />
                                    <span className="text-slate-700">
                                        Pengeluaran
                                    </span>
                                </label>
                            </div>
                            {errors.type && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="date"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <CalendarIcon
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Tanggal *
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={transaction.date || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.date
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                            />
                            {errors.date && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-between items-center sticky bottom-0">
                        {" "}
                        <div>
                            {onDelete && modalMode === "edit" && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-60 shadow-sm hover:shadow-md"
                                >
                                    <Trash2 size={16} /> Hapus
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-200/90 hover:bg-slate-300/90 rounded-lg transition-colors disabled:opacity-60 shadow-sm hover:shadow-md"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                {modalMode === "edit"
                                    ? "Simpan Perubahan"
                                    : "Tambah Transaksi"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceModal;
