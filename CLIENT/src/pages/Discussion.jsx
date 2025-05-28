import React, { useState, useEffect } from "react";
import {
    useFetchPostsQuery,
    useAddPostMutation,
} from "../features/posts/postsApi";
import PostCard from "../components/PostCard";
import PostFormModal from "../components/PostFormModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {
    MessageSquarePlus,
    AlertTriangle as AlertTriangleIcon,
    Loader2,
} from "lucide-react";
import { Plus as PlusIconLucide } from "lucide-react";

const Discussion = () => {
    const {
        data: postsResponse,
        isError,
        isLoading,
        error,
        // refetch,
    } = useFetchPostsQuery() || {};
    const posts = postsResponse?.data || [];

    const { displayName, photoURL, isloggedIn, isAuthLoading } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [currentPostToEdit, setCurrentPostToEdit] = useState(null);
    const [postModalMode, setPostModalMode] = useState("add");

    const [addPost, { isLoading: isAddingPost, error: addPostError }] =
        useAddPostMutation() || {};

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    const openPostModal = (mode, postData = null) => {
        setPostModalMode(mode);
        setCurrentPostToEdit(mode === "add" ? null : postData);
        setIsPostModalOpen(true);
    };

    const handleSavePost = async (postDataFromModal) => {
        try {
            if (postModalMode === "add") {
                const newPostData = {
                    ...postDataFromModal,
                    username: displayName || "Anonymous User",
                    imageProfile:
                        photoURL ||
                        `https://ui-avatars.com/api/?name=${(
                            displayName || "A"
                        ).charAt(
                            0
                        )}&background=random&color=fff&font-size=0.5&bold=true`,
                };
                await addPost(newPostData).unwrap();
            } else if (postModalMode === "edit" && currentPostToEdit) {
                console.log("Updating post (implement RTK hook):", {
                    postId: currentPostToEdit._id,
                    ...postDataFromModal,
                });
            }
            setIsPostModalOpen(false);
            setCurrentPostToEdit(null);
        } catch (err) {
            console.error(`Failed to ${postModalMode} post:`, err);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">
                    Loading discussions...
                </p>
            </div>
        );
    }
    if (!isloggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-8">
                <div className="text-center mb-10 sm:mb-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Diskusi Komunitas
                    </h1>
                    <p className="text-gray-600 mt-1 text-base max-w-2xl mx-auto">
                        Jelajahi topik, berbagi wawasan, dan terhubung dengan sesama anggota.
                    </p>
                </div>

                {isLoading && (
                    <div className="text-center py-20">
                        <Loader2 className="animate-spin rounded-full h-12 w-12 text-blue-600 mx-auto" />
                        <p className="text-slate-500 text-lg mt-4">
                            Loading discussions...
                        </p>
                    </div>
                )}
                {isError && (
                    <div className="text-center py-10 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-300/70 p-6 max-w-md mx-auto shadow-lg">
                        <AlertTriangleIcon
                            size={40}
                            className="mx-auto text-red-500 mb-3"
                        />
                        <p className="text-red-700 font-semibold text-lg">
                            Failed to Load Posts
                        </p>
                        <p className="text-red-600 mt-1 text-sm">
                            {error?.data?.message ||
                                error?.error ||
                                "An unexpected error occurred. Please try again later."}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && posts && posts.length > 0 && (
                    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
                        {posts.map((post) => (
                            <PostCard
                                key={post?._id}
                                post={post}
                                // onEditRequest={() => openPostModal("edit", post)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && !isError && (!posts || posts.length === 0) && (
                    <div className="text-center py-16 sm:py-20 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-8 sm:p-12 max-w-lg mx-auto">
                        <MessageSquarePlus
                            size={56}
                            className="mx-auto text-slate-400 mb-5"
                        />
                        <h3 className="text-2xl font-semibold text-slate-700 mb-3">
                            It's quiet here...
                        </h3>
                        <p className="text-slate-500 mb-8">
                            No discussions have started yet. Why not kick things
                            off?
                        </p>
                        <button
                            onClick={() => openPostModal("add")}
                            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-base font-medium"
                        >
                            <PlusIconLucide size={18} /> Create New Post
                        </button>
                    </div>
                )}

                <button
                    onClick={() => openPostModal("add")}
                    className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer active:scale-95"
                    title="Create New Post"
                >
                    <FiPlus size={24} />
                </button>
            </div>

            {isPostModalOpen && (
                <PostFormModal
                    isOpen={isPostModalOpen}
                    initialPostData={currentPostToEdit}
                    modalMode={postModalMode}
                    onClose={() => {
                        setIsPostModalOpen(false);
                        setCurrentPostToEdit(null);
                    }}
                    onSave={handleSavePost}
                    // onDelete={handleDeleteConfirmation}
                />
            )}
        </div>
    );
};

export default Discussion;
