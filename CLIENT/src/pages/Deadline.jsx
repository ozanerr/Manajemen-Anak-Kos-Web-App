import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
    createViewMonthGrid,
    createViewWeek,
    createViewDay,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import React, { useState } from "react";

const Deadline = () => {
    const [events, setEvents] = useState([]);

    const [newEvent, setNewEvent] = useState({
        id: 1,
        title: "test 123",
        description: "test 123",
        start: "2025-04-19 03:00",
        end: "2025-04-19 03:00",
    });

    const calendar = useCalendarApp({
        views: [createViewMonthGrid()],
        events: [],
        selectedDate: "2025-04-19",
        plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
        callbacks: {
            onEventClick: (event) => {
                console.log("Event clicked:", event);
            },
            onDateClick: (date) => {
                console.log("Date clicked:", date);
            },
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addEvent = (e) => {
        e.preventDefault();

        const newId = calendar.events.getAll().length + 1;

        const updatedEvent = {
            ...newEvent,
            id: newId,
        };

        // Inject langsung ke calendar
        calendar.events.set([...calendar.events.getAll(), updatedEvent]);

        // Reset form kalau mau
        setNewEvent({
            id: newId + 1,
            title: "",
            description: "",
            start: "",
            end: "",
        });

        console.log("Updated Calendar Events:", calendar.events.getAll());
    };

    return (
        <>
            <div className="d-inline-block mx-w-50">
                <ScheduleXCalendar calendarApp={calendar} />
            </div>
            <div className="p-6 max-w-4xl mx-auto">
                <form
                    onSubmit={addEvent}
                    className="flex flex-col md:flex-row gap-4 mb-6 items-start"
                >
                    <input
                        name="title"
                        value={newEvent.title}
                        onChange={handleChange}
                        type="text"
                        placeholder="Event Title"
                        required
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <input
                        name="description"
                        value={newEvent.description}
                        onChange={handleChange}
                        type="text"
                        placeholder="Event Description"
                        required
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <input
                        name="start"
                        value={newEvent.end}
                        onChange={handleChange}
                        type="datetime-local"
                        required
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <input
                        name="end"
                        value={newEvent.end}
                        onChange={handleChange}
                        type="datetime-local"
                        required
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Add Event
                    </button>
                </form>
            </div>
        </>
    );
};

export default Deadline;
