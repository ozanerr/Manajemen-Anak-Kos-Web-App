const StatCard = ({
    title,
    value,
    IconComponent,
    iconBgClass,
    iconColorClass,
}) => {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/30 shadow-xl transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p
                        className={`text-2xl sm:text-3xl font-bold ${
                            title === "Overdue" && value > 0
                                ? "text-red-600"
                                : title === "Completed" && value > 0
                                ? "text-green-600"
                                : title === "Upcoming" && value > 0
                                ? "text-yellow-600"
                                : "text-gray-900"
                        }`}
                    >
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${iconBgClass}`}>
                    <IconComponent className={iconColorClass} size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
