import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaPlus } from "react-icons/fa6";
// Impor icon jika diperlukan, seperti di halaman Deadline
// import { Clock, Target, /* ... other icons ... */ } from "lucide-react";

const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 200 },
    { name: "Mei", value: 600 },
    { name: "Jun", value: 450 },
    { name: "Jul", value: 300 },
    { name: "Aug", value: 300 },
    { name: "Sep", value: 300 },
    { name: "Okt", value: 300 },
    { name: "Nov", value: 300 },
    { name: "Des", value: 500 },
];

const transactions = [
    {
        id: 1,
        name: "Bayar uang kos",
        amount: -800000,
        date: "August 18",
        account: "Visa 9647",
    },
    {
        id: 2,
        name: "Makan",
        amount: -50000,
        date: "June 22",
        account: "Mastercard 1122",
    },
    {
        id: 3,
        name: "Penghasilan Bulan ini",
        amount: 20000000,
        date: "May 11",
        account: "Visa 9647",
    },
];

const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);

const Finance = () => {
    const { isloggedIn, isAuthLoading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                sedang loading...
            </div>
        );
    }
    if (!isloggedIn) {
        return null;
    }

    // Warna tema untuk grafik (biru dari tombol utama)
    const themeChartColor = "#3B82F6"; // Tailwind blue-500

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Finance Overview
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track your income and expenses efficiently.
                    </p>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-4 sm:p-6">
                    <div>
                        <div className="text-gray-600 text-sm sm:text-base">
                            Your Balance
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                            {formatRupiah(25750000)} {/* Contoh Saldo */}
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -25,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorValueFinance"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={themeChartColor}
                                            stopOpacity={0.5}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={themeChartColor}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    interval="preserveStartEnd"
                                    tickFormatter={(name) => name.slice(0, 3)}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                    tickLine={{ stroke: "#e5e7eb" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    width={60}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                    tickLine={{ stroke: "#e5e7eb" }}
                                    tickFormatter={(value) =>
                                        `${
                                            formatRupiah(value)
                                                .replace("Rp", "")
                                                .replace(/\./g, "") / 1000
                                        }k`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => formatRupiah(value)}
                                    labelStyle={{
                                        fontSize: 12,
                                        color: "#374151",
                                    }}
                                    itemStyle={{
                                        fontSize: 12,
                                        color: themeChartColor,
                                        fontWeight: "bold",
                                    }}
                                    contentStyle={{
                                        backgroundColor:
                                            "rgba(255,255,255,0.9)",
                                        borderRadius: "0.5rem",
                                        borderColor: "rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={themeChartColor}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValueFinance)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Transaction History
                        </h2>
                        <button className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm cursor-pointer">
                            <FaPlus className="w-4 h-4" /> Add Transaction
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-xs sm:text-sm">
                            <thead className="hidden sm:table-header-group">
                                <tr className="border-b border-gray-200/80">
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-left">
                                        Transaction
                                    </th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-left">
                                        Amount
                                    </th>
                                    <th className="py-3 px-4 text-gray-600 font-semibold text-left">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/50">
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="sm:table-row block mb-4 sm:mb-0 rounded-lg sm:rounded-none shadow-sm sm:shadow-none overflow-hidden hover:bg-blue-500/10 transition-colors duration-150 ease-in-out"
                                    >
                                        <td
                                            colSpan={3}
                                            className="block sm:hidden p-4 bg-white/50 sm:bg-transparent rounded-t-lg sm:rounded-none"
                                        >
                                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                <div className="col-span-2 pb-2 mb-2 border-b border-gray-200/50 flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">
                                                        Transaction
                                                    </span>
                                                    <span className="text-gray-800 font-semibold text-right">
                                                        {tx.name}
                                                    </span>
                                                </div>
                                                <div className="text-gray-600 font-medium">
                                                    Amount
                                                </div>
                                                <span
                                                    className={`font-semibold text-right ${
                                                        tx.amount > 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {tx.amount > 0
                                                        ? "+ "
                                                        : "- "}
                                                    {formatRupiah(
                                                        Math.abs(tx.amount)
                                                    )}
                                                </span>
                                                <div className="text-gray-600 font-medium">
                                                    Date
                                                </div>
                                                <span className="text-gray-700 text-right">
                                                    {tx.date}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="hidden sm:table-cell py-3 px-4">
                                            <span className="text-gray-700 font-medium">
                                                {tx.name}
                                            </span>
                                        </td>
                                        <td className="hidden sm:table-cell py-3 px-4 text-left">
                                            <span
                                                className={`font-semibold ${
                                                    tx.amount > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {tx.amount > 0 ? "+" : "-"}
                                                {formatRupiah(
                                                    Math.abs(tx.amount)
                                                )}
                                            </span>
                                        </td>
                                        <td className="hidden sm:table-cell py-3 px-4">
                                            <span className="text-gray-600">
                                                {tx.date}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No transactions yet. Add one to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Floating Action Button untuk mobile */}
            <button
                className="sm:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer"
                title="Add Transaction"
            >
                <FaPlus size={20} />
            </button>
        </div>
    );
};

export default Finance;
