import React, { useState, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    Filter,
    Search,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Target,
    TrendingUp,
    Grid3X3,
    List,
    Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid } from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";
import DeadlineModal from "../components/DeadlineModal";
import { FiPlus } from "react-icons/fi";

const Deadline = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [currentTime, setCurrentTime] = useState(new Date());

    const { displayName, photoURL, isloggedIn, isAuthLoading } = useSelector(
        (state) => state.user
    );

    const [viewMode, setViewMode] = useState("calendar");

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Tugas Lewat Kemarin",
            description: "Harusnya selesai kemarin.",
            start: "2025-05-26 09:00",
            end: "2025-05-26 17:00",
            completed: false,
            priority: "urgent",
        },
        {
            id: 2,
            title: "Tugas Jatuh Tempo Hari Ini (Sudah Lewat)",
            description: "Jatuh tempo beberapa jam lalu.",
            end: (() => {
                const d = new Date();
                d.setDate(d.getDate());
                d.setHours(10, 0, 0, 0);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                    2,
                    "0"
                )}-${String(d.getDate()).padStart(2, "0")} ${String(
                    d.getHours()
                ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            })(),
            start: (() => {
                const d = new Date();
                d.setDate(d.getDate());
                d.setHours(9, 0, 0, 0);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                    2,
                    "0"
                )}-${String(d.getDate()).padStart(2, "0")} ${String(
                    d.getHours()
                ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            })(),
            completed: false,
            priority: "high",
        },
        {
            id: 3,
            title: "Tugas Jatuh Tempo Nanti (Hari Ini)",
            description: "Masih ada waktu beberapa jam lagi.",
            end: (() => {
                const d = new Date();
                d.setDate(d.getDate());
                d.setHours(23, 0, 0, 0);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                    2,
                    "0"
                )}-${String(d.getDate()).padStart(2, "0")} ${String(
                    d.getHours()
                ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            })(),
            start: (() => {
                const d = new Date();
                d.setDate(d.getDate());
                d.setHours(22, 0, 0, 0);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                    2,
                    "0"
                )}-${String(d.getDate()).padStart(2, "0")} ${String(
                    d.getHours()
                ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            })(),
            completed: false,
            priority: "medium",
        },
        {
            id: 4,
            title: "Tugas Selesai (Tapi Lewat)",
            description: "Sudah selesai tapi telat.",
            end: "2025-05-26 10:00",
            start: "2025-05-26 09:00",
            completed: true,
            priority: "low",
        },
    ]);

    const calendarAppInstance = useCalendarApp({
        views: [createViewMonthGrid()],
        selectedDate: new Date().toISOString().split("T")[0],
        plugins: [createDragAndDropPlugin()],
        callbacks: {
            onEventClick: (clickedEventData) => {
                const originalEvent = events.find(
                    (e) => String(e.id) === String(clickedEventData.id)
                );
                if (originalEvent) {
                    setSelectedEvent(originalEvent);
                    setModalMode("edit");
                    setIsModalOpen(true);
                } else {
                    console.warn("Event not found in state:", clickedEventData);
                    setSelectedEvent({
                        ...clickedEventData,
                        start: clickedEventData.start
                            ? new Date(clickedEventData.start)
                                  .toISOString()
                                  .slice(0, 16)
                                  .replace("T", " ")
                            : "",
                        end: clickedEventData.end
                            ? new Date(clickedEventData.end)
                                  .toISOString()
                                  .slice(0, 16)
                                  .replace("T", " ")
                            : "",
                    });
                    setModalMode("edit");
                    setIsModalOpen(true);
                }
            },
        },
    });

    const getDynamicPriority = (event, now) => {
        if (event.completed) {
            return "completed";
        }

        const dueDate = new Date(event.end.replace(" ", "T"));

        if (dueDate < now) {
            return "urgent";
        }

        const diffTime = dueDate.getTime() - now.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);

        if (diffHours <= 24) {
            return "high";
        }
        if (diffHours <= 24 * 7) {
            return "medium";
        }

        return "low";
    };

    useEffect(() => {
        if (calendarAppInstance) {
            const formattedEvents = events.map((event) => ({
                ...event,
                id: String(event.id),
                start: event.start.includes("T")
                    ? event.start
                    : event.start.replace(" ", "T"),
                end: event.end.includes("T")
                    ? event.end
                    : event.end.replace(" ", "T"),
            }));
            calendarAppInstance.events.set(formattedEvents);
        }
    }, [events, calendarAppInstance]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent((prev) => ({
            ...prev,
            [name]: name === "end" ? value.replace("T", " ") : value,
            ...(name === "end" && { start: value.replace("T", " ") }),
        }));
    };

    const handleModalSave = (eventDataFromModal) => {
        let updatedEvents;
        if (modalMode === "edit") {
            updatedEvents = events.map((ev) =>
                String(ev.id) === String(eventDataFromModal.id)
                    ? { ...ev, ...eventDataFromModal }
                    : ev
            );
        } else {
            const newEvent = {
                ...eventDataFromModal,
                id: String(Math.max(0, ...events.map((e) => Number(e.id))) + 1),
                start: eventDataFromModal.start || eventDataFromModal.end,
                end: eventDataFromModal.end,
                completed: eventDataFromModal.completed || false,
                priority: eventDataFromModal.priority || "medium",
            };
            updatedEvents = [...events, newEvent];
        }
        setEvents(updatedEvents);
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleModalDelete = () => {
        setEvents(
            events.filter((ev) => String(ev.id) !== String(selectedEvent.id))
        );
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const toggleComplete = (id) => {
        setEvents(
            events.map((ev) =>
                String(ev.id) === String(id)
                    ? { ...ev, completed: !ev.completed }
                    : ev
            )
        );
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "bg-neutral-800 text-neutral-100 border-neutral-900";
            case "high":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            case "completed":
                return "bg-slate-100 text-slate-500 border-slate-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    const getDaysUntilDue = (dateString, now = new Date()) => {
        if (!dateString) return null;
        const dueDate = new Date(dateString.replace(" ", "T"));
        const diffTime = dueDate - now;
        if (diffTime > 0) {
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }
    };

    const getOverviewStats = React.useCallback(() => {
        const total = events.length;
        const completed = events.filter((e) => e.completed).length;

        const overdue = events.filter(
            (e) =>
                !e.completed && new Date(e.end.replace(" ", "T")) < currentTime
        ).length;

        const upcoming = events.filter((e) => {
            if (e.completed) return false;
            const dueDate = new Date(e.end.replace(" ", "T"));
            if (dueDate < currentTime) return false;

            const diffTime = dueDate - currentTime;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
        }).length;

        return { total, completed, overdue, upcoming };
    }, [events, currentTime]);

    const stats = getOverviewStats();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    if (isAuthLoading) {
        return <div>sedang loading...</div>;
    }
    if (!isloggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Deadline Manager
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Stay organized and meet your goals
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                setViewMode(
                                    viewMode === "calendar"
                                        ? "list"
                                        : "calendar"
                                )
                            }
                            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/20 cursor-pointer"
                            title={`Switch to ${
                                viewMode === "calendar" ? "list" : "calendar"
                            } view`}
                        >
                            {viewMode === "calendar" ? (
                                <List size={20} />
                            ) : (
                                <Grid3X3 size={20} />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                const now = new Date();
                                now.setMinutes(
                                    now.getMinutes() - now.getTimezoneOffset()
                                );
                                setSelectedEvent({
                                    title: "",
                                    description: "",
                                    start: now
                                        .toISOString()
                                        .slice(0, 16)
                                        .replace("T", " "),
                                    end: now
                                        .toISOString()
                                        .slice(0, 16)
                                        .replace("T", " "),
                                    completed: false,
                                    priority: "medium",
                                });
                                setModalMode("add");
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                            aria-label="Add Deadline"
                        >
                            <FiPlus size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Deadlines
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Target className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.completed}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle2
                                    className="text-green-600"
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Upcoming
                                </p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {stats.upcoming}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Overdue
                                </p>
                                <p className="text-3xl font-bold text-red-600">
                                    {stats.overdue}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertTriangle
                                    className="text-red-600"
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    {viewMode === "calendar" ? (
                        <div className="p-6 h-[600px]">
                            <ScheduleXCalendar
                                calendarApp={calendarAppInstance}
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {events.length === 0 ? (
                                <div className="text-center py-16">
                                    <Target
                                        size={64}
                                        className="mx-auto text-gray-400 mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        No deadlines found
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Create your first deadline to get
                                        started
                                    </p>
                                    <button
                                        onClick={() => {
                                            const now = new Date();
                                            now.setMinutes(
                                                now.getMinutes() -
                                                    now.getTimezoneOffset()
                                            );
                                            setSelectedEvent({
                                                title: "",
                                                description: "",
                                                start: now
                                                    .toISOString()
                                                    .slice(0, 16)
                                                    .replace("T", " "),
                                                end: now
                                                    .toISOString()
                                                    .slice(0, 16)
                                                    .replace("T", " "),
                                                completed: false,
                                                priority: "medium",
                                            });
                                            setModalMode("add");
                                            setIsModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus size={18} /> Create Your First
                                        Deadline
                                    </button>
                                </div>
                            ) : (
                                events
                                    .sort(
                                        (a, b) =>
                                            new Date(a.end.replace(" ", "T")) -
                                            new Date(b.end.replace(" ", "T"))
                                    )
                                    .map((event) => {
                                        const eventDueDate = new Date(
                                            event.end.replace(" ", "T")
                                        );
                                        const isEventOverdue =
                                            !event.completed &&
                                            eventDueDate < currentTime;

                                        const dynamicPriority =
                                            getDynamicPriority(
                                                event,
                                                currentTime
                                            );

                                        const daysUntil = getDaysUntilDue(
                                            event.end,
                                            currentTime
                                        );

                                        const isEventDueToday =
                                            !event.completed &&
                                            eventDueDate.toDateString() ===
                                                currentTime.toDateString() &&
                                            eventDueDate >= currentTime;

                                        return (
                                            <div
                                                key={event.id}
                                                className={`p-6 hover:bg-white/40 transition-all duration-200 cursor-pointer ${
                                                    event.completed
                                                        ? "opacity-60"
                                                        : ""
                                                } ${
                                                    isEventOverdue
                                                        ? "border-l-4 border-neutral-800"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setModalMode("edit");
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleComplete(
                                                                event.id
                                                            );
                                                        }}
                                                        className={`mt-1 p-1 rounded-full transition-colors ${
                                                            event.completed
                                                                ? "text-green-600 hover:text-green-700"
                                                                : "text-gray-400 hover:text-gray-600"
                                                        }`}
                                                    >
                                                        <CheckCircle2
                                                            size={20}
                                                        />
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3
                                                                    className={`font-semibold text-lg ${
                                                                        event.completed
                                                                            ? "line-through text-gray-500"
                                                                            : dynamicPriority ===
                                                                              "urgent"
                                                                            ? "text-neutral-800"
                                                                            : "text-gray-900"
                                                                    }`}
                                                                >
                                                                    {
                                                                        event.title
                                                                    }
                                                                </h3>
                                                                {event.description && (
                                                                    <p className="text-gray-600 mt-1">
                                                                        {
                                                                            event.description
                                                                        }
                                                                    </p>
                                                                )}

                                                                <div className="flex items-center gap-3 mt-3">
                                                                    {dynamicPriority && (
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                                                                                dynamicPriority
                                                                            )}`}
                                                                        >
                                                                            {dynamicPriority
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                                dynamicPriority.slice(
                                                                                    1
                                                                                )}
                                                                        </span>
                                                                    )}
                                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                        <Clock
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {new Date(
                                                                            event.end.replace(
                                                                                " ",
                                                                                "T"
                                                                            )
                                                                        ).toLocaleDateString()}{" "}
                                                                        at{" "}
                                                                        {new Date(
                                                                            event.end.replace(
                                                                                " ",
                                                                                "T"
                                                                            )
                                                                        ).toLocaleTimeString(
                                                                            [],
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                {isEventOverdue &&
                                                                    dynamicPriority ===
                                                                        "urgent" && (
                                                                        <span className="inline-flex items-center gap-1 text-neutral-700 text-sm font-medium">
                                                                            <AlertTriangle
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-neutral-700"
                                                                            />
                                                                            Overdue
                                                                        </span>
                                                                    )}
                                                                {isEventDueToday &&
                                                                    dynamicPriority !==
                                                                        "high" &&
                                                                    dynamicPriority !==
                                                                        "urgent" && (
                                                                        <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                                                                            <Bell
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            Due
                                                                            today
                                                                        </span>
                                                                    )}
                                                                {!isEventOverdue &&
                                                                    !isEventDueToday &&
                                                                    daysUntil >
                                                                        0 &&
                                                                    !event.completed &&
                                                                    dynamicPriority ===
                                                                        "low" && (
                                                                        <span className="text-gray-500 text-sm">
                                                                            {
                                                                                daysUntil
                                                                            }{" "}
                                                                            day
                                                                            {daysUntil ===
                                                                            1
                                                                                ? ""
                                                                                : "s"}{" "}
                                                                            left
                                                                        </span>
                                                                    )}
                                                                {event.completed &&
                                                                    dynamicPriority ===
                                                                        "completed" && (
                                                                        <span className="inline-flex items-center gap-1 text-slate-500 text-sm font-medium">
                                                                            <CheckCircle2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            Completed
                                                                        </span>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <DeadlineModal
                    initialEvent={selectedEvent}
                    onSave={handleModalSave}
                    modalMode={modalMode}
                    onDelete={
                        modalMode === "edit" ? handleModalDelete : undefined
                    }
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
};

export default Deadline;
