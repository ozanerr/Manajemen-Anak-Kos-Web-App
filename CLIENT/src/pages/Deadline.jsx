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
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import DeadlineModal from "../components/deadlineComponents/DeadlineModal";
import StatCard from "../components/deadlineComponents/StatCard";
import DeadlineItem from "../components/deadlineComponents/DeadlineItem";
import { FiPlus } from "react-icons/fi";
import {
    useCreateDeadlineMutation,
    useDeleteDeadlineMutation,
    useEditDeadlineMutation,
    useFetchDeadlinesQuery,
} from "../features/deadlines/deadlinesApi";

const LoadingScreen = ({ message }) => (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-slate-600 text-lg mt-4">{message}</p>
    </div>
);

const ErrorScreen = ({ message }) => (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-lg mt-4">{message}</p>
    </div>
);

const Deadline = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewMode, setViewMode] = useState("calendar");
    const [addDeadlineMutation, { isLoading: isAddingDeadline }] =
        useCreateDeadlineMutation();
    const [deleteDeadline] = useDeleteDeadlineMutation();
    const [editDeadline] = useEditDeadlineMutation();

    const { isloggedIn, isAuthLoading, uid } = useSelector(
        (state) => state.user
    );

    const {
        data: deadlinesResponse,
        isLoading: isLoadingDeadlines,
        isError: isErrorDeadlines,
        isFetching: isFetchingDeadlines,
        isUninitialized: isDeadlinesUninitialized,
    } = useFetchDeadlinesQuery(uid, {
        skip: !uid,
    });

    const processedServerData = useMemo(() => {
        if (!deadlinesResponse?.data) {
            return [];
        }
        return deadlinesResponse.data.map((event) => {
            const startVal =
                event.start instanceof Date
                    ? event.start
                    : new Date(event.start);
            const endVal =
                event.end instanceof Date ? event.end : new Date(event.end);

            return {
                ...event,
                id: String(event._id || event.id),
                start: startVal,
                end: endVal,
            };
        });
    }, [deadlinesResponse?.data]);

    const navigate = useNavigate();

    const calendarAppInstance = useCalendarApp({
        locale: "id-ID",
        views: [createViewMonthGrid()],
        selectedDate: new Date().toISOString().split("T")[0],
        plugins: [],
        callbacks: {
            onEventClick: (clickedEventData) => {
                const originalEvent = processedServerData.find(
                    (e) => String(e.id) === String(clickedEventData.id)
                );
                if (originalEvent) {
                    setSelectedEvent(originalEvent);
                    setModalMode("edit");
                    setIsModalOpen(true);
                } else {
                    console.warn(
                        "Event not found in processedServerData:",
                        clickedEventData,
                        processedServerData
                    );
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
                        priority: clickedEventData.priority || "sedang",
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
        if (!event || !event.end) return "sedang";
        if (event.completed) return "completed";
        const dueDate = event.end;
        if (dueDate < now) return "penting";
        const diffTime = dueDate.getTime() - now.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);
        if (diffHours <= 24) return "Tinggi";
        if (diffHours <= 24 * 7) return "sedang";
        return "rendah";
    }, []);

    const getPriorityColor = useCallback((priority) => {
        switch (priority) {
            case "penting":
                return "bg-neutral-800 text-neutral-100 border-neutral-900";
            case "Tinggi":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "sedang":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "rendah":
                return "bg-green-100 text-green-800 border-green-200";
            case "completed":
                return "bg-slate-100 text-slate-500 border-slate-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }, []);

    const getDaysUntilDue = useCallback((dateObject, now) => {
        if (!dateObject) return null;
        const dueDate = dateObject;
        const diffTime = dueDate.getTime() - now.getTime();
        return diffTime > 0
            ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            : Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }, []);

    const stats = useMemo(() => {
        const dataToUse = processedServerData;
        const total = dataToUse.length;
        const completed = dataToUse.filter((e) => e.completed).length;
        const overdue = dataToUse.filter(
            (e) => e.end && !e.completed && e.end < currentTime
        ).length;
        const upcoming = dataToUse.filter((e) => {
            if (!e.end || e.completed) return false;
            const dueDate = e.end;
            if (dueDate < currentTime) return false;
            const diffTime = dueDate.getTime() - currentTime.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
        }).length;
        return { total, completed, overdue, upcoming };
    }, [processedServerData, currentTime]);

    const sortedEventsForList = useMemo(
        () =>
            [...processedServerData].sort((a, b) => {
                const timeA =
                    a.end instanceof Date && !isNaN(a.end)
                        ? a.end.getTime()
                        : 0;
                const timeB =
                    b.end instanceof Date && !isNaN(b.end)
                        ? b.end.getTime()
                        : 0;
                return timeA - timeB;
            }),
        [processedServerData]
    );

    const toggleComplete = useCallback((id) => {
        console.warn(
            "Perlu implementasi UpdateDeadlineMutation untuk mengubah status 'completed' di server."
        );
    }, []);

    const handleOpenEditModal = useCallback((eventToEdit) => {
        setSelectedEvent(eventToEdit);
        setModalMode("edit");
        setIsModalOpen(true);
    }, []);

    const handleModalDelete = async (id) => {
        try {
            await deleteDeadline({ uid: uid, deadlinesId: id }).unwrap();
        } catch (error) {
            alert("gagal hapus data");
        }
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleModalSave = async (eventDataFromModal) => {
        if (modalMode === "edit") {
            try {
                await editDeadline({
                    uid: uid,
                    deadlinesId: eventDataFromModal._id,
                    data: eventDataFromModal,
                });
            } catch (error) {
                alert("error");
            }
        } else {
            const newEventDataForApi = {
                title: eventDataFromModal.title,
                description: eventDataFromModal.description,
                start: eventDataFromModal.start,
                end: eventDataFromModal.end,
                priority: eventDataFromModal.priority,
                completed: false,
            };
            try {
                await addDeadlineMutation({
                    uid: uid,
                    data: newEventDataForApi,
                }).unwrap();
            } catch (err) {
                console.error("Gagal membuat deadline:", err);
            }
        }
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleOpenAddModal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const defaultStartTime = new Date(now.getTime());
        const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);

        setSelectedEvent({
            title: "",
            description: "",
            start: defaultStartTime
                .toISOString()
                .slice(0, 16)
                .replace("T", " "),
            end: defaultEndTime.toISOString().slice(0, 16).replace("T", " "),
            completed: false,
            priority: "sedang",
        });
        setModalMode("add");
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (calendarAppInstance && processedServerData) {
            const eventsForCalendar = processedServerData.map((event) => {
                const dynamicPrio = getDynamicPriority(event, currentTime);
                const start =
                    event.start instanceof Date && !isNaN(event.start)
                        ? event.start.toISOString()
                        : "";
                const end =
                    event.end instanceof Date && !isNaN(event.end)
                        ? event.end.toISOString()
                        : "";
                return {
                    ...event,
                    start: start,
                    end: end,
                    cssClass: `event-${dynamicPrio.toLowerCase()}`,
                };
            });
            calendarAppInstance.events.set(eventsForCalendar);
        }
    }, [
        processedServerData,
        calendarAppInstance,
        currentTime,
        getDynamicPriority,
        getPriorityColor,
    ]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (!isAuthLoading && !isloggedIn && uid) {
            navigate("/signin");
        }
    }, [isAuthLoading, isloggedIn, uid, navigate]);

    if (isAuthLoading) {
        return <LoadingScreen message="Autentikasi pengguna..." />;
    }

    if (!isloggedIn || !uid) {
        useEffect(() => {
            navigate("/signin");
        }, [navigate]);
        return (
            <ErrorScreen message="Anda harus login untuk mengakses halaman ini." />
        );
    }

    if (
        isDeadlinesUninitialized ||
        isLoadingDeadlines ||
        (isFetchingDeadlines && !deadlinesResponse?.data)
    ) {
        return <LoadingScreen message="Memuat deadline Anda..." />;
    }

    if (isErrorDeadlines) {
        // return (
        //     <ErrorScreen message="Gagal memuat deadline. Coba lagi nanti." />
        // );
    }

    const priorityStyles = `
        .event-penting { background-color: #334155 !important; color: white !important; border-color: #0f172a !important; }
        .event-tinggi { background-color: #FFEDD5 !important; color: #9A3412 !important; border-color: #FED7AA !important; }
        .event-sedang { background-color: #FEF9C3 !important; color: #854D0E !important; border-color: #FEF08A !important; }
        .event-rendah { background-color: #DCFCE7 !important; color: #166534 !important; border-color: #BBF7D0 !important; }
        .event-completed { background-color: #F1F5F9 !important; color: #64748B !important; border-color: #E2E8F0 !important; }
    `;

    return (
        <>
            <style>{priorityStyles}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-5 flex sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent sm:py-1">
                            Manager Deadline
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Tetap terorganisir dan capai tujuan Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 sm:w-auto justify-end">
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
                            disabled={isAddingDeadline}
                            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 sm:p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
                            aria-label="Add Deadline"
                        >
                            <FiPlus size={20} />
                            <span className="text-base font-medium">
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
                            {calendarAppInstance && (
                                <ScheduleXCalendar
                                    calendarApp={calendarAppInstance}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200/70">
                            {sortedEventsForList.length === 0 ? (
                                <div className="text-center py-16 sm:py-20 px-6">
                                    <Target
                                        size={56}
                                        className="mx-auto text-slate-400 mb-5"
                                    />
                                    <h3 className="text-2xl font-semibold text-slate-700 mb-3">
                                        Tidak ada deadline ditemukan
                                    </h3>
                                    <p className="text-slate-500 mb-8">
                                        Buat deadline pertama Anda untuk
                                        memulai.
                                    </p>
                                    <button
                                        onClick={handleOpenAddModal}
                                        disabled={isAddingDeadline}
                                        className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-base font-medium disabled:opacity-50 cursor-pointer"
                                    >
                                        Buat Deadline Pertama
                                    </button>
                                </div>
                            ) : (
                                sortedEventsForList.map((event) => {
                                    const daysUntil = getDaysUntilDue(
                                        event.end,
                                        currentTime
                                    );
                                    const eventDueDate = event.end;

                                    const isEventOverdue =
                                        eventDueDate &&
                                        !event.completed &&
                                        eventDueDate < currentTime;
                                    const isEventDueToday =
                                        eventDueDate &&
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
                                            onToggleComplete={handleModalDelete}
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

            <button
                onClick={handleOpenAddModal}
                disabled={isAddingDeadline}
                className="sm:hidden fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-xl flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
                title="Tambah Transaksi"
            >
                <FaPlus size={24} />
            </button>

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
                    isLoading={isAddingDeadline}
                />
            )}
        </>
    );
};

export default Deadline;
