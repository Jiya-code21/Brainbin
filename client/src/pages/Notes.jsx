import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLightbulb,
  FaLink,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { AppContent } from "../context/AppContext";

const Spinner = () => (
  <div className="w-full h-screen flex justify-center items-center bg-white dark:bg-gray-900">
    <div className="multi-color-spinner"></div>
  </div>
);

const statusColors = {
  "To Do": "border-red-400",
  "In Progress": "border-yellow-400",
  Done: "border-green-400",
};

const NOTES_PER_PAGE = 6;

const Notes = () => {
  const { backendUrl } = useContext(AppContent);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    subject: "",
    status: "To Do",
    tags: "",
    resourceUrl: "",
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchNotes();

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spinnerRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .multi-color-spinner {
        width: 64px;
        height: 64px;
        border: 6px solid transparent;
        border-top-color: #06b6d4;
        border-right-color: #3b82f6;
        border-bottom-color: #8b5cf6;
        border-left-color: #facc15;
        border-radius: 50%;
        animation: spinnerRotate 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/note/my-notes`, {
        withCredentials: true,
      });
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...noteData,
        tags: noteData.tags ? noteData.tags.split(",").map((t) => t.trim()) : [],
      };
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
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const resetForm = () => {
    setNoteData({
      title: "",
      content: "",
      subject: "",
      status: "To Do",
      tags: "",
      resourceUrl: "",
    });
  };

  const handleEdit = (note) => {
    setNoteData({
      title: note.title || "",
      content: note.content || "",
      subject: note.subject || "",
      status: note.status || "To Do",
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : note.tags || "",
      resourceUrl: note.resourceUrl || "",
    });
    setEditNoteId(note._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/note/delete/${id}`, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleStar = async (id) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/note/star/${id}`,
        {},
        { withCredentials: true }
      );
      const updated = res.data.note;
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      console.error("Toggle star error:", err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(notes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setNotes(reordered);
  };

  const handleOrganize = () => {
    const sorted = [...notes].sort((a, b) => {
      if ((a.subject || "") !== (b.subject || ""))
        return (a.subject || "").localeCompare(b.subject || "");
      return (a.status || "").localeCompare(b.status || "");
    });
    setNotes(sorted);
  };

  const getSubjectCounts = () => {
    const counts = {};
    notes.forEach((n) => {
      if (n.subject) counts[n.subject] = (counts[n.subject] || 0) + 1;
    });
    return counts;
  };

  const filteredNotes =
    activeTab === "all"
      ? notes
      : activeTab === "starred"
      ? notes.filter((n) => n.isStarred)
      : notes.filter((n) => n.status === activeTab);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  return (
    <div
      className={`flex min-h-screen text-sm font-medium ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-[#f1f5f9] text-gray-900"
      } relative`}
    >
      {/* Dark mode toggle button fixed top-right */}
<button
  onClick={() => setDarkMode((d) => !d)}
  title="Toggle Dark Mode"
  className="fixed top-4 right-4 z-50 w-14 h-14 p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center"
>
  {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
</button>

      {/* Sidebar */}
      <div
        className={`w-64 p-4 flex flex-col justify-between ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
            : "bg-gradient-to-b from-purple-600 to-indigo-700 text-white"
        }`}
      >
        <div>
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaBook /> Notes Dashboard
          </h1>

          {/* Status Filters */}
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
                {tab === "To Do" && "📝 To Do"}
                {tab === "In Progress" && "⏳ In Progress"}
                {tab === "Done" && "✅ Done"}
              </button>
            ))}

            <button
              onClick={() => {
                setActiveTab("starred");
                setCurrentPage(1);
              }}
              className={`block w-full text-left px-3 py-2 rounded ${
                activeTab === "starred"
                  ? "bg-white text-indigo-600 font-bold"
                  : "hover:bg-white hover:text-indigo-600"
              }`}
            >
              ⭐ Starred
            </button>

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

            {/* Organize Button */}
            <button
              onClick={handleOrganize}
              className="mt-3 block w-full text-left px-3 py-2 rounded hover:bg-white hover:text-indigo-600"
            >
              🔀 Organize
            </button>
          </div>

          <h2 className="text-sm uppercase text-gray-200 mb-1">📚 Subjects</h2>
          <ul className="text-xs space-y-1">
            {Object.entries(getSubjectCounts()).map(([sub, count], i) => (
              <li
                key={i}
                className={`flex justify-between px-2 py-1 rounded ${
                  darkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-indigo-700"
                }`}
              >
                <span>{sub}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 p-6">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="notes">
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.droppableProps}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {paginatedNotes.map((n, i) => (
                      <Draggable key={n._id} draggableId={String(n._id)} index={i}>
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className={`relative p-4 rounded-xl shadow-md border-l-4 ${
                              statusColors[n.status] || "border-gray-300"
                            } ${
                              darkMode
                                ? "bg-gray-800 text-gray-100"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            <h2 className="font-bold text-lg flex items-center gap-2 mb-1">
                              <FaLightbulb className="text-yellow-400" /> {n.title}
                            </h2>
                            <p className="text-sm mb-1">{n.content}</p>
                            {n.subject && (
                              <p
                                className={`text-sm mb-2 ${
                                  darkMode ? "text-indigo-300" : "text-indigo-600"
                                }`}
                              >
                                📘 {n.subject}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {n.tags?.map((t, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    darkMode
                                      ? "bg-indigo-700 text-indigo-100"
                                      : "bg-indigo-100 text-indigo-700"
                                  }`}
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
                                className={`flex items-center text-sm gap-1 underline ${
                                  darkMode ? "text-blue-300" : "text-blue-600"
                                }`}
                              >
                                <FaLink /> Visit
                              </a>
                            )}
                            <div className="flex justify-between items-center mt-4">
                              <button
                                onClick={() => toggleStar(n._id)}
                                className="text-lg"
                                title={n.isStarred ? "Unstar" : "Star this note"}
                              >
                                <span
                                  className={
                                    darkMode ? "text-yellow-300" : "text-yellow-500"
                                  }
                                >
                                  {n.isStarred ? "⭐" : "☆"}
                                </span>
                              </button>
                              <div className="flex gap-4">
                                <button
                                  onClick={() => handleEdit(n)}
                                  className={darkMode ? "text-yellow-300" : "text-yellow-600"}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => {
                                    setNoteToDelete(n._id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </div>
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

            {/* Floating Add Note button bottom-right */}
            <button
              onClick={() => {
                setShowModal(true);
                resetForm();
                setEditNoteId(null);
              }}
              title="Add Note"
              className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus size={24} />
            </button>
          </>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({
            length: Math.max(1, Math.ceil(filteredNotes.length / NOTES_PER_PAGE)),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : `${
                      darkMode
                        ? "bg-gray-800 text-gray-100 border border-gray-700"
                        : "bg-white text-indigo-600 border border-indigo-600"
                    }`
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className={`w-full max-w-md rounded-lg p-6 relative ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
                setEditNoteId(null);
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editNoteId ? "Edit Note" : "Add New Note"}
            </h2>
            <form onSubmit={handleNoteSubmit} className="space-y-3 text-sm">
              <input
                type="text"
                placeholder="Title"
                required
                value={noteData.title}
                onChange={(e) =>
                  setNoteData({ ...noteData, title: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <textarea
                placeholder="Content"
                required
                value={noteData.content}
                onChange={(e) =>
                  setNoteData({ ...noteData, content: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded h-24 resize-y ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="text"
                placeholder="Subject"
                value={noteData.subject}
                onChange={(e) =>
                  setNoteData({ ...noteData, subject: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <select
                value={noteData.status}
                onChange={(e) =>
                  setNoteData({ ...noteData, status: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={noteData.tags}
                onChange={(e) =>
                  setNoteData({ ...noteData, tags: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <input
                type="url"
                placeholder="Resource URL"
                value={noteData.resourceUrl}
                onChange={(e) =>
                  setNoteData({ ...noteData, resourceUrl: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                {editNoteId ? "Update Note" : "Add Note"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className={`w-full max-w-sm rounded-lg p-6 text-center ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <p className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this note?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  handleDelete(noteToDelete);
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="px-4 py-2 rounded border border-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
