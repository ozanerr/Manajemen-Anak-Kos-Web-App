import { useState } from "react";
import {
    useAddReplyMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetRepliesQuery,
} from "../../features/comments/commentsApi";
import { useSelector } from "react-redux";
import {
    MoreHorizontal,
    Edit,
    Trash,
    MessageSquare,
    CornerDownRight,
    Send,
    Loader2,
    UserCircle,
} from "lucide-react";
import { useGetNewUrlPhotoMutation } from "../../features/cloudinary/cloudinaryApi";
import { useEffect } from "react";
import Reply from "./Reply";

const formatter = {
    format: (date) => {
        if (!date) return "Invalid date";
        try {
            return new Date(date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "Invalid date";
        }
    },
};

const Comment = ({ comment, postId }) => {
    const { displayName, photoURL, uid, payload } = useSelector(
        (state) => state.user
    );
    const [reply, setReply] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedComment, setEditedComment] = useState(comment?.comment);

    const commentId = comment._id;
    const [deleteComment, { isLoading: isDeletingComment }] =
        useDeleteCommentMutation();
    const [editComment, { isLoading: isSavingEditComment }] =
        useEditCommentMutation();
    const [addReply, { isLoading: isAddingReply }] = useAddReplyMutation();
    const { data: repliesResponse, isLoading: repliesLoading } =
        useGetRepliesQuery({ commentId, postId });
    const replies = repliesResponse?.data;

    const isOwner = comment.uid === uid;

    const [getUrlPhoto, { data: newPhotoUrl, isSuccess }] =
        useGetNewUrlPhotoMutation();
    const [newUrl, setNewUrl] = useState(null);

    useEffect(() => {
        if (photoURL) {
            getUrlPhoto({ imageProfile: photoURL });
        }
    }, [photoURL]);

    useEffect(() => {
        if (isSuccess) {
            setNewUrl(newPhotoUrl.cloudinaryUrl);
        }
    }, [isSuccess, newPhotoUrl]);

    const replyButtonClicked = () => setShowReplyBox((prev) => !prev);
    const handleEditComment = () => {
        setIsEditingComment(true);
        setDropdownOpen(false);
    };
    const handleCancelComment = () => {
        setIsEditingComment(false);
        setEditedComment(comment?.comment);
    };
    const toggleShowReplies = () => setShowReplies((prev) => !prev);

    const handleSaveEditComment = async (e) => {
        e.preventDefault();
        if (!editedComment.trim()) return;
        try {
            await editComment({
                postId: postId,
                commentId: commentId,
                data: { comment: editedComment },
            }).unwrap();
            setIsEditingComment(false);
        } catch (err) {
            console.error("Failed to save comment:", err);
        }
    };

    const handleDeleteComment = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
            try {
                await deleteComment({ postId, commentId }).unwrap();
                setDropdownOpen(false);
            } catch (err) {
                console.error("Failed to delete comment:", err);
            }
        } else {
            setDropdownOpen(false);
        }
    };

    const handleAddReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            await addReply({
                postId: postId,
                commentId: commentId,
                data: {
                    uid: uid,
                    username: displayName || payload.reloadUserInfo.screenName,
                    reply: reply,
                    imageProfile:
                        newUrl ||
                        `https://ui-avatars.com/api/?name=${(
                            displayName || "A"
                        ).charAt(0)}&background=random&color=fff`,
                },
            }).unwrap();
            setReply("");
            setShowReplyBox(false);
            if (!showReplies && (replies?.length || 0) >= 0)
                setShowReplies(true);
        } catch (err) {
            console.error("Failed to add reply:", err);
        }
    };

    return (
        <article className="p-4 sm:p-5 bg-white/70 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-lg">
            <footer className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                    <img
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                        src={
                            comment.imageProfile ||
                            `https://ui-avatars.com/api/?name=${(
                                comment.username || "U"
                            ).charAt(
                                0
                            )}&background=random&color=fff&font-size=0.5&bold=true`
                        }
                        alt={comment.username || "User"}
                    />
                    <div>
                        <p className="text-sm text-slate-800 font-semibold">
                            {comment?.username}
                        </p>
                        <p className="text-xs text-slate-500">
                            <time dateTime={comment.createdAt}>
                                {formatter.format(new Date(comment?.createdAt))}
                            </time>
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-1.5 text-slate-500 rounded-full hover:bg-slate-500/10 focus:outline-none transition-colors cursor-pointer"
                            aria-label="Comment options"
                        >
                            <MoreHorizontal size={18} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-36 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-200/50 z-20 py-1 origin-top-right animate-fade-in-down">
                                <button
                                    onClick={handleEditComment}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-500/10 hover:text-blue-600 transition-colors rounded-md cursor-pointer"
                                >
                                    <Edit size={14} className="opacity-70" />{" "}
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteComment}
                                    disabled={isDeletingComment}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors rounded-md disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeletingComment ? (
                                        <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                    ) : (
                                        <Trash
                                            size={14}
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

            {isEditingComment ? (
                <form onSubmit={handleSaveEditComment} className="mt-2">
                    <textarea
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/80 bg-white text-slate-800 placeholder-slate-400 resize-none shadow-sm"
                        value={editedComment}
                        autoFocus
                        onChange={(e) => setEditedComment(e.target.value)}
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            type="button"
                            onClick={handleCancelComment}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors rounded-md shadow-sm cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSavingEditComment}
                            className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70 shadow-sm cursor-pointer"
                        >
                            {isSavingEditComment ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                "Simpan"
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line py-1">
                    {comment?.comment}
                </p>
            )}

            <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-200/60">
                <button
                    onClick={replyButtonClicked}
                    type="button"
                    className="flex items-center text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors cursor-pointer"
                >
                    <MessageSquare size={14} className="mr-1.5" /> Balas
                </button>
                {replies && replies.length > 0 && (
                    <button
                        onClick={toggleShowReplies}
                        className="flex items-center text-xs text-slate-500 hover:text-blue-600 hover:underline font-medium transition-colors cursor-pointer"
                    >
                        {showReplies
                            ? "Sembunyikan Balasan"
                            : `Lihat ${replies.length} Balasan`}
                        <CornerDownRight
                            size={14}
                            className={`ml-1 transition-transform duration-200 ${
                                showReplies ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                )}
            </div>

            {showReplyBox && (
                <form onSubmit={handleAddReply} className="mt-3 ml-0 sm:ml-8">
                    <div className="w-full mb-2 border border-slate-300 rounded-lg bg-white/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-sm">
                        <textarea
                            className="w-full p-2.5 text-sm border-0 focus:ring-0 focus:outline-none bg-transparent text-slate-800 placeholder-slate-400 resize-none"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            autoFocus
                            rows="2"
                            placeholder="Tulis balasan Anda..."
                        />
                        <div className="flex items-center justify-end px-3 py-2 border-t border-slate-300/70 bg-slate-50/50 rounded-b-lg">
                            <button
                                type="button"
                                onClick={() => {
                                    setReply("");
                                    setShowReplyBox(false);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/80 transition-colors rounded-md mr-2 shadow-sm cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isAddingReply || !reply.trim()}
                                className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-center text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md focus:ring-2 focus:ring-blue-300/70 hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-60 shadow-sm cursor-pointer"
                            >
                                {isAddingReply ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <Send size={14} />
                                )}
                                Balas
                            </button>
                        </div>
                    </div>
                </form>
            )}
            {showReplies && replies && (
                <div className="mt-4 ml-0 sm:ml-8 space-y-4">
                    {repliesLoading && (
                        <p className="text-xs text-slate-400">
                            Memuat balasan...
                        </p>
                    )}
                    {replies.map((replyData) => (
                        <Reply
                            key={replyData._id}
                            reply={replyData}
                            commentId={commentId}
                            postId={postId}
                        />
                    ))}
                </div>
            )}
        </article>
    );
};

export default Comment;
