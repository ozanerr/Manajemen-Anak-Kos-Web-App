import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
} from "recharts";
import { FaPlus } from "react-icons/fa6";
import {
    Plus as PlusIconLucide,
    Edit2,
    Trash2,
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    Info,
} from "lucide-react"; // Menambah ikon Info
import FinanceModal from "../components/FinanceModal";

// Data awal transaksi (sama seperti sebelumnya)
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
    const sign = amount < 0 ? "- " : includeSign && amount > 0 ? "+ " : "";
    return (
        sign +
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Math.abs(amount))
    );
};

const Finance = () => {
    const { isloggedIn, isAuthLoading } = useSelector((state) => state.user);
    const navigate = useNavigate();

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

        const balance = transactions.reduce((acc, tx) => {
            return acc + (tx.type === "income" ? tx.amount : -tx.amount);
        }, 0);

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
        const today = new Date().toISOString().split("T")[0];
        setCurrentTransaction({
            name: "",
            amount: "",
            date: today,
            type: "expense",
        });
        setFinanceModalMode("add");
        setIsFinanceModalOpen(true);
    };

    const handleOpenEditModal = (transactionToEdit) => {
        setCurrentTransaction(transactionToEdit);
        setFinanceModalMode("edit");
        setIsFinanceModalOpen(true);
    };

    const handleSaveTransaction = (transactionDataFromModal) => {
        if (financeModalMode === "add") {
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

    const handleDeleteTransaction = () => {
        if (currentTransaction && currentTransaction.id) {
            setTransactions((prev) =>
                prev.filter((t) => t.id !== currentTransaction.id)
            );
        }
        setIsFinanceModalOpen(false);
        setCurrentTransaction(null);
    };

    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-700">
                {" "}
                Loading finance data...{" "}
            </div>
        );
    }
    if (!isloggedIn) {
        return null;
    }

    const themeChartColors = {
        income: "#22c55e", // Tailwind green-500
        expense: "#ef4444", // Tailwind red-500
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Financial Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Your personal finance tracker.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm cursor-pointer"
                    >
                        <PlusIconLucide className="w-4 h-4" /> Add Transaction
                    </button>
                </div>

                {/* Bagian Utama: Saldo dan Grafik */}
                <div className="mb-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Balance
                            </p>
                            <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                                {formatRupiah(financialStats.balance)}
                            </p>
                        </div>
                        {/* Anda bisa menambahkan tombol aksi cepat di sini jika perlu, misal "Transfer" atau "Top Up" */}
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                        Monthly Financial Flow (Last 12 Months)
                    </h2>
                    <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={monthlyChartData}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: -15,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorIncomeFinance"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={themeChartColors.income}
                                            stopOpacity={0.4}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={themeChartColors.income}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorExpenseFinance"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={themeChartColors.expense}
                                            stopOpacity={0.4}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={themeChartColors.expense}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb80"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    interval="preserveStartEnd"
                                    axisLine={{ stroke: "#e5e7eb" }}
                                    tickLine={{ stroke: "#e5e7eb" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    width={65}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                    tickLine={{ stroke: "#e5e7eb" }}
                                    tickFormatter={(value) =>
                                        `${value / 1000000}Jt`
                                    }
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        formatRupiah(value),
                                        name.charAt(0).toUpperCase() +
                                            name.slice(1),
                                    ]}
                                    labelStyle={{
                                        fontSize: 12,
                                        color: "#374151",
                                        marginBottom: "4px",
                                    }}
                                    itemStyle={{
                                        fontSize: 12,
                                        fontWeight: "bold",
                                    }}
                                    contentStyle={{
                                        backgroundColor:
                                            "rgba(255,255,255,0.95)",
                                        borderRadius: "0.5rem",
                                        borderColor: "rgba(0,0,0,0.1)",
                                        padding: "8px 12px",
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        paddingTop: "10px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke={themeChartColors.income}
                                    strokeWidth={2}
                                    fill="url(#colorIncomeFinance)"
                                    name="Income"
                                    dot={{ r: 3, strokeWidth: 1 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke={themeChartColors.expense}
                                    strokeWidth={2}
                                    fill="url(#colorExpenseFinance)"
                                    name="Expense"
                                    dot={{ r: 3, strokeWidth: 1 }}
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Kartu Statistik Bulanan yang Lebih Ringkas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <TrendingUp
                                    className="text-green-600"
                                    size={20}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">
                                    This Month's Income
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatRupiah(financialStats.monthlyIncome)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-100 rounded-lg">
                                <TrendingDown
                                    className="text-red-600"
                                    size={20}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">
                                    This Month's Expenses
                                </p>
                                <p className="text-lg font-bold text-red-600">
                                    {formatRupiah(
                                        financialStats.monthlyExpenses
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2.5 rounded-lg ${
                                    financialStats.monthlyNetFlow >= 0
                                        ? "bg-blue-100"
                                        : "bg-orange-100"
                                }`}
                            >
                                <ArrowLeftRight
                                    className={`${
                                        financialStats.monthlyNetFlow >= 0
                                            ? "text-blue-600"
                                            : "text-orange-500"
                                    }`}
                                    size={20}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">
                                    This Month's Net Flow
                                </p>
                                <p
                                    className={`text-lg font-bold ${
                                        financialStats.monthlyNetFlow >= 0
                                            ? "text-blue-600"
                                            : "text-orange-500"
                                    }`}
                                >
                                    {formatRupiah(
                                        financialStats.monthlyNetFlow,
                                        true
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Histori Transaksi */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Transaction History
                        </h2>
                        {/* Tombol Add di sini bisa dihilangkan karena sudah ada di atas */}
                    </div>
                    <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <table className="min-w-full text-left text-xs sm:text-sm">
                            <thead className="hidden sm:table-header-group">
                                <tr className="border-b border-gray-300/70">
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Transaction
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Type
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Amount
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-left">
                                        Date
                                    </th>
                                    <th className="py-3 px-4 text-gray-500 font-semibold text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="sm:divide-y sm:divide-gray-200/50">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="sm:table-row block mb-4 sm:mb-0 rounded-lg sm:rounded-none shadow-md sm:shadow-none overflow-hidden hover:bg-blue-500/5 transition-colors duration-150 ease-in-out border sm:border-0 border-gray-200/50"
                                        >
                                            <td
                                                colSpan={5}
                                                className="block sm:hidden p-4 bg-slate-50/50 sm:bg-transparent rounded-t-lg sm:rounded-none"
                                            >
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-gray-700 font-semibold text-base mr-2 break-words">
                                                            {tx.name}
                                                        </span>
                                                        <span
                                                            className={`font-semibold text-lg whitespace-nowrap ${
                                                                tx.type ===
                                                                "income"
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {tx.type ===
                                                            "income"
                                                                ? "+ "
                                                                : "- "}
                                                            {formatRupiah(
                                                                tx.amount
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>
                                                            {new Date(
                                                                tx.date
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                tx.type ===
                                                                "income"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                        >
                                                            {tx.type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                tx.type.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 mt-2 border-t border-gray-200/50 flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleOpenEditModal(
                                                                    tx
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:text-blue-800 active:bg-blue-100 rounded-md"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentTransaction(
                                                                    tx
                                                                );
                                                                handleDeleteTransaction();
                                                            }}
                                                            className="p-2 text-red-500 hover:text-red-700 active:bg-red-100 rounded-md"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell py-3.5 px-4">
                                                {" "}
                                                <span className="text-gray-700 font-medium">
                                                    {tx.name}
                                                </span>{" "}
                                            </td>
                                            <td className="hidden sm:table-cell py-3.5 px-4">
                                                {" "}
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        tx.type === "income"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {" "}
                                                    {tx.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        tx.type.slice(1)}{" "}
                                                </span>{" "}
                                            </td>
                                            <td className="hidden sm:table-cell py-3.5 px-4 text-left">
                                                {" "}
                                                <span
                                                    className={`font-semibold ${
                                                        tx.type === "income"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {" "}
                                                    {tx.type === "income"
                                                        ? "+"
                                                        : "-"}{" "}
                                                    {formatRupiah(tx.amount)}{" "}
                                                </span>{" "}
                                            </td>
                                            <td className="hidden sm:table-cell py-3.5 px-4">
                                                {" "}
                                                <span className="text-gray-500">
                                                    {new Date(
                                                        tx.date
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>{" "}
                                            </td>
                                            <td className="hidden sm:table-cell py-3.5 px-4 text-center">
                                                <div className="flex justify-center items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                tx
                                                            )
                                                        }
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentTransaction(
                                                                tx
                                                            );
                                                            handleDeleteTransaction();
                                                        }}
                                                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-10 text-gray-500"
                                        >
                                            No transactions yet. Add one to get
                                            started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button
                onClick={handleOpenAddModal}
                className="sm:hidden fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer"
                title="Add Transaction"
            >
                <FaPlus size={20} />
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
                            ? handleDeleteTransaction
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default Finance;
