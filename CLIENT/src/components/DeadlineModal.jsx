import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modal = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9 },
};

const DeadlineModal = ({
    event,
    modalMode,
    onClose,
    onDelete,
    onSave,
    onChange,
}) => {
    if (!event) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 backdrop-blur-m bg-black/30 z-40 flex items-center justify-center"
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl overflow-y-auto z-50"
                    variants={modal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                        aria-label="Close Modal"
                    >
                        <FiX size={20} />
                    </button>

                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        {modalMode === "edit"
                            ? "Edit Calendar"
                            : "Add Calendar"}
                    </h2>

                    <div className="space-y-3">
                        <input
                            name="title"
                            value={event.title}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Title"
                            required
                        />
                        <input
                            name="description"
                            value={event.description}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Description"
                        />
                        <input
                            name="end"
                            type="datetime-local"
                            value={event.end?.replace(" ", "T") || ""}
                            required
                            onChange={(e) =>
                                onChange({
                                    target: {
                                        name: "end",
                                        value: e.target.value.replace("T", " "),
                                    },
                                })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        {onDelete && (
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            onClick={onSave}
                        >
                            {modalMode === "edit" ? "Save" : "Add"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeadlineModal;
