// src/Deadline.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Target,
    Grid3X3,
    List,
    Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid } from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";
import DeadlineModal from "../components/DeadlineModal";
import StatCard from "../components/StatCard";
import DeadlineItem from "../components/DeadlineItem";
import { FiPlus } from "react-icons/fi";

const Deadline = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [currentTime, setCurrentTime] = useState(new Date());
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

    const { isloggedIn, isAuthLoading } = useSelector((state) => state.user);
    const navigate = useNavigate();
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
                    const fallbackEvent = {
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
                        completed: clickedEventData.completed || false,
                        priority: clickedEventData.priority || "medium",
                        description: clickedEventData.description || "",
                    };
                    setSelectedEvent(fallbackEvent);
                    setModalMode("edit");
                    setIsModalOpen(true);
                }
            },
        },
    });

    const getDynamicPriority = useCallback((event, now) => {
        if (event.completed) return "completed";
        const dueDate = new Date(event.end.replace(" ", "T"));
        if (dueDate < now) return "urgent";
        const diffTime = dueDate.getTime() - now.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);
        if (diffHours <= 24) return "high";
        if (diffHours <= 24 * 7) return "medium";
        return "low";
    }, []);

    const getPriorityColor = useCallback((priority) => {
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
    }, []);

    const getDaysUntilDue = useCallback((dateString, now) => {
        if (!dateString) return null;
        const dueDate = new Date(dateString.replace(" ", "T"));
        const diffTime = dueDate - now;
        return diffTime > 0
            ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            : Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }, []);

    const stats = useMemo(() => {
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

    const toggleComplete = useCallback((id) => {
        setEvents((currentEvents) =>
            currentEvents.map((ev) =>
                String(ev.id) === String(id)
                    ? { ...ev, completed: !ev.completed }
                    : ev
            )
        );
    }, []);

    const handleOpenEditModal = useCallback((eventToEdit) => {
        setSelectedEvent(eventToEdit);
        setModalMode("edit");
        setIsModalOpen(true);
    }, []);

    const sortedEvents = useMemo(
        () =>
            [...events].sort(
                (a, b) =>
                    new Date(a.end.replace(" ", "T")) -
                    new Date(b.end.replace(" ", "T"))
            ),
        [events]
    );

    useEffect(() => {
        if (calendarAppInstance) {
            const formattedEvents = events.map((event) => {
                const dynamicPrio = getDynamicPriority(event, currentTime);
                let calendarName = event.completed ? "completed" : dynamicPrio;
                return {
                    ...event,
                    id: String(event.id),
                    start: event.start.includes("T")
                        ? event.start
                        : event.start.replace(" ", "T"),
                    end: event.end.includes("T")
                        ? event.end
                        : event.end.replace(" ", "T"),
                    calendar: calendarName,
                };
            });
            calendarAppInstance.events.set(formattedEvents);
        }
    }, [events, calendarAppInstance, currentTime, getDynamicPriority]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Setiap 1 menit
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, navigate]);

    const handleModalSave = (eventDataFromModal) => {
        let updatedEvents;
        if (modalMode === "edit") {
            updatedEvents = events.map((ev) =>
                String(ev.id) === String(eventDataFromModal.id)
                    ? { ...eventDataFromModal }
                    : ev
            );
        } else {
            const newEvent = {
                ...eventDataFromModal,
                id: String(Date.now()),
                completed: false,
            };
            updatedEvents = [...events, newEvent];
        }
        setEvents(updatedEvents);
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleModalDelete = () => {
        if (selectedEvent && selectedEvent.id) {
            setEvents(
                events.filter(
                    (ev) => String(ev.id) !== String(selectedEvent.id)
                )
            );
        }
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleOpenAddModal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);

        setSelectedEvent({
            title: "",
            description: "",
            start: now.toISOString().slice(0, 16).replace("T", " "),
            end: defaultEndTime.toISOString().slice(0, 16).replace("T", " "),
            completed: false,
            priority: "medium",
        });
        setModalMode("add");
        setIsModalOpen(true);
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-600 text-lg mt-4">
                    Memuat deadline Anda...
                </p>
            </div>
        );
    }
    if (!isloggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Manager Deadline
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Tetap terorganisir dan capai tujuan Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={() =>
                                setViewMode(
                                    viewMode === "calendar"
                                        ? "list"
                                        : "calendar"
                                )
                            }
                            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/30 shadow-sm cursor-pointer"
                            title={`Switch to ${
                                viewMode === "calendar" ? "list" : "calendar"
                            } view`}
                        >
                            {viewMode === "calendar" ? (
                                <List size={20} />
                            ) : (
                                <CalendarIcon size={20} />
                            )}
                        </button>
                        <button
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 sm:p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                            aria-label="Add Deadline"
                        >
                            <FiPlus size={20} />{" "}
                            <span className="hidden sm:inline text-sm font-medium">
                                Tambah Deadline
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <StatCard
                        title="Total Deadlines"
                        value={stats.total}
                        IconComponent={Target}
                        iconBgClass="bg-blue-100"
                        iconColorClass="text-blue-600"
                    />
                    <StatCard
                        title="Selesai"
                        value={stats.completed}
                        IconComponent={CheckCircle2}
                        iconBgClass="bg-green-100"
                        iconColorClass="text-green-600"
                    />
                    <StatCard
                        title="Mendatang"
                        value={stats.upcoming}
                        IconComponent={Clock}
                        iconBgClass="bg-yellow-100"
                        iconColorClass="text-yellow-600"
                    />
                    <StatCard
                        title="Terlambat"
                        value={stats.overdue}
                        IconComponent={AlertTriangle}
                        iconBgClass="bg-red-100"
                        iconColorClass="text-red-600"
                    />
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden">
                    {viewMode === "calendar" ? (
                        <div className="p-3 sm:p-4 md:p-6 min-h-[600px]">
                            <ScheduleXCalendar
                                calendarApp={calendarAppInstance}
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200/70">
                            {sortedEvents.length === 0 ? (
                                <div className="text-center py-16 sm:py-20 px-6">
                                    <Target
                                        size={56}
                                        className="mx-auto text-slate-400 mb-5"
                                    />
                                    <h3 className="text-2xl font-semibold text-slate-700 mb-3">
                                        Tidak ada deadline ditemukan
                                    </h3>
                                    <p className="text-slate-500 mb-8">
                                        Buat deadline pertama Anda untuk memulai.
                                    </p>
                                    <button
                                        onClick={handleOpenAddModal}
                                        className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-base font-medium"
                                    >
                                        <PlusIconLucide size={18} /> Buat Deadline Pertama
                                    </button>
                                </div>
                            ) : (
                                sortedEvents.map((event) => {
                                    const daysUntil = getDaysUntilDue(
                                        event.end,
                                        currentTime
                                    );
                                    const eventDueDate = new Date(
                                        event.end.replace(" ", "T")
                                    );
                                    const isEventOverdue =
                                        !event.completed &&
                                        eventDueDate < currentTime;
                                    const isEventDueToday =
                                        !event.completed &&
                                        eventDueDate.toDateString() ===
                                            currentTime.toDateString() &&
                                        eventDueDate >= currentTime;
                                    const dynamicPrio = getDynamicPriority(
                                        event,
                                        currentTime
                                    );

                                    return (
                                        <DeadlineItem
                                            key={event.id}
                                            event={event}
                                            onToggleComplete={toggleComplete}
                                            onOpenEditModal={
                                                handleOpenEditModal
                                            }
                                            dynamicPriority={dynamicPrio}
                                            daysUntil={daysUntil}
                                            isEventOverdue={isEventOverdue}
                                            isEventDueToday={isEventDueToday}
                                            getPriorityColor={getPriorityColor}
                                        />
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
