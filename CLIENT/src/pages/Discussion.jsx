import React from "react";
import { useFetchPostsQuery } from "../features/posts/postsApi";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

const Discussion = () => {
    const { data: posts, isError, isLoading } = useFetchPostsQuery() || {};
    const { displayName, isloggedIn } = useSelector((state) => state.user);
    console.log("isLoggedIn", isloggedIn);
    console.log("displayName", displayName);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-10 px-5 flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                Latest Posts
            </h1>
            {isLoading && <p className="text-gray-500">Loading posts...</p>}
            {isError && <p className="text-red-500">Failed to load posts.</p>}
            {!isLoading && !isError && (
                <div className="w-full max-w-3xl space-y-6">
                    {posts?.data.map((post) => (
                        <PostCard
                            key={post?._id}
                            post={post}
                            className="bg-white bg-opacity-90 shadow-md border border-gray-300 rounded-xl p-6"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Discussion;
