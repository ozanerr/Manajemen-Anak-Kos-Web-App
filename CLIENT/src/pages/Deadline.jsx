import {
  useCalendarApp, ScheduleXCalendar
} from "@schedule-x/react";
import { createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { useState } from "react";
import DeadlineModal from "../components/DeadlineModal";

const Deadline = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendar = useCalendarApp({
    views: [createViewMonthGrid()],
    events: [],
    selectedDate: new Date().toISOString().split("T")[0],
    plugins: [createDragAndDropPlugin()],
    callbacks: {
      onEventClick: (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
      },
      onDateClick: (date) => {
        console.log("Date clicked:", date);
      },
    },
  });

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: name === "end" ? value.replace("T", " ") : value,
      ...(name === "end" && { start: value.replace("T", " ") }),
    }));
  };

  const addEvent = (e) => {
    e.preventDefault();
    const id = calendar.events.getAll().length + 1;
    const eventToAdd = { ...newEvent, id };
    calendar.events.set([...calendar.events.getAll(), eventToAdd]);

    setNewEvent({ title: "", description: "", start: "", end: "" });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev, [name]: name === "end" ? value.replace("T", " ") : value,
      ...(name === "end" && { start: value.replace("T", " ") }),
    }));
  };

  const handleModalSave = () => {
    calendar.events.set(
      calendar.events.getAll().map((ev) =>
        ev.id === selectedEvent.id ? selectedEvent : ev
      )
    );
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
      <h3 className="text-3xl font-bold text-center mb-6 mt-4">
        Calendar Deadline
      </h3>
      <div className="relative">
        <div className="mx-auto p-6 max-w-4xl">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>

        {isModalOpen && (
          <DeadlineModal
            event={selectedEvent}
            onChange={handleModalChange}
            onSave={handleModalSave}
            onDelete={handleModalDelete}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <div className="my-4 border-t border-gray-300" />

      <h3 className="text-3xl font-bold text-center mb-2 mt-10">
        Add Deadline
      </h3>

      <div className="p-6 max-w-4xl mx-auto">
        <form
          onSubmit={addEvent}
          className="flex flex-col md:flex-row gap-4 mb-6 items-start"
        >
          <input
            name="title"
            value={newEvent.title}
            onChange={handleNewChange}
            type="text"
            placeholder="Deadline Title"
            required
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            name="description"
            value={newEvent.description}
            onChange={handleNewChange}
            type="text"
            placeholder="Deadline Description"
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            name="end"
            value={newEvent.end}
            onChange={handleNewChange}
            type="datetime-local"
            required
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default Deadline;
