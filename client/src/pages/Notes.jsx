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
        const res = await axios.put(`${backendUrl}/api/note/update/${editNoteId}`, payload, {
          withCredentials: true,
        });
        setNotes((prev) => prev.map((n) => (n._id === editNoteId ? res.data.note : n)));
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
    setNoteData({ ...note, tags: note.tags.join(", ") });
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(notes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setNotes(reordered);
  };

  const getSubjectCounts = () => {
    const counts = {};
    notes.forEach((n) => {
      if (n.subject) counts[n.subject] = (counts[n.subject] || 0) + 1;
    });
    return counts;
  };

  const filteredNotes = activeTab === "all" ? notes : notes.filter((n) => n.status === activeTab);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE);

  return (
    <div className="flex min-h-screen text-sm font-medium">
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
          {Object.entries(getSubjectCounts()).map(([sub, count]) => (
            <li key={sub} className="flex justify-between bg-white text-indigo-700 px-2 py-1 rounded">
              <span>{sub}</span>
              <span className="font-bold">{count}</span>
            </li>
          ))}
        </ul>
      </div>

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
                          className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${statusColors[n.status]}`}
                        >
                          <h2 className="font-bold text-lg flex items-center gap-2 mb-1">
                            <FaLightbulb className="text-yellow-500" /> {n.title}
                          </h2>
                          <p className="text-gray-700 text-sm mb-1">{n.content}</p>
                          {n.subject && (
                            <p className="text-indigo-600 text-sm mb-2">📘 {n.subject}</p>
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
                            <button onClick={() => handleEdit(n)} className="text-yellow-600 hover:text-yellow-800">
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
    </div>
  );
};

export default Notes;
