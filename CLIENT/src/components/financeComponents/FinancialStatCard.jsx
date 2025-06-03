const FinancialStatCard = ({
    title,
    value,
    formattedValue,
    IconComponent,
    iconContainerClass,
    iconClass,
    valueClass,
}) => {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                        {title}
                    </p>
                    <p
                        className={`text-xl sm:text-2xl font-bold ${
                            valueClass || "text-gray-900"
                        }`}
                    >
                        {formattedValue !== undefined ? formattedValue : value}
                    </p>
                </div>
                <div
                    className={`p-2.5 sm:p-3 rounded-lg ${iconContainerClass}`}
                >
                    <IconComponent className={iconClass} size={20} />{" "}
                </div>
            </div>
        </div>
    );
};

export default FinancialStatCard;
