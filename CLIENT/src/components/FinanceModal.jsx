import React, { useState, useEffect } from "react";
import {
    X,
    DollarSign,
    Edit3,
    TrendingUp,
    Calendar as CalendarIcon,
    AlertCircle,
    Save,
    Trash2,
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
        // account: "", // Field account dihapus
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
            // account: initialTransaction?.account || "", // Dihapus
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
    };

    const handleAmountChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, "");
        setTransaction((prev) => ({ ...prev, amount: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const numericAmount = parseFloat(transaction.amount);

        if (!transaction.name?.trim()) {
            newErrors.name = "Transaction name is required";
        }
        if (!transaction.amount?.trim()) {
            newErrors.amount = "Amount is required";
        } else if (isNaN(numericAmount) || numericAmount <= 0) {
            newErrors.amount = "Amount must be a positive number";
        }
        if (!transaction.date) {
            newErrors.date = "Date is required";
        }
        if (!transaction.type) {
            newErrors.type = "Transaction type is required";
        }
        // Validasi untuk account tidak diperlukan lagi

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
                // Tidak ada 'account' lagi di sini
            };
            await onSave(transactionToSave);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (
            window.confirm("Are you sure you want to delete this transaction?")
        ) {
            setIsSubmitting(true);
            try {
                await onDelete();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] transform transition-all duration-300 ease-out scale-100 flex flex-col" // rounded-2xl untuk sisi melengkung
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 cursor-pointer"
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
                                    ? "Edit Transaction"
                                    : "Add Transaction"}
                            </h2>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-grow overflow-y-auto"
                >
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <Edit3 size={16} /> Transaction Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={transaction.name || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                    errors.name
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="e.g., Groceries, Salary"
                            />
                            {errors.name && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} /> {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="amount"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <DollarSign size={16} /> Amount (IDR) *
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="text"
                                inputMode="numeric"
                                value={transaction.amount || ""}
                                onChange={handleAmountChange}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                    errors.amount
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="e.g., 50000"
                            />
                            {errors.amount && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} /> {errors.amount}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <TrendingUp size={16} /> Type *
                            </label>
                            <div className="flex gap-4 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={transaction.type === "income"}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                    />
                                    <span className="text-gray-700">
                                        Income
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="expense"
                                        checked={transaction.type === "expense"}
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                                    />
                                    <span className="text-gray-700">
                                        Expense
                                    </span>
                                </label>
                            </div>
                            {errors.type && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} /> {errors.type}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="date"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <CalendarIcon size={16} /> Date *
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={transaction.date || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                    errors.date
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            />
                            {errors.date && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} /> {errors.date}
                                </div>
                            )}
                        </div>

                        {/* Field Account telah dihapus dari sini */}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center sticky bottom-0">
                        <div>
                            {onDelete && modalMode === "edit" && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                {modalMode === "edit"
                                    ? "Save Changes"
                                    : "Add Transaction"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceModal;
