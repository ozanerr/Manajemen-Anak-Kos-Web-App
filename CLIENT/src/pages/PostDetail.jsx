import React, { useState, useEffect } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { useFetchSinglePostQuery } from "../features/posts/postsApi";
import {
    useAddCommentMutation,
    useFetchCommentsQuery,
} from "../features/comments/commentsApi";
import Comment from "../components/discussionComponents/Comment";
import { useSelector } from "react-redux";
import {
    MessageCircle,
    Send,
    Image as ImageIcon,
    AlertTriangle,
    Info,
    Loader2,
    ArrowLeft,
    UserCircle,
} from "lucide-react";
import { useGetNewUrlPhotoMutation } from "../features/cloudinary/cloudinaryApi";

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

const PostDetail = () => {
    const {
        displayName,
        photoURL,
        isloggedIn,
        isAuthLoading: userAuthLoading,
        uid,
        payload,
    } = useSelector((state) => state.user);

    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        if (!userAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [userAuthLoading, isloggedIn, navigate]);

    const {
        data: postResponse,
        isError: postFetchError,
        isLoading: postFetchLoading,
        error: postErrorData,
    } = useFetchSinglePostQuery(postId) || {};
    const post = postResponse?.data[0];

    const [addComment, { isLoading: isAddingComment, error: addCommentError }] =
        useAddCommentMutation() || {};

    const {
        data: commentsResponse,
        isError: commentsFetchError,
        isLoading: commentsFetchLoading,
        error: commentsErrorData,
    } = useFetchCommentsQuery(postId) || {};
    const comments = commentsResponse?.data;

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

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await addComment({
                postId: postId,
                data: {
                    uid: uid,
                    postId: postId,
                    username: displayName || payload.reloadUserInfo.screenName,
                    comment: comment,
                    imageProfile:
                        newUrl ||
                        `https://ui-avatars.com/api/?name=${(
                            displayName || "A"
                        ).charAt(
                            0
                        )}&background=random&color=fff&font-size=0.5&bold=true`,
                },
            }).unwrap();
            setComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    if (userAuthLoading || postFetchLoading) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4"></p>
            </div>
        );
    }

    if (!isloggedIn) {
        navigate("/signin");
    }

    if (postFetchError) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
                <div className="text-center bg-white/80 backdrop-blur-md rounded-xl border border-red-300/70 p-8 max-w-md mx-auto shadow-2xl">
                    <AlertTriangle
                        size={48}
                        className="mx-auto text-red-500 mb-4"
                    />
                    <p className="text-red-700 font-semibold text-xl mb-2">
                        Gagal Memuat Postingan
                    </p>
                    <p className="text-red-600 mt-1 text-base">
                        {postErrorData?.data?.message ||
                            "Could not fetch the post. Please try again."}
                    </p>
                    <button
                        onClick={() => navigate("/discussion")}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300/50 rounded-lg px-5 py-2.5 transition-colors shadow hover:shadow-md cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back to Discussions
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
                <div className="text-center bg-white/80 backdrop-blur-md rounded-xl border border-yellow-300/70 p-8 max-w-md mx-auto shadow-2xl">
                    <Info size={48} className="mx-auto text-yellow-500 mb-4" />
                    <p className="text-yellow-700 font-semibold text-xl mb-2">
                        Postingan Tidak Ditemukan
                    </p>
                    <p className="text-yellow-600 mt-1 text-base">
                        Postingan yang diminta tidak dapat ditemukan.
                    </p>
                    <button
                        onClick={() => navigate("/discussion")}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300/50 rounded-lg px-5 py-2.5 transition-colors shadow hover:shadow-md"
                    >
                        <ArrowLeft size={16} /> Kembali ke Diskusi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 sm:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("/discussion")}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-6 group transition-colors cursor-pointer"
                >
                    <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform duration-150"
                    />{" "}
                    Kembali ke Diskusi
                </button>

                <article className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl overflow-hidden">
                    {post.image && (
                        <div className="w-full max-h-[350px] sm:max-h-[450px] md:max-h-[600px] overflow-hidden">
                            {" "}
                            <img
                                className="w-full h-full object-cover"
                                src={post.gambar}
                                alt={post.judul || "Post image"}
                            />
                        </div>
                    )}
                    <div className="p-6 sm:p-8 md:p-10">
                        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight break-words">
                                {post.judul}
                            </h1>
                            {post.kota && (
                                <span className="self-start sm:self-center mt-1 sm:mt-0 flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-wide shadow-sm">
                                    {post.kota}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200/80">
                            <img
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                                src={
                                    post.imageProfile ||
                                    `https://ui-avatars.com/api/?name=${(
                                        post.username || "U"
                                    ).charAt(
                                        0
                                    )}&background=random&color=fff&font-size=0.5&bold=true`
                                }
                                alt={post.username || "Author"}
                            />
                            <div>
                                <span className="font-semibold text-slate-700">
                                    {post.username || "Anonymous"}
                                </span>
                                <p className="text-xs">
                                    <time dateTime={post.createdAt}>
                                        {formatter.format(
                                            new Date(post.createdAt)
                                        )}
                                    </time>
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none prose-base sm:prose-lg text-slate-700 leading-relaxed">
                            {post.deskripsi &&
                                post.deskripsi
                                    .split("\n")
                                    .map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="mb-4 last:mb-0"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                        </div>
                    </div>
                </article>

                <section className="mt-10 sm:mt-12 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-xl p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 flex items-center">
                            <MessageCircle
                                size={26}
                                className="mr-3 text-blue-500"
                            />
                            Diskusi ({comments?.length || 0})
                        </h2>
                    </div>

                    <form onSubmit={submitHandler} className="mb-8">
                        <div className="w-full mb-2 border border-slate-300/80 rounded-xl bg-white/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-sm">
                            <div className="px-4 py-3">
                                <label htmlFor="comment" className="sr-only">
                                    Komentar Anda
                                </label>
                                <textarea
                                    id="comment"
                                    rows="4"
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-0 text-sm text-slate-800 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-slate-500 resize-none"
                                    placeholder="Bagikan komentar Anda atau ajukan pertanyaan..."
                                    required
                                    value={comment}
                                />
                            </div>
                            <div className="flex items-center justify-end px-3 py-2.5 border-t border-slate-300/60 bg-slate-50/40 rounded-b-xl">
                                <button
                                    type="submit"
                                    disabled={
                                        isAddingComment || !comment.trim()
                                    }
                                    className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg focus:ring-4 focus:ring-blue-300/70 hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
                                >
                                    {isAddingComment ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                    Kirim Komentar
                                </button>
                            </div>
                        </div>
                        {addCommentError && (
                            <p className="text-xs text-red-600 mt-1">
                                Gagal mengirim komentar. Silakan coba lagi.
                            </p>
                        )}
                    </form>

                    {commentsFetchLoading && (
                        <div className="text-center py-6">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                            <p className="text-slate-500 mt-2">
                                Memuat komentar, harap tunggu...
                            </p>
                        </div>
                    )}
                    {commentsFetchError && (
                        <div className="text-center py-6 text-red-600">
                            <AlertTriangle className="mx-auto mb-2" />
                            Gagal memuat komentar.
                        </div>
                    )}

                    <div className="space-y-6">
                        {comments && comments.length > 0
                            ? comments.map((commentData) => (
                                  <Comment
                                      key={commentData?._id}
                                      comment={commentData}
                                      postId={postId}
                                  />
                              ))
                            : !commentsFetchLoading &&
                              !postFetchError && (
                                  <p className="text-slate-500 text-center py-4">
                                      Belum ada komentar. Jadilah yang pertama
                                      untuk berkomentar!
                                  </p>
                              )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PostDetail;
