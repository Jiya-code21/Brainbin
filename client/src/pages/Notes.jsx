import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaLightbulb,
  FaPlus,
  FaLink,
} from "react-icons/fa";
import { AppContent } from "../context/AppContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const NOTES_PER_PAGE = 6;
const statusColors = {
  "To Do": "border-yellow-400",
  "In Progress": "border-blue-400",
  Done: "border-green-400",
};

const Notes = () => {
  const { backendUrl } = useContext(AppContent);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [editNoteId, setEditNoteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    tags: "",
    subject: "",
    resourceUrl: "",
    status: "To Do",
  });

  // Fetch notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/note/all`, {
          withCredentials: true,
        });
        setNotes(res.data.notes || []);
      } catch (error) {
        console.error("Fetch notes error:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [backendUrl]);

  const resetForm = () =>
    setNoteData({
      title: "",
      content: "",
      tags: "",
      subject: "",
      resourceUrl: "",
      status: "To Do",
    });

  const handleEdit = (n) => {
    setEditNoteId(n._id);
    setNoteData({ ...n, tags: n.tags.join(", ") });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...noteData,
      tags: noteData.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      if (editNoteId) {
        const res = await axios.put(
          `${backendUrl}/api/note/update/${editNoteId}`,
          payload,
          { withCredentials: true }
        );
        setNotes((prev) =>
          prev.map((n) => (n._id === editNoteId ? res.data.note : n))
        );
      } else {
        const res = await axios.post(`${backendUrl}/api/note/create`, payload, {
          withCredentials: true,
        });
        setNotes((prev) => [res.data.note, ...prev]);
      }
      setShowModal(false);
      setEditNoteId(null);
      resetForm();
    } catch (error) {
      console.error("Save note error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendUrl}/api/note/delete/${noteToDelete}`, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Delete note error:", error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setNotes(items);
  };

  const getSubjectCounts = () => {
    const counts = {};
    notes.forEach((n) => {
      if (n.subject) counts[n.subject] = (counts[n.subject] || 0) + 1;
    });
    return counts;
  };

  const filteredNotes =
    activeTab === "all" ? notes : notes.filter((n) => n.status === activeTab);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading notes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen text-sm font-medium">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-4">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaBook /> Notes Dashboard
          </h1>
          <div className="space-y-2 mb-4">
            {["To Do", "In Progress", "Done"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`block w-full text-left px-3 py-2 rounded ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 font-bold"
                    : "hover:bg-white hover:text-indigo-600"
                }`}
              >
                {tab === "To Do"
                  ? "📝 To Do"
                  : tab === "In Progress"
                  ? "⏳ In Progress"
                  : "✅ Done"}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`block w-full text-left px-3 py-2 rounded ${
                activeTab === "all"
                  ? "bg-white text-indigo-600 font-bold"
                  : "hover:bg-white hover:text-indigo-600"
              }`}
            >
              📋 All Notes
            </button>
          </div>
          <h2 className="text-sm uppercase text-gray-200 mb-1">📚 Subjects</h2>
          <ul className="text-xs space-y-1">
            {Object.entries(getSubjectCounts()).map(([sub, count]) => (
              <li
                key={sub}
                className="flex justify-between bg-white text-indigo-700 px-2 py-1 rounded"
              >
                <span>{sub}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#f1f5f9] p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(prov) => (
                <div
                  ref={prov.innerRef}
                  {...prov.droppableProps}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedNotes.length === 0 && (
                    <p className="text-center col-span-full text-gray-500">
                      No notes found.
                    </p>
                  )}
                  {paginatedNotes.map((n, i) => (
                    <Draggable key={n._id} draggableId={n._id} index={i}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${statusColors[n.status]}`}
                        >
                          <h2 className="font-bold text-lg flex items-center gap-2 mb-1">
                            <FaLightbulb className="text-yellow-500" /> {n.title}
                          </h2>
                          <p className="text-gray-700 text-sm mb-1">{n.content}</p>
                          {n.subject && (
                            <p className="text-indigo-600 text-sm mb-2">
                              📚 {n.subject}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {n.tags?.map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          {n.resourceUrl && (
                            <a
                              href={n.resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center text-blue-600 text-sm gap-1 underline"
                            >
                              <FaLink /> Visit
                            </a>
                          )}
                          <div className="flex gap-4 mt-4">
                            <button
                              onClick={() => handleEdit(n)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Edit Note"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                setNoteToDelete(n._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Delete Note"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {prov.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({
              length: Math.ceil(filteredNotes.length / NOTES_PER_PAGE),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-indigo-600 border border-indigo-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Add Note Button */}
        <button
          onClick={() => {
            resetForm();
            setEditNoteId(null);
            setShowModal(true);
          }}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          title="Add New Note"
        >
          <FaPlus className="inline mr-2" /> Add Note
        </button>
      </div>

      {/* Add/Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {editNoteId ? "Edit Note" : "Add Note"}
            </h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={noteData.title}
                onChange={(e) =>
                  setNoteData({ ...noteData, title: e.target.value })
                }
                required
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Content:
              <textarea
                value={noteData.content}
                onChange={(e) =>
                  setNoteData({ ...noteData, content: e.target.value })
                }
                required
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Tags (comma separated):
              <input
                type="text"
                value={noteData.tags}
                onChange={(e) =>
                  setNoteData({ ...noteData, tags: e.target.value })
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Subject:
              <input
                type="text"
                value={noteData.subject}
                onChange={(e) =>
                  setNoteData({ ...noteData, subject: e.target.value })
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Resource URL:
              <input
                type="url"
                value={noteData.resourceUrl}
                onChange={(e) =>
                  setNoteData({ ...noteData, resourceUrl: e.target.value })
                }
                className="border p-2 w-full rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Status:
              <select
                value={noteData.status}
                onChange={(e) =>
                  setNoteData({ ...noteData, status: e.target.value })
                }
                className="border p-2 w-full rounded mt-1"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setEditNoteId(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {editNoteId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this note?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;
