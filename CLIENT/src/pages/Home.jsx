import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useFetchFinanceQuery } from "../features/finance/financeApi";
import { useFetchDeadlinesQuery } from "../features/deadlines/deadlinesApi";
import { useGetNewUrlPhotoMutation } from "../features/cloudinary/cloudinaryApi";
import { useFetchOwnPostQuery } from "../features/posts/postsApi";

import {
    Loader2,
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    AlertTriangle,
    MessageSquare,
} from "lucide-react";
import { ProfileStatItem } from "../components/homeComponents/ProfileStatItem";
import DiscussionCard from "../components/homeComponents/DiscussionCard";

const Home = () => {
    const { displayName, photoURL, isloggedIn, isAuthLoading, uid, payload } =
        useSelector((state) => state.user);
    const navigate = useNavigate();

    const [
        getUrlPhoto,
        { data: newPhotoUrl, isSuccess, isLoading: isPhotoLoading },
    ] = useGetNewUrlPhotoMutation();

    const { data: ownDiscussion, isSuccess: isSuccessDiscussion } =
        useFetchOwnPostQuery(uid, { skip: !uid });

    const { data: financeApiResponse, isLoading: isFinanceLoading } =
        useFetchFinanceQuery(uid, { skip: !uid });

    const { data: deadlinesResponse, isLoading: isDeadlineLoading } =
        useFetchDeadlinesQuery(uid, { skip: !uid });

    const financialStats = useMemo(() => {
        if (!financeApiResponse || !Array.isArray(financeApiResponse.data)) {
            return { income: 0, expense: 0 };
        }

        const transactions = financeApiResponse.data;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let totalIncomeThisMonth = 0;
        let totalExpensesThisMonth = 0;

        transactions.forEach((tx) => {
            const txDate = new Date(tx.tanggal);
            const amount = parseFloat(tx.jumlah);
            if (
                !isNaN(txDate.getTime()) &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            ) {
                if (tx.tipe === "Pemasukan") {
                    totalIncomeThisMonth += amount;
                } else if (tx.tipe === "Pengeluaran") {
                    totalExpensesThisMonth += amount;
                }
            }
        });

        return {
            income: totalIncomeThisMonth,
            expense: totalExpensesThisMonth,
        };
    }, [financeApiResponse]);

    const deadlineStats = useMemo(() => {
        if (!deadlinesResponse || !Array.isArray(deadlinesResponse.data)) {
            return { overdue: 0, upcoming: 0 };
        }
        const events = deadlinesResponse.data;
        const now = new Date();

        const overdue = events.filter(
            (e) => e.end && !e.completed && new Date(e.end) < now
        ).length;

        const upcoming = events.filter((e) => {
            if (!e.end || e.completed) return false;
            const dueDate = new Date(e.end);
            if (dueDate < now) return false;
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
        }).length;

        return { overdue, upcoming };
    }, [deadlinesResponse]);

    const myDiscussion = isSuccessDiscussion ? ownDiscussion.data : null;

    const finalPhotoUrl =
        isSuccess && newPhotoUrl ? newPhotoUrl.cloudinaryUrl : null;

    useEffect(() => {
        if (photoURL) getUrlPhoto({ imageProfile: photoURL });
    }, [photoURL, getUrlPhoto]);

    const isContentLoading = isFinanceLoading || isDeadlineLoading;

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

    if (isAuthLoading || (uid && (isPhotoLoading || isContentLoading))) {
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
                                <p className="text-md text-gray-400">
                                    Member sejak{" "}
                                    {payload.metadata.creationTime.slice(7, 16)}
                                </p>
                            </div>
                            <hr className="my-6 border-gray-200" />
                            <div className="space-y-4">
                                <ProfileStatItem
                                    IconComponent={ArrowUpCircle}
                                    label="Pemasukan Bulan Ini"
                                    value={formatCurrency(
                                        financialStats.income
                                    )}
                                    valueClassName="text-green-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={ArrowDownCircle}
                                    label="Pengeluaran Bulan Ini"
                                    value={formatCurrency(
                                        financialStats.expense
                                    )}
                                    valueClassName="text-red-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={Clock}
                                    label="Mendatang (Deadline)"
                                    value={`${deadlineStats.upcoming} Aktivitas`}
                                    valueClassName="text-yellow-600"
                                    variants={statItemVariants}
                                />
                                <ProfileStatItem
                                    IconComponent={AlertTriangle}
                                    label="Terlambat (Deadline)"
                                    value={`${deadlineStats.overdue} Aktivitas`}
                                    valueClassName="text-purple-600"
                                    variants={statItemVariants}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
                <div className="flex flex-col flex-1">
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-lg flex flex-col transition-shadow duration-300 hover:shadow-xl"
                        variants={cardVariants}
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-xl font-bold text-gray-800">
                                    Diskusi Terbaru Anda
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {!isSuccessDiscussion ? (
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                                    </div>
                                ) : myDiscussion && myDiscussion.length > 0 ? (
                                    myDiscussion
                                        .slice(-4)
                                        .map((discussion) => (
                                            <DiscussionCard
                                                key={
                                                    discussion._id ||
                                                    discussion.title
                                                }
                                                post={discussion}
                                            />
                                        ))
                                ) : (
                                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                                        <p className="text-gray-500">
                                            Anda belum memulai diskusi apapun.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
