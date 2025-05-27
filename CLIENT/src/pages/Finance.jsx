import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { FaPlus } from "react-icons/fa6";

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
  { id: 1, name: "Bayar uang kos", amount: -800000, date: "August 18" },
  { id: 2, name: "Makan", amount: -50000, date: "June 22" },
  { id: 3, name: "Penghasilan Bulan ini", amount: 20000000, date: "May 11" },
];

const formatRupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const Finance = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-100 to-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow">
        <div className="text-gray-600 text-xs sm:text-sm">Your Balance</div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">{formatRupiah(1000000)}</div>

        <div className="mt-4 sm:mt-6">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                tickFormatter={name => name.slice(0, 3)}
              />
              <YAxis tick={{ fontSize: 10 }} width={50} />
              <Tooltip
                formatter={value => formatRupiah(value)}
                labelStyle={{ fontSize: 12 }}
                itemStyle={{ fontSize: 12 }}
              />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Transaction History</h2>
            <button
              className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
              title="Add Transaction"
            >
              <FaPlus />
            </button>

            <button
              className="hidden sm:inline-flex items-center bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition text-sm cursor-pointer"
            >
              Add Transaction
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-gray-600 font-medium text-left">Transaction</th>
                  <th className="py-4 px-6 text-gray-600 font-medium text-left">Amount</th>
                  <th className="py-4 px-6 text-gray-600 font-medium text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx, index) => (
                  <tr
                    key={tx.id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-150 ease-in-out sm:table-row block mb-4 sm:mb-0 rounded-lg sm:rounded-none shadow-md sm:shadow-none overflow-hidden`}
                  >
                    <td colSpan={3} className="block sm:hidden p-4">
                      <div className="grid grid-cols-2 gap-y-3 text-sm divide-y divide-gray-100">
                        <div className="col-span-2 pb-2 flex justify-between">
                          <span className="text-gray-500 font-medium">Transaction</span>
                          <span className="text-gray-800">{tx.name}</span>
                        </div>
                        <div className="col-span-2 py-2 flex justify-between">
                          <span className="text-gray-500 font-medium">Amount</span>
                          <span className={`${tx.amount > 0 ? "text-green-600" : "text-red-500"} font-semibold`}>
                            {tx.amount > 0 ? "+ " : "- "} 
                            {formatRupiah(Math.abs(tx.amount))}
                          </span>
                        </div>
                        <div className="col-span-2 pt-2 flex justify-between">
                          <span className="text-gray-500 font-medium">Date</span>
                          <span className="text-gray-800">{tx.date}</span>
                        </div>
                      </div>
                    </td>

                    <td className="hidden sm:table-cell py-4 px-6">
                      <span className="text-gray-600 font-medium">{tx.name}</span>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-6 text-left">
                      <span
                        className={`inline-flex items-center rounded-full text-sm font-semibold ${
                          tx.amount > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : "-"}
                        {formatRupiah(Math.abs(tx.amount))}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-6">
                      <span className="text-gray-600 font-medium">{tx.date}</span>
                    </td>
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
