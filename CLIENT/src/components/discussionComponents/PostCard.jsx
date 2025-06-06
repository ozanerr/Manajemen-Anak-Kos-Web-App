// src/components/PostCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { useDeletePostMutation } from "../../features/posts/postsApi";
import { formatter } from "../../assets/formatter";

const PostCard = ({ post, onEditRequest }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { uid } = useSelector((state) => state.user);
    const isOwner = post.uid === uid;
    const [deletePost] = useDeletePostMutation();

    const handleEditClick = () => {
        if (onEditRequest) {
            onEditRequest(post);
        }
        setDropdownOpen(false);
    };

    const handleDeletePost = () => {
        if (
            window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")
        ) {
            deletePost(post._id);
        }
        setDropdownOpen(false);
    };

    const {
        _id,
        judul,
        kota,
        deskripsi,
        gambar,
        username,
        imageProfile,
        createdAt,
    } = post || {};

    if (!post) {
        return null;
    }

    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-slate-200/70 shadow-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl group">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200/70">
                <div className="flex items-center space-x-3 group/userinfo cursor-default">
                    <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover/userinfo:ring-2 group-hover/userinfo:ring-blue-400 transition-all"
                        src={imageProfile}
                        alt={username || "Profil pengguna"}
                    />
                    <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover/userinfo:text-blue-600 transition-colors">
                            {username || "Pengguna Anonim"}
                        </p>
                        <p className="text-xs text-slate-500 group-hover/userinfo:text-slate-600 transition-colors">
                            <time dateTime={createdAt}>
                                {/* Menggunakan formatter.format dengan createdAt langsung */}
                                {formatter.format(createdAt)}
                            </time>
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(!dropdownOpen);
                            }}
                            className="p-2 text-slate-500 rounded-full hover:bg-slate-500/10 hover:text-slate-700 focus:outline-none transition-colors cursor-pointer"
                            aria-label="Post options"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-200/50 z-30 py-1.5 origin-top-right animate-fade-in-down"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleEditClick}
                                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-500/10 hover:text-blue-600 transition-colors rounded-md cursor-pointer"
                                >
                                    <Edit size={16} className="opacity-70" />{" "}
                                    Edit Postingan
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors rounded-md cursor-pointer"
                                >
                                    <Trash size={16} className="opacity-70" />{" "}
                                    Hapus Postingan
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Link to={`/posts/${_id}`} className="block p-4 sm:p-5 group/link">
                {gambar && (
                    <div className="mb-4 rounded-lg overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/link:scale-105"
                            src={gambar}
                            alt={judul || "Gambar Postingan"}
                        />
                    </div>
                )}
                <div className={!gambar ? "mt-1" : ""}>
                    {kota && (
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold mb-3 tracking-wide shadow-sm">
                            {kota}
                        </span>
                    )}
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 group-hover/link:text-blue-600 transition-colors mb-2 leading-tight">
                        {judul || "Postingan Tanpa Judul"}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5">
                        {deskripsi
                            ? deskripsi
                            : "Tidak ada deskripsi yang tersedia."}
                    </p>
                </div>
            </Link>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-200/70 pt-4 flex items-center justify-between">
                <Link
                    to={`/posts/${_id}`}
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300/50 rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 transition-colors shadow hover:shadow-md"
                >
                    Baca selengkapnya
                    <svg
                        className="ml-1.5 sm:ml-2 -mr-1 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
