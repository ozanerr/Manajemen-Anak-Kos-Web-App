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

const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Math.abs(amount));

const themeChartColors = {
    income: "#22c55e",
    expense: "#ef4444",
};

const MonthlyFlowChart = ({ data }) => {
    const fontSize = window.innerWidth < 640 ? 8 : 10;
    const yAxisWidth = window.innerWidth < 640 ? 45 : 65;

    return (
        <>
            <h2
                className="text-base sm:text-xl font-semibold text-gray-700 mb-3"
                style={{ fontSize: `clamp(14px, 4vw, 16px)` }}
            >
                Arus Keuangan Bulanan (12 Bulan Terakhir)
            </h2>
            <div className="h-[200px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 5,
                        }}
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
                            tick={{ fontSize, fill: "#6b7280" }}
                            interval="preserveStartEnd"
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                            tickMargin={5}
                        />
                        <YAxis
                            tick={{ fontSize, fill: "#6b7280" }}
                            width={yAxisWidth}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={{ stroke: "#e5e7eb" }}
                            tickFormatter={(value) => `${value / 1000000}Jt`}
                            tickCount={5}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                formatRupiah(value),
                                name.charAt(0).toUpperCase() + name.slice(1),
                            ]}
                            labelStyle={{
                                fontSize: fontSize,
                                color: "#374151",
                                marginBottom: "4px",
                            }}
                            itemStyle={{
                                fontSize: fontSize,
                                fontWeight: "bold",
                            }}
                            contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
                                borderRadius: "0.5rem",
                                borderColor: "rgba(0,0,0,0.1)",
                                padding: "6px 10px",
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontSize: fontSize,
                                paddingTop: "8px",
                            }}
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke={themeChartColors.income}
                            strokeWidth={2}
                            fill="url(#colorIncomeFinanceChart)"
                            name="Pemasukan"
                            dot={{ r: 2, strokeWidth: 1 }}
                            activeDot={{ r: 4 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke={themeChartColors.expense}
                            strokeWidth={2}
                            fill="url(#colorExpenseFinanceChart)"
                            name="Pengeluaran"
                            dot={{ r: 2, strokeWidth: 1 }}
                            activeDot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default MonthlyFlowChart;
