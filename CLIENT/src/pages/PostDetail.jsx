import React, { useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { useFetchSinglePostQuery } from "../features/posts/postsApi";
import {
    useAddCommentMutation,
    useFetchCommentsQuery,
} from "../features/comments/commentsApi";
import Comment from "../components/Comment";
import { useSelector } from "react-redux";

const PostDetail = () => {
    const { displayName, photoURL } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");

    const navigate = useNavigate();

    const { postId } = useParams();

    // Fetch Postingan dari API
    const {
        data: post,
        isError: postError,
        isLoading: postLoading,
    } = useFetchSinglePostQuery(postId) || {};

    // Post Comment ke Database
    const [addComment] = useAddCommentMutation() || {};

    // Fetch Comments dari API
    const {
        data: comments,
        isError: commentsError,
        isLoading: commentsLoading,
    } = useFetchCommentsQuery(postId) || {};

    // Handle Add Comment
    const submitHandler = (e) => {
        e.preventDefault();

        addComment({
            postId: postId,
            data: {
                postId: postId,
                username: displayName,
                comment: comment,
                imageProfile: photoURL,
            },
        });

        setComment("");
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <div className="container shadow-sm items-center mx-auto my-5 py-5 xl:px-30 sm: px-10">
                <h2 className="text-center text-3xl mb-2 mt-2">POST DETAIL</h2>
                <div className="">
                    {post?.data.image ? (
                        <img
                            className="mx-auto w-full object-cover rounded-2xl max-h-[200px] md:max-h-[300px] lg:max-h-[400px] xl:max-h-[550px]"
                            src={post?.data.image}
                            alt="title"
                        />
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center mt-10 py-5 px-5">
                        <h5 className="text-bold text-2xl font-bold mt-2 pt-2">
                            {post?.data.title}
                        </h5>
                        <div className="flex grow-1"></div>
                        <p className="bg-black text-white font-bold mt-2 rounded px-2 mx-2">
                            {post?.data.category}
                        </p>
                    </div>

                    <p className="font-serif mt-4 pt-3 font-medium text-xl px-5">
                        {post?.data.description && post?.data.description}
                    </p>
                </div>
            </div>

            <section className="bg-gray-900 mt-4 py-8 lg:py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-white">
                            Discussion ({comments?.data.length})
                        </h2>
                    </div>
                    <form onSubmit={submitHandler} className="mb-6">
                        <div className="py-2 px-4 mb-4 bg-gray-200 rounded-lg rounded-t-lg border border-gray-300">
                            <label htmlFor="comment" className="sr-only">
                                Your comment
                            </label>
                            <textarea
                                id="comment"
                                rows="6"
                                onChange={(e) => setComment(e.target.value)}
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                placeholder="Write a comment..."
                                required
                                value={comment}
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-gray-200 bg-green-500 rounded-lg focus:ring-4 focus:ring-green-200 hover:bg-green-800"
                        >
                            Post comment
                        </button>
                    </form>

                    {comments?.data.map((comment) => {
                        return <Comment key={comment?._id} comment={comment} />;
                    })}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
