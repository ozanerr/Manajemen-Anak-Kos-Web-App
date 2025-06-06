import { motion } from "framer-motion";

export const ProfileStatItem = ({
    IconComponent,
    label,
    value,
    valueClassName = "text-gray-900",
    variants,
}) => {
    return (
        <motion.div
            className="group flex items-center gap-4 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 cursor-pointer"
            variants={variants}
        >
            <IconComponent
                className={`h-6 w-6 text-gray-500 transition-colors group-hover:text-blue-600 ${valueClassName}`}
            />
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-lg font-semibold ${valueClassName}`}>
                    {value}
                </p>
            </div>
        </motion.div>
    );
};
