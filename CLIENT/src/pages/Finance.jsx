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
    Info,
    Loader2,
} from "lucide-react";

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

const initialTransactions = [
    {
        id: 1,
        name: "Bayar uang kos",
        amount: 800000,
        type: "expense",
        date: "2025-08-18",
    },
    {
        id: 2,
        name: "Makan Siang",
        amount: 50000,
        type: "expense",
        date: "2025-06-22",
    },
    {
        id: 3,
        name: "Gaji Bulan Mei",
        amount: 20000000,
        type: "income",
        date: "2025-05-11",
    },
    {
        id: 4,
        name: "Bonus Proyek",
        amount: 5000000,
        type: "income",
        date: "2025-04-20",
    },
    {
        id: 5,
        name: "Belanja Online",
        amount: 350000,
        type: "expense",
        date: "2025-03-15",
    },
    {
        id: 6,
        name: "Gaji Bulan April",
        amount: 18000000,
        type: "income",
        date: "2025-04-10",
    },
    {
        id: 7,
        name: "Tagihan Listrik April",
        amount: 450000,
        type: "expense",
        date: "2025-04-25",
    },
    {
        id: 8,
        name: "Gaji Bulan Juni",
        amount: 21000000,
        type: "income",
        date: "2025-06-10",
    },
    {
        id: 9,
        name: "Investasi Saham",
        amount: 2000000,
        type: "expense",
        date: "2025-06-15",
    },
    {
        id: 10,
        name: "Belanja Bulanan Mei",
        amount: 1500000,
        type: "expense",
        date: "2025-05-02",
    },
    {
        id: 11,
        name: "Transportasi Mei",
        amount: 300000,
        type: "expense",
        date: "2025-05-20",
    },
];

const formatRupiah = (amount, includeSign = false) => {
    if (amount === null || amount === undefined) {
        return "Rp0";
    }

    const numberFormat = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    let formattedAmount = numberFormat.format(Math.abs(amount));

    if (includeSign) {
        if (amount > 0) {
            formattedAmount = "+ " + formattedAmount;
        } else if (amount < 0) {
            formattedAmount = "- " + formattedAmount;
        }
    } else if (amount < 0) {
        formattedAmount = "- " + formattedAmount;
    }

    return formattedAmount;
};

const Finance = () => {
    const { isloggedIn, isAuthLoading, uid } = useSelector(
        (state) => state.user
    );
    const navigate = useNavigate();
    const [addFinance] = useCreateFinanceMutation();
    const [editFinance] = useEditFinanceMutation();
    const [deleteFinance] = useDeleteFinanceMutation();
    const { data: financeData } = useFetchFinanceQuery(uid);

    const [transactions, setTransactions] = useState(initialTransactions);
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [financeModalMode, setFinanceModalMode] = useState("add");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(
            () => setCurrentTime(new Date()),
            60000 * 5
        );
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    const financialStats = useMemo(() => {
        const now = currentTime;
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let totalIncomeThisMonth = 0;
        let totalExpensesThisMonth = 0;
        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            if (
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            ) {
                if (tx.type === "income") {
                    totalIncomeThisMonth += tx.amount;
                } else {
                    totalExpensesThisMonth += tx.amount;
                }
            }
        });
        const balance = transactions.reduce(
            (acc, tx) => acc + (tx.type === "income" ? tx.amount : -tx.amount),
            0
        );
        return {
            balance,
            monthlyIncome: totalIncomeThisMonth,
            monthlyExpenses: totalExpensesThisMonth,
            monthlyNetFlow: totalIncomeThisMonth - totalExpensesThisMonth,
        };
    }, [transactions, currentTime]);

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
        const endDate = new Date(currentTime);
        const startDate = new Date(currentTime);
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
            const txDate = new Date(tx.date);
            if (txDate >= startDate && txDate <= endDate) {
                const monthKey = `${monthNames[txDate.getMonth()]} '${String(
                    txDate.getFullYear()
                ).slice(2)}`;
                if (dataByMonth[monthKey]) {
                    if (tx.type === "income") {
                        dataByMonth[monthKey].income += tx.amount;
                    } else {
                        dataByMonth[monthKey].expense += tx.amount;
                    }
                    dataByMonth[monthKey].net =
                        dataByMonth[monthKey].income -
                        dataByMonth[monthKey].expense;
                }
            }
        });
        return Object.values(dataByMonth);
    }, [transactions, currentTime]);

    const handleOpenAddModal = () => {
        setCurrentTransaction({
            transaksi: "",
            jumlah: "",
            tanggal: new Date(),
            tipe: "expense",
        });
        setFinanceModalMode("add");
        setIsFinanceModalOpen(true);
    };

    const handleOpenEditModal = useCallback((transactionToEdit) => {
        setCurrentTransaction(transactionToEdit);
        setFinanceModalMode("edit");
        setIsFinanceModalOpen(true);
    }, []);

    const handleSaveTransaction = async (transactionDataFromModal) => {
        if (financeModalMode === "add") {
            console.log(transactionDataFromModal);
            try {
                await addFinance({ uid: uid, data: transactionDataFromModal });
            } catch (error) {
                alert("gagal add finances");
            }
            setTransactions((prev) => [
                ...prev,
                {
                    ...transactionDataFromModal,
                    id:
                        prev.length > 0
                            ? Math.max(...prev.map((t) => t.id)) + 1
                            : 1,
                },
            ]);
        } else {
            setTransactions((prev) =>
                prev.map((t) =>
                    t.id === transactionDataFromModal.id
                        ? transactionDataFromModal
                        : t
                )
            );
        }
        setIsFinanceModalOpen(false);
        setCurrentTransaction(null);
    };

    const handleDeleteTransactionCallback = useCallback(
        (transactionId) => {
            if (
                window.confirm(
                    "Apakah Anda yakin ingin menghapus transaksi ini?"
                )
            ) {
                setTransactions((prev) =>
                    prev.filter((t) => t.id !== transactionId)
                );
            }
            if (
                isFinanceModalOpen &&
                currentTransaction &&
                currentTransaction.id === transactionId
            ) {
                setIsFinanceModalOpen(false);
                setCurrentTransaction(null);
            }
        },
        [isFinanceModalOpen, currentTransaction]
    );

    const handleDeleteFromModal = () => {
        if (currentTransaction && currentTransaction.id) {
            handleDeleteTransactionCallback(currentTransaction.id);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">
                    Loading keuangan...
                </p>
            </div>
        );
    }
    if (!isloggedIn) {
        navigate("/signin");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        iconContainerClass="bg-green-100"
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
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <TransactionRow
                                            key={`desktop-${tx.id}`}
                                            transaction={tx}
                                            onEdit={() =>
                                                handleOpenEditModal(tx)
                                            }
                                            onDelete={() =>
                                                handleDeleteTransactionCallback(
                                                    tx.id
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
                                            Belum ada transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="sm:hidden space-y-4">
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TransactionCardMobile
                                        key={`mobile-${tx.id}`}
                                        transaction={tx}
                                        onEdit={() => handleOpenEditModal(tx)}
                                        onDelete={() =>
                                            handleDeleteTransactionCallback(
                                                tx.id
                                            )
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    Belum ada transaksi.
                                </div>
                            )}
                        </div>
                    </div>
                    {transactions.length === 0 && (
                        <div className="text-center py-10 text-gray-500 mt-4 sm:hidden">
                            {" "}
                            Tambahkan satu untuk memulai!
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleOpenAddModal}
                className="sm:hidden fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer active:scale-95"
                title="Add Transaction"
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
                        financeModalMode === "edit"
                            ? handleDeleteFromModal
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default Finance;
