import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { useState } from "react";
import DeadlineModal from "../components/DeadlineModal";
import { FiPlus } from "react-icons/fi";

const Deadline = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const { displayName, photoURL, isloggedIn, isAuthLoading } = useSelector(
        (state) => state.user
    );

    const navigate = useNavigate();

    const calendar = useCalendarApp({
        views: [createViewMonthGrid()],
        events: [],
        selectedDate: new Date().toISOString().split("T")[0],
        plugins: [createDragAndDropPlugin()],
        callbacks: {
            onEventClick: (event) => {
                setSelectedEvent(event);
                setModalMode("edit");
                setIsModalOpen(true);
            },
        },
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
                    .map((ev) =>
                        ev.id === selectedEvent.id ? selectedEvent : ev
                    )
            );
        } else {
            const id = calendar.events.getAll().length + 1;
            calendar.events.set([
                ...calendar.events.getAll(),
                { ...selectedEvent, id },
            ]);
        }
        setIsModalOpen(false);
    };

    const handleModalDelete = () => {
        calendar.events.set(
            calendar.events.getAll().filter((ev) => ev.id !== selectedEvent.id)
        );
        setIsModalOpen(false);
    };

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
                        onDelete={
                            modalMode === "edit" ? handleModalDelete : undefined
                        }
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Deadline;
