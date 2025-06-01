import { Clock, CheckCircle2, AlertTriangle, Bell } from "lucide-react";

const DeadlineItem = ({
    event,
    onToggleComplete,
    onOpenEditModal,
    dynamicPriority,
    daysUntil,
    isEventOverdue,
    isEventDueToday,
    getPriorityColor,
}) => {
    const handleCardClick = () => {
        onOpenEditModal(event);
    };

    const handleToggleCompleteClick = (e) => {
        e.stopPropagation();
        onToggleComplete(event.id);
    };

    const isValidDate = event.end instanceof Date && !isNaN(event.end);

    return (
        <div
            key={event.id}
            className={`p-5 sm:p-6 bg-white/70 hover:bg-white/80 backdrop-blur-sm transition-all duration-200 cursor-pointer rounded-xl border border-slate-200/70 shadow-lg hover:shadow-xl ${
                event.completed ? "opacity-60" : ""
            } ${
                isEventOverdue && dynamicPriority === "penting"
                    ? "border-l-4 border-neutral-800"
                    : ""
            }`}
            onClick={handleCardClick}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <button
                    onClick={handleToggleCompleteClick}
                    className={`mt-1 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 ${
                        event.completed
                            ? "text-green-600 hover:text-green-700 focus:ring-green-400"
                            : "text-gray-400 hover:text-gray-600 focus:ring-gray-400"
                    }`}
                    aria-label={
                        event.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                    }
                >
                    <CheckCircle2 size={22} />
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1">
                            <h3
                                className={`font-semibold text-lg sm:text-xl leading-tight ${
                                    event.completed
                                        ? "line-through text-gray-500"
                                        : dynamicPriority === "penting"
                                        ? "text-neutral-800"
                                        : "text-gray-800"
                                } group-hover:text-blue-600 transition-colors`}
                            >
                                {event.title}
                            </h3>
                            {event.description && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                    {event.description}
                                </p>
                            )}
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-3">
                                {dynamicPriority && !event.completed && (
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                                            dynamicPriority
                                        )}`}
                                    >
                                        {dynamicPriority
                                            .charAt(0)
                                            .toUpperCase() +
                                            dynamicPriority.slice(1)}
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock size={13} />
                                    {isValidDate ? (
                                        <>
                                            {event.end.toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                }
                                            )}{" "}
                                            at{" "}
                                            {event.end.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </>
                                    ) : (
                                        "Invalid Date"
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs sm:text-sm text-right flex-shrink-0 space-y-1 mt-1 sm:mt-0">
                            {isEventOverdue &&
                                dynamicPriority === "penting" && (
                                    <span className="inline-flex items-center gap-1 text-neutral-700 font-medium bg-neutral-100 px-2 py-0.5 rounded">
                                        <AlertTriangle
                                            size={13}
                                            className="text-neutral-600"
                                        />{" "}
                                        Terlambat
                                    </span>
                                )}
                            {isEventDueToday &&
                                dynamicPriority !== "penting" && (
                                    <span className="inline-flex items-center gap-1 text-orange-700 font-medium bg-orange-100 px-2 py-0.5 rounded">
                                        <Bell
                                            size={13}
                                            className="text-orange-600"
                                        />{" "}
                                        Hari ini
                                    </span>
                                )}
                            {!isEventOverdue &&
                                !isEventDueToday &&
                                daysUntil > 0 &&
                                !event.completed && (
                                    <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                        {daysUntil} day
                                        {daysUntil === 1 ? "" : "s"} left
                                    </span>
                                )}
                            {event.completed && (
                                <span className="inline-flex items-center gap-1 text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded">
                                    <CheckCircle2 size={13} /> Selesai
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlineItem;
