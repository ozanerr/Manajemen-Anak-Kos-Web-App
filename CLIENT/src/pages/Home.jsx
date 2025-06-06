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
} from "lucide-react";
import { ProfileStatItem } from "../components/ProfileStatItem";

const Home = () => {
    const { displayName, photoURL, isloggedIn, isAuthLoading } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const [
        getUrlPhoto,
        { data: newPhotoUrl, isSuccess, isLoading: isPhotoLoading },
    ] = useGetNewUrlPhotoMutation();

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
            <div className="flex flex-col lg:flex-row gap-10">
                <motion.div variants={cardVariants}>
                    {isContentLoading ? (
                        <div className="w-auto sm:w-80 bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-32 h-32 rounded-full bg-gray-300 mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            </div>
                            <hr className="my-6 border-gray-200" />
                            <div className="space-y-6">
                                <SkeletonItem />
                                <SkeletonItem />
                                <SkeletonItem />
                                <SkeletonItem />
                            </div>
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
                                <p className="text-md text-gray-400">
                                    m288d4ky3223
                                </p>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            <div className="space-y-4">
                                <ProfileStatItem
                                    IconComponent={ArrowUpCircle}
                                    label="Pemasukan"
                                    value={formatCurrency(financeData.income)}
                                    valueClassName="text-green-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={ArrowDownCircle}
                                    label="Pengeluaran"
                                    value={formatCurrency(financeData.expense)}
                                    valueClassName="text-red-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={Target}
                                    label="Total Deadlines"
                                    value={`${deadlineData.total} Tugas`}
                                    valueClassName="text-blue-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={Clock}
                                    label="Mendatang"
                                    value={`${deadlineData.upcoming} Tugas`}
                                    valueClassName="text-yellow-600"
                                    variants={statItemVariants}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div className="flex-1" variants={cardVariants}>
                    <div className="flex flex-col gap-6 h-full">
                        <motion.div
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-8 text-center shadow-lg flex flex-col justify-center transition-all duration-300 cursor-pointer"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                            }}
                        >
                            <h4 className="text-white text-2xl font-bold">
                                Diskusi Tim
                            </h4>
                            <p className="text-green-100 mt-2">
                                Buka forum diskusi proyek terbaru.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-8 text-center shadow-lg flex flex-col justify-center transition-all duration-300 cursor-pointer"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                            }}
                        >
                            <h4 className="text-white text-2xl font-bold">
                                Berita & Pengumuman
                            </h4>
                            <p className="text-blue-100 mt-2">
                                Lihat pengumuman penting perusahaan.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Home;
