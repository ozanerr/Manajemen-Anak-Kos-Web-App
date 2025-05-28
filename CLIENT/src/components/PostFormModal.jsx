import React, { useState, useEffect } from "react";
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
    const defaultPost = {
        title: "",
        kota: "",
        description: "",
        image: "",
    };

    const [post, setPost] = useState({ ...defaultPost, ...initialPostData });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPost({
                ...defaultPost,
                ...initialPostData,
                kota: initialPostData?.kota || "",
            });
            setErrors({});
        }
    }, [isOpen, initialPostData]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!post.title?.trim()) {
            newErrors.title = "Post title is required";
        }
        if (!post.description?.trim()) {
            newErrors.description = "Post description is required";
        }
        if (!post.kota) {
            // Validasi untuk kota (harus dipilih)
            newErrors.kota = "City is required";
        }
        if (post.image?.trim()) {
            try {
                new URL(post.image);
            } catch (_) {
                newErrors.image = "Please enter a valid image URL";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await onSave(post);
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setIsSubmitting(false);
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
                            {" "}
                            <MessageSquarePlus size={22} />{" "}
                        </div>
                        <div>
                            {" "}
                            <h2 className="text-xl font-semibold">
                                {" "}
                                {modalMode === "edit"
                                    ? "Edit Post"
                                    : "Create New Post"}{" "}
                            </h2>{" "}
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
                                htmlFor="title"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <FileText
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={post.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.title
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="Enter post title..."
                            />
                            {errors.title && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    {" "}
                                    <AlertCircle size={14} /> {errors.title}{" "}
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
                                value={post.kota}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.kota
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } text-slate-800 ${
                                    !post.kota
                                        ? "text-slate-400"
                                        : "text-slate-800"
                                }`} // Ganti warna placeholder jika belum dipilih
                            >
                                <option value="" disabled>
                                    Select a city...
                                </option>
                                {daftarKotaIndonesia.map((namaKota) => (
                                    <option key={namaKota} value={namaKota}>
                                        {namaKota}
                                    </option>
                                ))}
                            </select>
                            {errors.kota && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    {" "}
                                    <AlertCircle size={14} /> {errors.kota}{" "}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="description"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <AlignLeft
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={post.description}
                                onChange={handleChange}
                                rows={5}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                    errors.description
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="Write your post content here..."
                            />
                            {errors.description && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    {" "}
                                    <AlertCircle size={14} />{" "}
                                    {errors.description}{" "}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="image"
                                className="flex items-center gap-2 text-sm font-medium text-slate-700"
                            >
                                <ImageIcon
                                    size={16}
                                    className="text-slate-500"
                                />{" "}
                                Image URL (Optional)
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="url"
                                value={post.image}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.image
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
                                } placeholder-slate-400 text-slate-800`}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.image && (
                                <p className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
                                    {" "}
                                    <AlertCircle size={14} /> {errors.image}{" "}
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
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-200/80 hover:bg-slate-300/80 rounded-lg transition-colors disabled:opacity-60 shadow-sm"
                            >
                                Cancel
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
                                    ? "Save Changes"
                                    : "Create Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostFormModal;
