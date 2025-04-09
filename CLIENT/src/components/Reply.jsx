import React, { useState } from "react";
import {
    useAddReplyMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetRepliesQuery,
} from "../features/comments/commentsApi";
import { useParams } from "react-router-dom";
import { formatter } from "../assets/date-config";

const Reply = ({ reply }) => {
    const [replyy, setReplyy] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedComment, setEditedComment] = useState(reply?.reply);

    const { postId } = useParams();
    const commentId = comment._id;
    const [deleteComment] = useDeleteCommentMutation();
    const [editComment] = useEditCommentMutation();
    const [addReply] = useAddReplyMutation();
    const { data: replies } = useGetRepliesQuery({ commentId, postId });

    console.log(replies);

    const replyButtonClicked = () => {
        setShowReplyBox((prev) => !prev);
    };

    const handleEditComment = () => {
        setIsEditingComment(true);
        setDropdownOpen(false);
    };

    const handleCancelComment = () => {
        setIsEditingComment(false);
        setEditedComment(comment?.comment);
    };

    const handleSaveEditComment = (e) => {
        e.preventDefault();

        editComment({
            postId: postId,
            commentId: commentId,
            data: {
                comment: editedComment,
            },
        });

        console.log(editedComment);
        setIsEditingComment(false);
    };

    const handleDeleteComment = () => {
        deleteComment({ postId, commentId });
        setDropdownOpen(false);
    };

    const handleAddReply = (e) => {
        e.preventDefault();

        addReply({
            postId: postId,
            commentId: commentId,
            data: {
                username: "admin",
                reply: reply,
            },
        });

        setReplyy("");
    };

    return (
        <article className="pl-8 pt-6 text-base rounded-lg bg-gray-900 relative">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-white">
                        <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src={reply.imageProfile}
                            alt="User Profile"
                        />
                        {reply?.username}
                    </p>
                    <p className="text-sm text-gray-400">
                        <time>
                            {formatter.format(new Date(reply?.createdAt))}
                        </time>
                    </p>
                </div>
                <div className="relative">
                    <button
                        id="dropdownComment1Button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="p-2 text-sm text-gray-400 bg-gray-900 rounded-lg hover:bg-gray-700 focus:ring-gray-600"
                    >
                        <svg
                            className="w-5 h-4"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-gray-800 rounded shadow-lg z-10">
                            <button
                                onClick={handleEditComment}
                                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteComment}
                                className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </footer>

            {/* Conditional Rendering for Edit Mode */}
            {isEditingComment ? (
                <div>
                    <textarea
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-400 text-sm"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={handleCancelComment}
                            className="px-2 py-0.5 text-white bg-gray-400 rounded hover:bg-gray-500 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            // type='submit'
                            onClick={handleSaveEditComment}
                            className="px-2 py-0.5 text-white bg-blue-500 rounded hover:bg-blue-600 text-sm"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">{reply?.reply}</p>
            )}
        </article>
    );
};

export default Reply;
