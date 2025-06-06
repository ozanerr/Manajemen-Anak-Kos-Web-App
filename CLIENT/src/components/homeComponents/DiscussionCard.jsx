import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { useDeletePostMutation } from "../../features/posts/postsApi";
import { formatter } from "../../assets/formatter";

const DiscussionCard = ({ post, onEditRequest, variant = "full" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { uid } = useSelector((state) => state.user);
    const [deletePost] = useDeletePostMutation();

    if (!post) return null;

    const { _id, judul, deskripsi, username, createdAt, kota } = post;
    const isOwner = post.uid === uid;

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEditRequest) onEditRequest(post);
        setDropdownOpen(false);
    };
    const handleDeletePost = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (
            window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")
        ) {
            deletePost(post._id);
        }
        setDropdownOpen(false);
    };

    const DropdownMenu = () => (
        <div
            className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-200 z-30 py-1 origin-top-right animate-fade-in-down"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <button
                onClick={handleEditClick}
                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-100 hover:text-blue-600 rounded-md"
            >
                <Edit size={14} className="opacity-70" /> Edit
            </button>
            <button
                onClick={handleDeletePost}
                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 rounded-md"
            >
                <Trash size={14} className="opacity-70" /> Hapus
            </button>
        </div>
    );

    if (variant === "minimal") {
        return (
            <Link
                to={`/posts/${_id}`}
                className="group relative block p-3 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {judul || "Postingan Tanpa Judul"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Diposting{" "}
                            <time dateTime={createdAt}>
                                {formatter.format(new Date(createdAt))}
                            </time>
                        </p>
                    </div>
                    {isOwner && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDropdownOpen(!dropdownOpen);
                                    }}
                                    className="p-1.5 text-slate-500 rounded-full hover:bg-slate-200"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                                {dropdownOpen && <DropdownMenu />}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group mb-4">
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-800">
                            {username}
                        </span>
                        <span className="mx-1">•</span>
                        <time dateTime={createdAt}>
                            {formatter.format(new Date(createdAt))}
                        </time>
                        {kota && (
                            <>
                                <span className="mx-1">•</span>
                                <span className="text-blue-600 font-medium">
                                    {kota}
                                </span>
                            </>
                        )}
                    </div>
                    {isOwner && (
                        <div className="relative -mt-1">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="p-1.5 text-slate-500 rounded-full hover:bg-slate-200/70"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                            {dropdownOpen && <DropdownMenu />}
                        </div>
                    )}
                </div>

                <div>
                    <Link to={`/posts/${_id}`} className="group/link">
                        <h2 className="text-lg font-bold text-slate-900 group-hover/link:text-blue-600 mb-1">
                            {judul}
                        </h2>
                        <p className="text-slate-600 text-sm line-clamp-2">
                            {deskripsi}
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DiscussionCard;
