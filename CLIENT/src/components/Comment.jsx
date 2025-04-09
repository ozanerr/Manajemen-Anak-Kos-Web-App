import React, { useState } from "react";
import {
    useAddReplyMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetRepliesQuery,
} from "../features/comments/commentsApi";
import { useParams } from "react-router-dom";
import Reply from "./Reply";
import { formatter } from "../assets/date-config";

const Comment = ({ comment }) => {
    const [reply, setReply] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [editedComment, setEditedComment] = useState(comment?.comment);

    const { postId } = useParams();
    const commentId = comment._id;
    const [deleteComment] = useDeleteCommentMutation();
    const [editComment] = useEditCommentMutation();
    const [addReply] = useAddReplyMutation();
    const { data: replies } = useGetRepliesQuery({ commentId, postId });

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

        setReply("");
    };

    const toggleShowReplies = () => {
        setShowReplies((prev) => !prev);
    };

    return (
        <article className="px-8 pt-6 mb-6 text-base rounded-lg bg-gray-900 relative">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-white">
                        <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src={comment.imageProfile}
                            alt="User Profile"
                        />
                        {comment?.username}
                    </p>
                    <p className="text-sm text-gray-400">
                        <time>
                            {formatter.format(new Date(comment?.createdAt))}
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
                <p className="text-gray-400">{comment?.comment}</p>
            )}

            {/* Reply Feature */}
            <div className="flex items-center space-x-4 mt-4">
                <button
                    onClick={replyButtonClicked}
                    type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline"
                >
                    <svg
                        aria-hidden="true"
                        className="mr-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    Reply
                </button>

                {/* Show Replies Button */}
                {replies?.data.length > 0 && (
                    <button
                        onClick={toggleShowReplies}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        {showReplies
                            ? "Hide Replies"
                            : `Show Replies (${replies.data.length})`}
                    </button>
                )}
            </div>

            {showReplyBox && (
                <form
                    onSubmit={handleAddReply}
                    className="flex flex-col space-y-2"
                >
                    <textarea
                        className="w-full p-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-400 text-sm"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows="3"
                        placeholder="Write your reply..."
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setReply("")}
                            className="px-2 py-0.5 text-white bg-gray-400 rounded hover:bg-gray-500 text-sm"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="px-2 py-0.5 text-white bg-blue-500 rounded hover:bg-blue-600 text-sm"
                        >
                            Add
                        </button>
                    </div>
                </form>
            )}
            {/* Replies List */}
            {showReplies &&
                replies?.data.map((data) => (
                    <Reply key={data._id} reply={data} />
                ))}
        </article>
    );
};

export default Comment;
