import React from "react";

const DeadlineModal = ({
  event,
  onClose,
  onDelete,
  onSave,
  onChange,
}) => {
  if (!event) return null;

  return (
    <div
      className="custom-modal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border shadow-lg rounded-lg p-4 w-80"
    >
      <h2 className="text-lg font-semibold mb-2">Edit Deadline</h2>

      <input
        name="title"
        value={event.title}
        onChange={onChange}
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="Title"
      />
      <input
        name="description"
        value={event.description}
        onChange={onChange}
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="Description"
      />
      <input
        name="end"
        type="datetime-local"
        value={event.end?.replace(" ", "T") || ""}
        onChange={(e) =>
          onChange({
            target: {
              name: "end",
              value: e.target.value.replace("T", " "),
            },
          })
        }
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeadlineModal;
