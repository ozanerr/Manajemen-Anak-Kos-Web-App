import { useState, useEffect } from "react";
import {
    X,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    Save,
    Trash2,
} from "lucide-react";

const DeadlineModal = ({
    initialEvent,
    modalMode,
    onClose,
    onDelete,
    onSave,
}) => {
    const [event, setEvent] = useState({ ...initialEvent });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setEvent({ ...initialEvent });
        setErrors({});
    }, [initialEvent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        handleChange({
            target: {
                name: "end",
                value: dateValue.replace("T", " "),
            },
        });
    };

    const getDaysUntilDue = () => {
        if (!event.end) return null;
        const dueDate = new Date(event.end.replace(" ", "T"));
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!event.title?.trim()) {
            newErrors.title = "Judul harus diisi";
        }

        if (!event.end) {
            newErrors.end = "Tanggal Batas Waktu harus diisi";
        } else {
            const dueDate = new Date(event.end.replace(" ", "T"));
            const now = new Date();
            now.setSeconds(0, 0);
            const inputDateWithoutSeconds = new Date(dueDate);
            inputDateWithoutSeconds.setSeconds(0, 0);

            if (inputDateWithoutSeconds < now) {
                newErrors.end = "Due date cannot be in the past";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const start = e.target.end.value;
        const end = e.target.end.value;

        setEvent({
            title,
            description,
            start,
            end,
        });

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSave(event);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus deadline ini?")) {
            setIsSubmitting(true);
            try {
                await onDelete();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!event) return null;

    const daysUntilDue = getDaysUntilDue();

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 flex flex-col"
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
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {modalMode === "edit"
                                    ? "Edit Deadline"
                                    : "Tambah Deadline"}
                            </h2>
                            {daysUntilDue !== null && event.end && (
                                <p className="text-sm text-white/80">
                                    {daysUntilDue > 0
                                        ? `${daysUntilDue} hari${
                                              daysUntilDue === 1 ? "" : "s"
                                          } tersisa`
                                        : daysUntilDue === 0
                                        ? "Batas waktu hari ini"
                                        : `${Math.abs(daysUntilDue)} day${
                                              Math.abs(daysUntilDue) === 1
                                                  ? ""
                                                  : "s"
                                          } terlewat`}
                                </p>
                            )}
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
                                htmlFor="title"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <FileText size={16} />
                                Judul *
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={event.title || ""}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                    errors.title
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                placeholder="Masukkan judul deadline..."
                            />
                            {errors.title && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} />
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <FileText size={16} />
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={event.description || ""}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent hover:border-gray-400 resize-none"
                                placeholder="Tambahkan detail untuk deadline ini..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="end"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                            >
                                <Clock size={16} />
                                Tanggal dan Waktu Batas Waktu *
                            </label>
                            <input
                                id="end"
                                name="end"
                                type="datetime-local"
                                value={event.end?.replace(" ", "T") || ""}
                                onChange={handleDateChange}
                                min={getMinDateTime()}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                                    errors.end
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            />
                            {errors.end && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={14} />
                                    {errors.end}
                                </div>
                            )}
                        </div>
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
                                    <Trash2 size={16} />
                                    Hapus
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
                                Batal
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
                                    ? "Simpan Perubahan"
                                    : "Tambah Deadline"}
                            </button>
                        </div>
                    </div>
                </form>{" "}
            </div>
        </div>
    );
};

export default DeadlineModal;
