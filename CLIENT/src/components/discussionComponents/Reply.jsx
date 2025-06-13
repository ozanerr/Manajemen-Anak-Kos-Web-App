import React, { useState } from "react";
import {
    useDeleteReplyMutation,
    useEditReplyMutation,
} from "../../features/comments/commentsApi";
import { useSelector } from "react-redux";
import { MoreHorizontal, Edit, Trash, Loader2, UserCircle } from "lucide-react";
import { formatter } from "../../assets/formatter";

const Reply = ({ reply, commentId, postId }) => {
    const { displayName, uid } = useSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditingReply, setIsEditingReply] = useState(false);
    const [editedReply, setEditedReply] = useState(reply?.reply);

    const replyId = reply._id;
    const [deleteReply, { isLoading: isDeletingReply }] =
        useDeleteReplyMutation();
    const [editReply, { isLoading: isSavingEditReply }] =
        useEditReplyMutation();
    const isOwner = reply.uid === uid;

    const handleEditReply = () => {
        setIsEditingReply(true);
        setDropdownOpen(false);
    };
    const handleCancelReply = () => {
        setIsEditingReply(false);
        setEditedReply(reply?.reply);
    };

    const handleSaveEditReply = async (e) => {
        e.preventDefault();
        if (!editedReply.trim()) return;
        try {
            await editReply({
                postId: postId,
                commentId: commentId,
                replyId: replyId,
                data: { reply: editedReply },
            }).unwrap();
            setIsEditingReply(false);
        } catch (err) {
            console.error("Failed to save reply:", err);
        }
    };

    const handleDeleteReply = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus balasan ini?")) {
            try {
                await deleteReply({ postId, commentId, replyId }).unwrap();
                setDropdownOpen(false);
            } catch (err) {
                console.error("Failed to delete reply:", err);
            }
        } else {
            setDropdownOpen(false);
        }
    };

    return (
        <article className="p-3 sm:p-4 text-sm bg-slate-100/70 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md relative">
            <footer className="flex justify-between items-start sm:items-center mb-1.5">
                <div className="flex items-center space-x-2">
                    <img
                        className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                        src={
                            reply.imageProfile ||
                            `https://ui-avatars.com/api/?name=${(
                                reply.username || "U"
                            ).charAt(
                                0
                            )}&background=random&color=fff&font-size=0.5&bold=true`
                        }
                        alt={reply.username || "User"}
                    />
                    <div>
                        <p className="inline-flex items-center text-xs text-slate-700 font-semibold">
                            {reply?.username}
                        </p>
                        <p className="text-xs text-slate-500 ml-0 sm:ml-1.5 sm:inline block">
                            <time dateTime={reply.createdAt}>
                                {formatter.format(new Date(reply?.createdAt))}
                            </time>
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-1 text-slate-500 rounded-full hover:bg-slate-400/20 focus:outline-none transition-colors cursor-pointer"
                            aria-label="Reply options"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-32 bg-white/95 backdrop-blur-md rounded-md shadow-xl border border-slate-200/50 z-10 py-1 origin-top-right animate-fade-in-down">
                                <button
                                    onClick={handleEditReply}
                                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-500/10 hover:text-blue-600 transition-colors rounded-sm cursor-pointer"
                                >
                                    <Edit size={13} className="opacity-70" />{" "}
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteReply}
                                    disabled={isDeletingReply}
                                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors rounded-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeletingReply ? (
                                        <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                    ) : (
                                        <Trash
                                            size={13}
                                            className="opacity-70"
                                        />
                                    )}
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </footer>

            {isEditingReply ? (
                <form onSubmit={handleSaveEditReply} className="mt-1.5">
                    <textarea
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/80 bg-white text-slate-800 placeholder-slate-400 resize-none shadow-sm"
                        value={editedReply}
                        autoFocus
                        onChange={(e) => setEditedReply(e.target.value)}
                        rows="2"
                    />
                    <div className="flex justify-end space-x-1.5 mt-1.5">
                        <button
                            type="button"
                            onClick={handleCancelReply}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors rounded-md shadow-sm cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSavingEditReply}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70 shadow-sm cursor-pointer"
                        >
                            {isSavingEditReply ? (
                                <Loader2 className="animate-spin h-3 w-3" />
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line py-1">
                    {reply?.reply}
                </p>
            )}
        </article>
    );
};

export default Reply;
