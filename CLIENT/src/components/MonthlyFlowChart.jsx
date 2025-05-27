// src/components/MonthlyFlowChart.jsx (Buat file baru atau sesuaikan path)
import React from "react";
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

// formatRupiah bisa diimpor dari file utilitas jika Anda memindahkannya
const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Math.abs(amount));

const themeChartColors = {
    income: "#22c55e", // green-500
    expense: "#ef4444", // red-500
};

const MonthlyFlowChart = ({ data }) => {
    return (
        <>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                Monthly Financial Flow (Last 12 Months)
            </h2>
            <div className="h-[250px] sm:h-[300px]">
                {" "}
                {/* Kontrol tinggi di sini */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorIncomeFinanceChart"
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
                                id="colorExpenseFinanceChart"
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
                            tickFormatter={(value) => `${value / 1000000}Jt`}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                formatRupiah(value),
                                name.charAt(0).toUpperCase() + name.slice(1),
                            ]}
                            labelStyle={{
                                fontSize: 12,
                                color: "#374151",
                                marginBottom: "4px",
                            }}
                            itemStyle={{ fontSize: 12, fontWeight: "bold" }}
                            contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
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
                            fill="url(#colorIncomeFinanceChart)"
                            name="Income"
                            dot={{ r: 3, strokeWidth: 1 }}
                            activeDot={{ r: 5 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke={themeChartColors.expense}
                            strokeWidth={2}
                            fill="url(#colorExpenseFinanceChart)"
                            name="Expense"
                            dot={{ r: 3, strokeWidth: 1 }}
                            activeDot={{ r: 5 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default MonthlyFlowChart;
