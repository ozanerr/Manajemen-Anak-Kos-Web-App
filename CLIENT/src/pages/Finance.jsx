import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import {
    Plus as PlusIconLucide,
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

import FinanceModal from "../components/financeComponents/FinanceModal";
import FinancialStatCard from "../components/financeComponents/FinancialStatCard";
import MonthlyFlowChart from "../components/financeComponents/MonthlyFlowChart";
import TransactionRow from "../components/financeComponents/TransactionRow";
import TransactionCardMobile from "../components/financeComponents/TransactionCardMobile";
import {
    useCreateFinanceMutation,
    useDeleteFinanceMutation,
    useEditFinanceMutation,
    useFetchFinanceQuery,
} from "../features/finance/financeApi";

const formatRupiah = (amount, includeSign = false) => {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount))) {
        return "Rp0";
    }
    const numericAmount = parseFloat(amount);
    const numberFormat = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    let formattedAmount = numberFormat.format(Math.abs(numericAmount));
    if (includeSign) {
        if (numericAmount > 0) {
            formattedAmount = "+ " + formattedAmount;
        } else if (numericAmount < 0) {
            formattedAmount = "- " + formattedAmount;
        }
    } else if (numericAmount < 0) {
        formattedAmount = "- " + formattedAmount;
    }
    return formattedAmount;
};

