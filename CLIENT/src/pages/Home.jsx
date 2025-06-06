import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useGetNewUrlPhotoMutation } from "../features/cloudinary/cloudinaryApi";

import {
    Loader2,
    ArrowUpCircle,
    ArrowDownCircle,
    Target,
    Clock,
    AlertTriangle,
    MessageSquare,
    ArrowRight,
} from "lucide-react";
import { ProfileStatItem } from "../components/homeComponents/ProfileStatItem";
import { SkeletonItem } from "../components/homeComponents/SkeletonItem";
import { useFetchOwnPostQuery } from "../features/posts/postsApi";
import DiscussionCard from "../components/homeComponents/DiscussionCard";

const Home = () => {
    const { displayName, photoURL, isloggedIn, isAuthLoading, uid } =
        useSelector((state) => state.user);
    const navigate = useNavigate();
    const [
        getUrlPhoto,
        { data: newPhotoUrl, isSuccess, isLoading: isPhotoLoading },
    ] = useGetNewUrlPhotoMutation();

    const { data: ownDiscussion, isSuccess: isSuccessDiscussion } =
        useFetchOwnPostQuery(uid, { skip: !uid });
    const myDiscussion = isSuccessDiscussion ? ownDiscussion.data : null;
    console.log(myDiscussion);

    const finalPhotoUrl =
        isSuccess && newPhotoUrl ? newPhotoUrl.cloudinaryUrl : null;

    const [financeData, setFinanceData] = useState({ income: 0, expense: 0 });
    const [deadlineData, setDeadlineData] = useState({ total: 0, upcoming: 0 });
    const [isContentLoading, setIsContentLoading] = useState(true);

    useEffect(() => {
        if (photoURL) getUrlPhoto({ imageProfile: photoURL });
    }, [photoURL, getUrlPhoto]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFinanceData({ income: 5250000, expense: 1780000 });
            setDeadlineData({ total: 8, upcoming: 3 });
            setIsContentLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    const statItemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
    };

    if (isAuthLoading || (photoURL && isPhotoLoading)) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">Loading home...</p>
            </div>
        );
    }

    if (!isloggedIn) {
        navigate("/signin");
        return null;
    }

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col sm:flex-row gap-10">
                <motion.div variants={cardVariants}>
                    {isContentLoading ? (
                        <div className="w-auto sm:w-80 bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-32 h-32 rounded-full bg-gray-300 mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            </div>
                            <hr className="my-6 border-gray-200" />
                        </div>
                    ) : (
                        <motion.div
                            className="w-auto sm:w-80 bg-white rounded-2xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: { staggerChildren: 0.07 },
                                },
                            }}
                        >
                            <div className="flex flex-col items-center text-center mb-6">
                                <motion.div
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-4"
                                    whileHover={{ scale: 1.1, rotate: 3 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    <img
                                        className="w-full h-full object-cover"
                                        src={
                                            finalPhotoUrl ||
                                            `https://ui-avatars.com/api/?name=${
                                                displayName || "U"
                                            }&background=0D8ABC&color=fff&bold=true`
                                        }
                                        alt={displayName || "User"}
                                    />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {displayName}
                                </h2>
                                <p className="text-md text-gray-400">{uid}</p>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            <div className="space-y-4">
                                <ProfileStatItem
                                    IconComponent={ArrowUpCircle}
                                    label="Pemasukan Bulan Ini"
                                    value={formatCurrency(financeData.income)}
                                    valueClassName="text-green-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={ArrowDownCircle}
                                    label="Pengeluaran Bulan Ini"
                                    value={formatCurrency(financeData.expense)}
                                    valueClassName="text-red-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={Clock}
                                    label="Mendatang (Deadline)"
                                    value={`${deadlineData.upcoming} Aktivitas`}
                                    valueClassName="text-yellow-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={AlertTriangle}
                                    label="Terlambat (Deadline)"
                                    value={`${deadlineData.upcoming} Aktivitas`}
                                    valueClassName="text-purple-600"
                                    variants={statItemVariants}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
                <div className="flex flex-col self-start">
                    <motion.div
                        className="flex-1 bg-white rounded-2xl p-6 shadow-lg flex flex-col self-start transition-shadow duration-300 hover:shadow-xl"
                        variants={cardVariants}
                    >
                        {/* --- Bagian Atas: Judul & Konten --- */}
                        <div>
                            {/* Judul dengan Ikon */}
                            <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-xl font-bold text-gray-800">
                                    Diskusi Terbaru Anda
                                </h3>
                            </div>
                            {/* Konten Dinamis: Loading, Kosong, atau Daftar Diskusi */}
                            <div className="space-y-4">
                                {!isSuccessDiscussion ? (
                                    // 1. Tampilan saat Loading (MENGGUNAKAN SPINNER)
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                                    </div>
                                ) : myDiscussion && myDiscussion.length > 0 ? (
                                    // 2. Tampilan jika ada diskusi (menampilkan 2 terakhir)
                                    myDiscussion.slice(-2).map((discussion) => (
                                        <DiscussionCard
                                            key={
                                                discussion._id ||
                                                discussion.title
                                            } // PASTIKAN ADA KEY UNIK
                                            post={discussion}
                                        />
                                    ))
                                ) : (
                                    // 3. Tampilan jika tidak ada diskusi
                                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                                        <p className="text-gray-500">
                                            Anda belum memulai diskusi apapun.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                    <div>Berita</div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
