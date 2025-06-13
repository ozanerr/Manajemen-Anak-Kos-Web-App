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

const defaultTransactionState = {
    transaksi: "",
    jumlah: "",
    tanggal: new Date().toISOString().split("T")[0],
    tipe: "expense",
};

const getInternalStateFromInitial = (initial) => {
    if (!initial || Object.keys(initial).length === 0) {
        return { ...defaultTransactionState };
    }
    return {
        _id: initial._id || initial.id,
        transaksi:
            initial.transaksi ??
            initial.name ??
            defaultTransactionState.transaksi,
        jumlah:
            initial.jumlah !== undefined
                ? String(Math.abs(Number(initial.jumlah)))
                : initial.amount !== undefined
                ? String(Math.abs(Number(initial.amount)))
                : defaultTransactionState.jumlah,
        tanggal:
            initial.tanggal ?? initial.date ?? defaultTransactionState.tanggal,
        tipe: initial.tipe ?? initial.type ?? defaultTransactionState.tipe,
    };
};

const formatDateForInput = (dateValue) => {
    if (!dateValue) {
        return;
    }

    try {
        const d = new Date(dateValue);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Bulan 0-indexed
        const day = d.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error(e);
    }
};

const FinanceModal = ({
    initialTransaction,
    modalMode,
    onClose,
    onDelete,
    onSave,
}) => {
    const [transaction, setTransaction] = useState(() =>
        getInternalStateFromInitial(initialTransaction)
    );
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTransaction(getInternalStateFromInitial(initialTransaction));
        setErrors({});
    }, [initialTransaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleAmountChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, "");
        setTransaction((prev) => ({ ...prev, jumlah: value }));
        if (errors.jumlah) {
            setErrors((prevErrors) => ({ ...prevErrors, jumlah: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const jumlahStr = String(transaction.jumlah || "");
        const numericJumlah = parseFloat(jumlahStr);

        if (!transaction.transaksi?.trim()) {
            newErrors.transaksi = "Nama transaksi harus diisi";
        }
        if (!jumlahStr.trim()) {
            newErrors.jumlah = "Jumlah harus diisi";
        } else if (isNaN(numericJumlah) || numericJumlah <= 0) {
            newErrors.jumlah = "Jumlah harus berupa angka positif";
        }
        if (!transaction.tanggal) {
            newErrors.tanggal = "Tanggal transaksi harus diisi";
        }
        if (!transaction.tipe) {
            newErrors.tipe = "Tipe transaksi harus dipilih";
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
                transaksi: transaction.transaksi,
                jumlah: parseFloat(transaction.jumlah),
                tanggal: transaction.tanggal,
                tipe: transaction.tipe,
            };

            if (transaction._id) {
                transactionToSave._id = transaction._id;
            }

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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] transform transition-all duration-300 ease-out scale-100 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative">
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
                                htmlFor="transaksi"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <Edit3 size={16} className="text-slate-500" />
                                Nama Transaksi *
                            </label>
                            <input
                                id="transaksi"
                                name="transaksi"
                                type="text"
                                value={transaction.transaksi || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="mis. Bahan Makanan, Gaji"
                            />
                            {errors.transaksi && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.transaksi}{" "}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="jumlah"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <DollarSign
                                    size={16}
                                    className="text-slate-500"
                                />
                                Jumlah (IDR) *
                            </label>
                            <input
                                id="jumlah"
                                name="jumlah"
                                type="text"
                                inputMode="numeric"
                                value={transaction.jumlah}
                                onChange={handleAmountChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.amount
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="mis. 50000"
                            />
                            {errors.jumlah && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.jumlah}{" "}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <TrendingUp
                                    size={16}
                                    className="text-slate-500"
                                />
                                Tipe *
                            </label>
                            <div className="flex gap-x-6 gap-y-2 pt-1 flex-wrap">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="tipe"
                                        value="Pemasukan"
                                        checked={
                                            transaction.tipe === "Pemasukan"
                                        }
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
                                        name="tipe"
                                        value="Pengeluaran"
                                        checked={
                                            transaction.tipe === "Pengeluaran"
                                        }
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out focus:ring-red-500"
                                    />
                                    <span className="text-slate-700">
                                        Pengeluaran
                                    </span>
                                </label>
                            </div>
                            {errors.tipe && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.tipe}{" "}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="tanggal"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <CalendarIcon
                                    size={16}
                                    className="text-slate-500"
                                />
                                Tanggal *
                            </label>
                            <input
                                id="tanggal"
                                name="tanggal"
                                type="date"
                                value={formatDateForInput(transaction.tanggal)}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.date
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                } placeholder-slate-400 text-slate-800`}
                            />
                            {errors.tanggal && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.tanggal}{" "}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-between items-center sticky bottom-0">
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
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-200/90 hover:bg-slate-300/90 rounded-lg transition-colors disabled:opacity-60 shadow-sm hover:shadow-md cursor-pointer"
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
