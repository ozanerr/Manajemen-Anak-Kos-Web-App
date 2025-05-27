import React, { useState, useEffect } from "react";
import {
    Calendar,
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
    Settings
} from "lucide-react";
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
    const [viewMode, setViewMode] = useState("calendar");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Project Proposal Deadline",
            description: "Submit final project proposal to stakeholders",
            start: "2025-05-26 09:00",
            end: "2025-05-26 10:00",
            priority: "high",
            completed: false,
        },
        {
            id: 2,
            title: "Client Presentation",
            description: "Present quarterly results to key clients",
            start: "2025-05-26 09:00",
            end: "2025-05-26 10:00",
            priority: "urgent",
            completed: false,
        },
        {
            id: 3,
            title: "Team Review Meeting",
            description: "Monthly team performance review",
            start: "2025-05-26 09:00",
            end: "2025-05-26 10:00",
            priority: "medium",
            completed: true,
        },
    ]);

    const calendar = useCalendarApp({
        views: [createViewMonthGrid()],
        events,
        selectedDate: new Date().toISOString().split("T")[0],
        plugins: [createDragAndDropPlugin()],
        callbacks: {
            onEventClick: (ev) => {
                setSelectedEvent(ev);
                setModalMode("edit");
                setIsModalOpen(true);
            }
        }
    });

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent((prev) => ({
            ...prev,
            [name]: name === "end" ? value.replace("T", " ") : value,
            ...(name === "end" && { start: value.replace("T", " ") }),
        }));
    };

    const handleModalSave = () => {
        if (modalMode === "edit") {
            setEvents(events.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev)));
        } else {
            const newEvent = {
                ...selectedEvent,
                id: Date.now(),
                priority: selectedEvent.priority || "medium",
                completed: false,
            };
            setEvents([...events, newEvent]);
        }
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleModalDelete = () => {
        setEvents(events.filter((ev) => ev.id !== selectedEvent.id));
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const toggleComplete = (id) => {
        setEvents(events.map(ev =>
            ev.id === id ? { ...ev, completed: !ev.completed } : ev
        ));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent": return "bg-red-100 text-red-800 border-red-200";
            case "high": return "bg-orange-100 text-orange-800 border-orange-200";
            case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getDaysUntilDue = (dateString) => {
        const dueDate = new Date(dateString.replace(" ", "T"));
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getOverviewStats = () => {
        const total = events.length;
        const completed = events.filter(e => e.completed).length;
        const overdue = events.filter(e => !e.completed && getDaysUntilDue(e.end) < 0).length;
        const upcoming = events.filter(e => !e.completed && getDaysUntilDue(e.end) >= 0 && getDaysUntilDue(e.end) <= 7).length;

        return { total, completed, overdue, upcoming };
    };

    const stats = getOverviewStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Deadline Manager
                        </h1>
                        <p className="text-gray-600 mt-1">Stay organized and meet your goals</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
                            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/20 cursor-pointer"
                            title={`Switch to ${viewMode === "calendar" ? "list" : "calendar"} view`}
                        >
                            {viewMode === "calendar" ? <List size={20} /> : <Grid3X3 size={20} />}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedEvent({
                                    title: "",
                                    description: "",
                                    start: "",
                                    end: "",
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
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Deadlines</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Target className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle2 className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.upcoming}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Main Content */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    {viewMode === "calendar" ? (
                        <div className="p-6 h-[600px]">
                            <ScheduleXCalendar calendarApp={calendar} />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {events.length === 0 ? (
                                <div className="text-center py-16">
                                    <Target size={64} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No deadlines found</h3>
                                    <p className="text-gray-500 mb-6">Create your first deadline to get started</p>
                                    <button
                                        onClick={() => {
                                            setSelectedEvent({
                                                title: "",
                                                description: "",
                                                end: "",
                                            });
                                            setModalMode("add");
                                            setIsModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus size={18} />
                                        Create Your First Deadline
                                    </button>
                                </div>
                            ) : (
                                events
                                    .sort((a, b) => new Date(a.end.replace(" ", "T")) - new Date(b.end.replace(" ", "T")))
                                    .map((event) => {
                                        const daysUntil = getDaysUntilDue(event.end);
                                        const isOverdue = daysUntil < 0 && !event.completed;
                                        const isDueToday = daysUntil === 0 && !event.completed;

                                        return (
                                            <div
                                                key={event.id}
                                                className={`p-6 hover:bg-white/40 transition-all duration-200 cursor-pointer ${event.completed ? "opacity-60" : ""
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
                                                            toggleComplete(event.id);
                                                        }}
                                                        className={`mt-1 p-1 rounded-full transition-colors ${event.completed
                                                            ? "text-green-600 hover:text-green-700"
                                                            : "text-gray-400 hover:text-gray-600"
                                                            }`}
                                                    >
                                                        <CheckCircle2 size={20} />
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3 className={`font-semibold text-lg ${event.completed ? "line-through text-gray-500" : "text-gray-900"
                                                                    }`}>
                                                                    {event.title}
                                                                </h3>
                                                                {event.description && (
                                                                    <p className="text-gray-600 mt-1">{event.description}</p>
                                                                )}

                                                                <div className="flex items-center gap-3 mt-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                                                                        {event.priority?.charAt(0).toUpperCase() + event.priority?.slice(1)}
                                                                    </span>

                                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                        <Clock size={14} />
                                                                        {new Date(event.end.replace(" ", "T")).toLocaleDateString()} at{" "}
                                                                        {new Date(event.end.replace(" ", "T")).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                {isOverdue && (
                                                                    <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                                                                        <AlertTriangle size={14} />
                                                                        {Math.abs(daysUntil)} day{Math.abs(daysUntil) === 1 ? "" : "s"} overdue
                                                                    </span>
                                                                )}
                                                                {isDueToday && (
                                                                    <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                                                                        <Bell size={14} />
                                                                        Due today
                                                                    </span>
                                                                )}
                                                                {daysUntil > 0 && (
                                                                    <span className="text-gray-500 text-sm">
                                                                        {daysUntil} day{daysUntil === 1 ? "" : "s"} left
                                                                    </span>
                                                                )}
                                                                {event.completed && (
                                                                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                                                        <CheckCircle2 size={14} />
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


            {/* Modal */}
            {isModalOpen && (
                <DeadlineModal
                    event={selectedEvent}
                    onChange={handleModalChange}
                    onSave={handleModalSave}
                    modalMode={modalMode}
                    onDelete={modalMode === "edit" ? handleModalDelete : undefined}
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