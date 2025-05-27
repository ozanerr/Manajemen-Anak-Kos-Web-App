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

    if (isAuthLoading) {
        return <div>sedang loading....</div>;
    }

    if (isloggedIn != true) {
        navigate("/signin");
    }

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
            calendar.events.set(
                calendar.events
                    .getAll()
                    .map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
            );
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
        <>
            <div className="mx-auto p-6 max-w-6xl bg-white/30">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-3xl font-bold">Calendar Deadline</h3>
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
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                        aria-label="Add Deadline"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>
                <ScheduleXCalendar calendarApp={calendar} />

                {isModalOpen && (
                    <DeadlineModal
                        event={selectedEvent}
                        onChange={handleModalChange}
                        onSave={handleModalSave}
                        modalMode={modalMode}
                        onDelete={modalMode === "edit" ? handleModalDelete : undefined}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Deadline;