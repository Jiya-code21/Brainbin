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
} from "react-icons/fa";
import { AppContent } from "../context/AppContext";
 
const Spinner = () => (
  <div className="w-full h-screen flex justify-center items-center bg-white">
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

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    subject: "",
    status: "To Do",
    tags: "",
    resourceUrl: "",
  });

  useEffect(() => {
    fetchNotes();

    // Add spinner CSS animation styles dynamically
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(${backendUrl}/api/note/my-notes, {
        withCredentials: true,
      });
      setNotes(res.data.notes);
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
        tags: noteData.tags.split(",").map((tag) => tag.trim()),
      };

      if (editNoteId) {
        const res = await axios.put(${backendUrl}/api/note/update/${editNoteId}, payload, {
          withCredentials: true,
        });
        setNotes((prev) =>
          prev.map((n) => (n._id === editNoteId ? res.data.note : n))
        );
      } else {
        const res = await axios.post(${backendUrl}/api/note/create, payload, {
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
      ...note,
      tags: note.tags.join(", "),
    });
    setEditNoteId(note._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(${backendUrl}/api/note/delete/${id}, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
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
      if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
      return a.status.localeCompare(b.status);
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
    activeTab === "all" ? notes : notes.filter((n) => n.status === activeTab);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  return (
    <div className="flex min-h-screen text-sm font-medium">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-4 flex flex-col justify-between">
        <div>
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
                {tab === "To Do" && "📝 To Do"}
                {tab === "In Progress" && "⏳ In Progress"}
                {tab === "Done" && "✅ Done"}
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
            {Object.entries(getSubjectCounts()).map(([sub, count], i) => (
              <li
                key={i}
                className="flex justify-between bg-white text-indigo-700 px-2 py-1 rounded"
              >
                <span>{sub}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 bg-[#f1f5f9] p-6">
        {loading ? (
          <Spinner />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(prov) => (
                <div
                  ref={prov.innerRef}
                  {...prov.droppableProps}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {paginatedNotes.map((n, i) => (
                    <Draggable key={n._id} draggableId={n._id} index={i}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${
                            statusColors[n.status] || "border-gray-300"
                          }`}
                        >
                          <h2 className="font-bold text-lg flex items-center gap-2 mb-1">
                            <FaLightbulb className="text-yellow-500" /> {n.title}
                          </h2>
                          <p className="text-gray-700 text-sm mb-1">{n.content}</p>
                          {n.subject && (
                            <p className="text-indigo-600 text-sm mb-2">
                              📘 {n.subject}
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
                      )}
                    </Draggable>
                  ))}
                  {prov.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

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

      {/* Add/Edit Note Modal */}
      <button
        onClick={() => {
          resetForm();
          setEditNoteId(null);
          setShowModal(true);
        }}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
      >
        <FaPlus className="inline mr-2" /> Add Note
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
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
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Content"
                required
                value={noteData.content}
                onChange={(e) =>
                  setNoteData({ ...noteData, content: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Subject"
                value={noteData.subject}
                onChange={(e) =>
                  setNoteData({ ...noteData, subject: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={noteData.status}
                onChange={(e) =>
                  setNoteData({ ...noteData, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="To Do">📝 To Do</option>
                <option value="In Progress">⏳ In Progress</option>
                <option value="Done">✅ Done</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={noteData.tags}
                onChange={(e) =>
                  setNoteData({ ...noteData, tags: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="url"
                placeholder="Resource Link (optional)"
                value={noteData.resourceUrl}
                onChange={(e) =>
                  setNoteData({ ...noteData, resourceUrl: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
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
          <div className="bg-white w-full max-w-sm rounded-lg p-6 relative text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(noteToDelete);
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
