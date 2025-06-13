import React, { useState, useEffect } from "react";
import {
    useFetchPostsQuery,
    useAddPostMutation,
    useEditPostMutation,
    useDeletePostMutation,
} from "../features/posts/postsApi";
import PostCard from "../components/discussionComponents/PostCard";
import PostFormModal from "../components/discussionComponents/PostFormModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import {
    MessageSquarePlus,
    AlertTriangle as AlertTriangleIcon,
    Loader2,
    Plus as PlusIconLucide,
} from "lucide-react";
import { useGetNewUrlPhotoMutation } from "../features/cloudinary/cloudinaryApi";

const Discussion = () => {
    const {
        data: postsResponse,
        isError,
        isLoading,
        error,
    } = useFetchPostsQuery() || {};
    const posts = postsResponse?.data || [];

    const { displayName, photoURL, isloggedIn, isAuthLoading, uid, payload } =
        useSelector((state) => state.user);
    const navigate = useNavigate();

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [currentPostToEdit, setCurrentPostToEdit] = useState(null);
    const [postModalMode, setPostModalMode] = useState("add");

    const [addPost, { isLoading: isAddingPost }] = useAddPostMutation() || {};
    const [editPost] = useEditPostMutation();
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

    const [deletePostMutation, { isLoading: isDeletingPost }] =
        useDeletePostMutation() || {};

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
        if (isAddingPost) {
            return;
        }
        try {
            if (postModalMode === "add") {
                const newPostData = {
                    ...postDataFromModal,
                    uid: uid,
                    username: displayName || payload.reloadUserInfo.screenName,
                    imageProfile:
                        newUrl ||
                        `https://ui-avatars.com/api/?name=${(
                            displayName || "A"
                        ).charAt(
                            0
                        )}&background=random&color=fff&font-size=0.5&bold=true`,
                };
                await addPost(newPostData).unwrap();
            } else if (postModalMode === "edit" && currentPostToEdit) {
                await editPost({
                    postId: currentPostToEdit._id,
                    data: postDataFromModal,
                });
            }
            setIsPostModalOpen(false);
            setCurrentPostToEdit(null);
        } catch (err) {
            if (postModalMode === "add") {
                console.error(`Failed to add post:`, err);
                alert(
                    `Gagal menambahkan postingan: ${
                        err.data?.message ||
                        err.message ||
                        "Error tidak diketahui"
                    }`
                );
            } else {
                console.error(
                    `Failed to ${postModalMode} post (simulated or actual):`,
                    err
                );
            }
        }
    };

    const handleDeletePostFromModal = async () => {
        if (currentPostToEdit && currentPostToEdit._id) {
            if (
                window.confirm(
                    "Apakah Anda yakin ingin menghapus postingan ini dari modal?"
                )
            ) {
                try {
                    await deletePostMutation(currentPostToEdit._id).unwrap();
                    setIsPostModalOpen(false);
                    setCurrentPostToEdit(null);
                } catch (err) {
                    console.error("Failed to delete post from modal:", err);
                    alert(
                        `Gagal menghapus postingan: ${
                            err.data?.message ||
                            err.message ||
                            "Error tidak diketahui"
                        }`
                    );
                }
            }
        }
    };

    if (isAuthLoading || newUrl === null) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">
                    Loading diskusi...
                </p>
            </div>
        );
    }
    if (!isloggedIn) {
        navigate("/signin");
    }

    const isActuallySaving = postModalMode === "add" ? isAddingPost : false;

    return (
        <>
            <motion.div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-8">
                <div className="text-center mb-10 sm:mb-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Diskusi Komunitas
                    </h1>
                    <p className="text-gray-600 mt-1 text-base max-w-2xl mx-auto">
                        Jelajahi topik, berbagi wawasan, dan terhubung dengan
                        sesama anggota.
                    </p>
                </div>

                {!isLoading && !isError && posts && posts.length > 0 && (
                    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
                        {posts.map((post) => (
                            <PostCard
                                key={post?._id}
                                post={post}
                                onEditRequest={() =>
                                    openPostModal("edit", post)
                                }
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
                            Sangat diam disini...
                        </h3>
                        <p className="text-slate-500 mb-8">
                            Belum ada diskusi yang dimulai. Mengapa tidak
                            memulainya?
                        </p>
                        <button
                            onClick={() => openPostModal("add")}
                            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-base font-medium cursor-pointer"
                        >
                            <PlusIconLucide size={18} />
                            Buat Postingan Baru
                        </button>
                    </div>
                )}

                <button
                    onClick={() => openPostModal("add")}
                    className="fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
                    title="Buat postingan baru"
                >
                    <FaPlus size={24} />
                </button>
            </motion.div>

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
                    onDelete={
                        postModalMode === "edit"
                            ? handleDeletePostFromModal
                            : undefined
                    }
                    isSaving={isActuallySaving}
                    isDeleting={isDeletingPost}
                />
            )}
        </>
    );
};

export default Discussion;