const Finance = () => {
    const { isloggedIn, isAuthLoading, uid } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();

    const {
        data: financeApiResponse,
        isLoading: isLoadingFinance,
        isError: isFinanceError,
        error: financeFetchError,
        refetch: refetchFinances,
    } = useFetchFinanceQuery(uid, {
        skip: !uid,
    });

    const transactions = useMemo(() => {
        if (financeApiResponse && Array.isArray(financeApiResponse.data)) {
            return financeApiResponse.data;
        }
        return [];
    }, [financeApiResponse]);

    const [addFinance, { isLoading: isAddingFinance }] =
        useCreateFinanceMutation();
    const [editFinance, { isLoading: isEditingFinance }] =
        useEditFinanceMutation();
    const [deleteFinance, { isLoading: isDeletingFinance }] =
        useDeleteFinanceMutation();

    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [financeModalMode, setFinanceModalMode] = useState("add");

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    const financialStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let totalIncomeThisMonth = 0;
        let totalExpensesThisMonth = 0;

        transactions.forEach((tx) => {
            const txDate = new Date(tx.tanggal);
            const amount = parseFloat(tx.jumlah);
            const type = tx.tipe;

            if (
                !isNaN(txDate.getTime()) &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            ) {
                if (type === "Pemasukan") {
                    totalIncomeThisMonth += amount;
                } else if (type === "Pengeluaran") {
                    totalExpensesThisMonth += amount;
                }
            }
        });
        const balance = transactions.reduce((acc, tx) => {
            const amount = parseFloat(tx.jumlah);
            return acc + (tx.tipe === "Pemasukan" ? amount : -amount);
        }, 0);
        return {
            balance,
            monthlyIncome: totalIncomeThisMonth,
            monthlyExpenses: totalExpensesThisMonth,
            monthlyNetFlow: totalIncomeThisMonth - totalExpensesThisMonth,
        };
    }, [transactions]);

    const monthlyChartData = useMemo(() => {
        const dataByMonth = {};
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Des",
        ];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11);

        for (let i = 0; i < 12; i++) {
            const d = new Date(startDate);
            d.setMonth(startDate.getMonth() + i);
            const monthKey = `${monthNames[d.getMonth()]} '${String(
                d.getFullYear()
            ).slice(2)}`;
            dataByMonth[monthKey] = {
                name: monthKey,
                income: 0,
                expense: 0,
                net: 0,
            };
        }
        transactions.forEach((tx) => {
            const txDate = new Date(tx.tanggal);
            const amount = parseFloat(tx.jumlah);
            const type = tx.tipe; // Field dari backend adalah 'tipe'
            if (
                !isNaN(txDate.getTime()) &&
                txDate >= startDate &&
                txDate <= endDate
            ) {
                const monthKey = `${monthNames[txDate.getMonth()]} '${String(
                    txDate.getFullYear()
                ).slice(2)}`;
                if (dataByMonth[monthKey]) {
                    if (type === "Pemasukan") {
                        dataByMonth[monthKey].income += amount;
                    } else if (type === "Pengeluaran") {
                        dataByMonth[monthKey].expense += amount;
                    }
                    dataByMonth[monthKey].net =
                        dataByMonth[monthKey].income -
                        dataByMonth[monthKey].expense;
                }
            }
        });
        return Object.values(dataByMonth);
    }, [transactions]);

    const handleOpenAddModal = () => {
        setCurrentTransaction({
            transaksi: "",
            jumlah: "",
            tanggal: new Date(),
            tipe: "Pengeluaran", // Default
        });
        setFinanceModalMode("add");
        setIsFinanceModalOpen(true);
    };

    const handleOpenEditModal = useCallback((transactionToEdit) => {
        setCurrentTransaction({
            ...transactionToEdit,
        });
        setFinanceModalMode("edit");
        setIsFinanceModalOpen(true);
    }, []);

    const handleSaveTransaction = async (transactionDataFromModal) => {
        const payloadForApi = {
            transaksi: transactionDataFromModal.transaksi,
            tipe: transactionDataFromModal.tipe,
            jumlah: transactionDataFromModal.jumlah,
            tanggal: transactionDataFromModal.tanggal,
        };

        try {
            if (financeModalMode === "add") {
                await addFinance({ uid: uid, data: payloadForApi }).unwrap();
            } else if (transactionDataFromModal._id) {
                await editFinance({
                    uid: uid,
                    financeId: transactionDataFromModal._id,
                    data: payloadForApi,
                }).unwrap();
            }
        } catch (error) {
            console.error(
                `Gagal ${
                    financeModalMode === "add" ? "menambah" : "mengedit"
                } keuangan:`,
                error
            );
            alert(
                `Gagal ${
                    financeModalMode === "add" ? "menambah" : "mengedit"
                } keuangan: ${
                    error?.data?.message ||
                    error?.message ||
                    "Terjadi kesalahan"
                }`
            );
        }
        setIsFinanceModalOpen(false);
        setCurrentTransaction(null);
    };

    const handleDeleteTransactionCallback = useCallback(
        async (transactionId) => {
            if (
                window.confirm(
                    "Apakah Anda yakin ingin menghapus transaksi ini?"
                )
            ) {
                try {
                    await deleteFinance({
                        uid: uid,
                        financeId: transactionId,
                    }).unwrap();
                } catch (error) {
                    console.error("Gagal menghapus keuangan:", error);
                    alert(
                        `Gagal menghapus keuangan: ${
                            error?.data?.message ||
                            error?.message ||
                            "Terjadi kesalahan"
                        }`
                    );
                }
            }
            if (
                isFinanceModalOpen &&
                currentTransaction &&
                currentTransaction._id === transactionId
            ) {
                setIsFinanceModalOpen(false);
                setCurrentTransaction(null);
            }
        },
        [uid, deleteFinance, isFinanceModalOpen, currentTransaction]
    );

    const handleDeleteFromModal = () => {
        if (currentTransaction && currentTransaction._id) {
            handleDeleteTransactionCallback(currentTransaction._id);
        }
    };

    if (isAuthLoading || (uid && isLoadingFinance)) {
        return (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">
                    Loading data keuangan...
                </p>
            </div>
        );
    }

    if (!isAuthLoading && !isloggedIn) {
        navigate("/signin");
        return null;
    }

    if (isFinanceError) {
        return (
            <div className="text-red-600">
                <p>
                    Error memuat data keuangan:{" "}
                    {financeFetchError?.data?.message ||
                        financeFetchError?.error ||
                        "Terjadi kesalahan tidak diketahui"}
                </p>
                <button
                    onClick={refetchFinances}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <>
            <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:py-1">
                            Dasbor Keuangan
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Pelacak keuangan pribadi Anda.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        disabled={isAddingFinance || isEditingFinance} // Disable tombol saat proses simpan/edit
                        className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 sm:p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
                    >
                        <PlusIconLucide size={20} />
                        <span className="inline text-base font-medium">
                            Tambah Transaksi
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <FinancialStatCard
                        title="Total Saldo"
                        formattedValue={formatRupiah(financialStats.balance)}
                        IconComponent={Wallet}
                        iconContainerClass="bg-blue-100"
                        iconClass="text-blue-600"
                        valueClass="text-gray-900"
                    />
                    <FinancialStatCard
                        title="Pemasukan (Bulan Ini)"
                        formattedValue={formatRupiah(
                            financialStats.monthlyIncome
                        )}
                        IconComponent={TrendingUp}
                        iconContainerClass="bg-green-200"
                        iconClass="text-green-600"
                        valueClass="text-green-600"
                    />
                    <FinancialStatCard
                        title="Pengeluaran (Bulan Ini)"
                        formattedValue={formatRupiah(
                            financialStats.monthlyExpenses
                        )}
                        IconComponent={TrendingDown}
                        iconContainerClass="bg-red-100"
                        iconClass="text-red-600"
                        valueClass="text-red-600"
                    />
                    <FinancialStatCard
                        title="Arus Bersih (Bulan Ini)"
                        formattedValue={formatRupiah(
                            financialStats.monthlyNetFlow,
                            true
                        )}
                        IconComponent={ArrowLeftRight}
                        iconContainerClass={`${
                            financialStats.monthlyNetFlow >= 0
                                ? "bg-blue-100"
                                : "bg-orange-100"
                        }`}
                        iconClass={`${
                            financialStats.monthlyNetFlow >= 0
                                ? "text-blue-600"
                                : "text-orange-500"
                        }`}
                        valueClass={`${
                            financialStats.monthlyNetFlow >= 0
                                ? "text-blue-600"
                                : "text-orange-500"
                        }`}
                    />
                </div>

                <div className="mb-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-2 sm:p-6">
                    <MonthlyFlowChart data={monthlyChartData} />
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Riwayat Transaksi
                        </h2>
                    </div>
                    <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <table className="min-w-full text-left text-xs sm:text-sm hidden sm:table">
                            <thead>
                                <tr className="border-b border-gray-300/70">
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Transaksi
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Tipe
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Jumlah
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Tanggal
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="sm:divide-y sm:divide-gray-200/50">
                                {transactions && transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <TransactionRow
                                            key={tx._id} // Gunakan _id unik dari backend
                                            transaction={tx} // Mengirim field: transaksi, tipe, jumlah, tanggal, _id
                                            onEdit={() =>
                                                handleOpenEditModal(tx)
                                            }
                                            onDelete={() =>
                                                handleDeleteTransactionCallback(
                                                    tx._id
                                                )
                                            }
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-10 text-gray-500"
                                        >
                                            {isLoadingFinance
                                                ? "Memuat transaksi..."
                                                : "Belum ada transaksi."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="sm:hidden space-y-4">
                            {transactions && transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TransactionCardMobile
                                        key={tx._id} // Gunakan _id unik dari backend
                                        transaction={tx} // Mengirim field: transaksi, tipe, jumlah, tanggal, _id
                                        onEdit={() => handleOpenEditModal(tx)}
                                        onDelete={() =>
                                            handleDeleteTransactionCallback(
                                                tx._id
                                            )
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    {isLoadingFinance
                                        ? "Memuat transaksi..."
                                        : "Belum ada transaksi."}
                                </div>
                            )}
                        </div>
                    </div>
                    {(!transactions || transactions.length === 0) &&
                        !isLoadingFinance && (
                            <div className="text-center py-10 text-gray-500 mt-4 sm:hidden">
                                Tambahkan satu untuk memulai!
                            </div>
                        )}
                </div>
            </motion.div>

            <button
                onClick={handleOpenAddModal}
                disabled={isAddingFinance || isEditingFinance}
                className="sm:hidden fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
                title="Tambah Transaksi"
            >
                <FaPlus size={24} />
            </button>

            {isFinanceModalOpen && (
                <FinanceModal
                    initialTransaction={currentTransaction}
                    modalMode={financeModalMode}
                    onClose={() => {
                        setIsFinanceModalOpen(false);
                        setCurrentTransaction(null);
                    }}
                    onSave={handleSaveTransaction}
                    onDelete={
                        financeModalMode === "edit" && currentTransaction
                            ? handleDeleteFromModal
                            : undefined
                    }
                    isProcessing={
                        isAddingFinance || isEditingFinance || isDeletingFinance
                    }
                />
            )}
        </>
    );
};

export default Finance;
