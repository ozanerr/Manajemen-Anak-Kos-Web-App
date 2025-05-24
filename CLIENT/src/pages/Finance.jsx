import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

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

    if (isAuthLoading) {
        return <div>sedang loading...</div>;
    }

    if (isloggedIn != true) {
        navigate("/signin");
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
                <div className="text-gray-600 text-sm">Your Balance</div>
                <div className="text-3xl font-bold text-gray-800">
                    {formatRupiah(1000000)}
                </div>

                <div className="mt-6">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient
                                    id="colorValue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#8884d8"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#8884d8"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold mb-4">
                            Transaction History
                        </h2>
                        <button className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 cursor-pointer text-sm">
                            Add Transaction
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-separate border-spacing-y-4 text-sm">
                            <thead>
                                <tr className="text-gray-500 text-sm">
                                    <th>Transaction</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="bg-white shadow-sm rounded-md"
                                    >
                                        <td className="py-2">{tx.name}</td>
                                        <td
                                            className={`py-2  ${
                                                tx.amount > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {tx.amount > 0 ? "+" : "-"}
                                            {formatRupiah(Math.abs(tx.amount))}
                                        </td>
                                        <td className="py-2">{tx.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;
