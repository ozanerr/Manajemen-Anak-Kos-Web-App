import React, { useState, useEffect, useRef } from "react";
import {
    X,
    FileText,
    MapPin,
    AlignLeft,
    Image as ImageIcon,
    AlertCircle,
    Save,
    Loader2,
    MessageSquarePlus,
} from "lucide-react";

const daftarKotaIndonesia = [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Palembang",
    "Makassar",
    "Batam",
    "Pekanbaru",
    "Bandar Lampung",
    "Padang",
    "Denpasar",
    "Malang",
    "Samarinda",
    "Tasikmalaya",
    "Pontianak",
    "Banjarmasin",
    "Serang",
    "Jambi",
    "Balikpapan",
    "Surakarta",
    "Cimahi",
    "Manado",
    "Yogyakarta",
    "Cilegon",
    "Kupang",
    "Ambon",
    "Bengkulu",
    "Mataram",
    "Jayapura",
    "Bogor",
    "Depok",
    "Tangerang",
    "Bekasi",
    "Cirebon",
    "Tegal",
    "Purwokerto",
    "Solo",
    "Kediri",
];
daftarKotaIndonesia.sort();

const PostFormModal = ({
    initialPostData,
    modalMode = "add",
    isOpen,
    onClose,
    onSave,
}) => {
    const defaultPostValues = {
        uid: "",
        judul: "",
        kota: "",
        deskripsi: "",
        gambar: "",
    };

    const [postForDefaultValues, setPostForDefaultValues] = useState({
        ...defaultPostValues,
        ...initialPostData,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const newDefaultValues = {
                ...defaultPostValues,
                ...initialPostData,
                kota: initialPostData?.kota || "",
            };
            setPostForDefaultValues(newDefaultValues);
            setErrors({});
            if (formRef.current) {
                formRef.current.reset();
            }
        }
    }, [isOpen, initialPostData]);

    if (!isOpen) {
        return null;
    }

    const validateForm = (data) => {
        const newErrors = {};
        if (!data.judul?.trim()) {
            newErrors.judul = "Post judul is required";
        }
        if (!data.deskripsi?.trim()) {
            newErrors.deskripsi = "Post deskripsi is required";
        }
        if (!data.kota) {
            newErrors.kota = "City is required";
        }
        if (data.gambar?.trim()) {
            try {
                new URL(data.gambar);
            } catch (_) {
                newErrors.gambar = "Please enter a valid gambar URL";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const collectedPostData = {
            judul: formData.get("judul"),
            kota: formData.get("kota"),
            deskripsi: formData.get("deskripsi"),
            gambar: formData.get("gambar"),
        };

        if (!validateForm(collectedPostData)) return;

        setIsSubmitting(true);
        try {
            await onSave(collectedPostData);
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] transform transition-all duration-300 ease-out scale-100 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 cursor-pointer"
                        aria-label="Close Modal"
                    >
                        <X size={22} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-lg">
                            <MessageSquarePlus size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {modalMode === "edit"
                                    ? "Edit Postingan"
                                    : "Buat Postingan Baru"}
                            </h2>
                        </div>
                    </div>
                </div>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex-grow overflow-y-auto"
                    noValidate
                >
                    <div className="p-6 space-y-5">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="judul"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <FileText
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Judul *
                            </label>
                            <input
                                id="judul"
                                name="judul"
                                type="text"
                                defaultValue={postForDefaultValues.judul}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.judul
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="Masukan judul postingan..."
                            />
                            {errors.judul && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.judul}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="kota"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <MapPin size={16} className="text-slate-500" />{" "}
                                Kota *
                            </label>
                            <select
                                id="kota"
                                name="kota"
                                defaultValue={postForDefaultValues.kota}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.kota
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } text-slate-800 ${
                                    formRef.current?.elements.kota.value ===
                                        "" && !postForDefaultValues.kota
                                        ? "text-slate-400"
                                        : "text-slate-800"
                                }`}
                            >
                                <option
                                    value=""
                                    disabled={
                                        modalMode === "add" &&
                                        !postForDefaultValues.kota
                                            ? false
                                            : true
                                    }
                                >
                                    Pilih kota...
                                </option>
                                {daftarKotaIndonesia.map((namaKota) => (
                                    <option key={namaKota} value={namaKota}>
                                        {namaKota}
                                    </option>
                                ))}
                            </select>
                            {errors.kota && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.kota}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="deskripsi"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <AlignLeft
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Deskripsi *
                            </label>
                            <textarea
                                id="deskripsi"
                                name="deskripsi"
                                defaultValue={postForDefaultValues.deskripsi}
                                onChange={handleInputChange}
                                rows={5}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                    errors.deskripsi
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="Tulis konten postingan Anda di sini..."
                            />
                            {errors.deskripsi && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.deskripsi}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="gambar"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <ImageIcon
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                URL Gambar (Opsional)
                            </label>
                            <input
                                id="gambar"
                                name="gambar"
                                type="url"
                                defaultValue={postForDefaultValues.gambar}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.gambar
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.gambar && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    <AlertCircle size={14} /> {errors.gambar}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex justify-end items-center sticky bottom-0 rounded-b-2xl">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-200/80 hover:bg-slate-300/80 rounded-lg transition-colors disabled:opacity-60 shadow-sm cursor-pointer"
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
                                    ? "Menyimpan Perubahan"
                                    : "Buat Postingan"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostFormModal;
