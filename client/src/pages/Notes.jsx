import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLightbulb,
  FaLink,
} from "react-icons/fa";
 
const Spinner = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white">
    <div className="multi-color-spinner"></div>
  </div>
);

const statusOptions = [
  { value: "Concepts", label: "📝 To Do", color: "#06b6d4" },
  { value: "In Progress", label: "⏳ In Progress", color: "#facc15" },
  { value: "Done", label: "✅ Done", color: "#22c55e" },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? state.data.color
      : state.isFocused
      ? "#f3f4f6"
      : "#fff",
    color: "#000",
    fontWeight: "bold",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color,
    fontWeight: "bold",
  }),
};

const statusColors = {
  Concepts: "border-cyan-500",
  "In Progress": "border-yellow-500",
  Done: "border-green-500",
};

const NOTES_PER_PAGE = 6;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [status, setStatus] = useState("Concepts");
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("Concepts");
  const [showModal, setShowModal] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
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
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/notes/my-notes", {
        withCredentials: true,
      });
      const sorted = res.data.notes?.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setNotes(sorted || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSubject("");
    setTags("");
    setResourceUrl("");
    setStatus("Concepts");
    setEditId(null);
    setShowModal(false);
  };

  const handleAddOrUpdateNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    const noteData = {
      title,
      content,
      subject,
      tags: tags.split(",").map((t) => t.trim()),
      resourceUrl,
      status,
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:4000/api/notes/update/${editId}`,
          noteData,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:4000/api/notes/create", noteData, {
          withCredentials: true,
        });
      }
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
    setTags(note.tags.join(", "));
    setResourceUrl(note.resourceUrl);
    setStatus(note.status);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/delete/${id}`, {
        withCredentials: true,
      });
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.index === destination.index) return;
    const movedNote = notes.find((n) => n._id === draggableId);
    if (!movedNote) return;
    try {
      await axios.put(
        `http://localhost:4000/api/notes/update/${draggableId}`,
        { ...movedNote, status: activeTab },
        { withCredentials: true }
      );
      fetchNotes();
    } catch (err) {
      console.error("Drag update error:", err);
    }
  };

  const filteredNotesAll = notes.filter((n) => n.status === activeTab);
  const totalPages = Math.ceil(filteredNotesAll.length / NOTES_PER_PAGE);

  const paginatedNotes = filteredNotesAll.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  const getSubjectCounts = () => {
    return notes.reduce((acc, note) => {
      if (note.subject) acc[note.subject] = (acc[note.subject] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-br from-indigo-800 to-purple-900 text-white p-6 shadow-2xl">
        <h1
          className="text-2xl font-bold flex items-center gap-2 cursor-pointer group"
          onClick={() => setBookOpen(!bookOpen)}
        >
          <FaBook
            className={`transition-transform duration-500 group-hover:scale-110 ${
              bookOpen ? "rotate-[20deg] text-yellow-300" : "rotate-0 text-white"
            }`}
          />
          Notes Dashboard
        </h1>

        <button
          className="mt-6 bg-white text-indigo-700 px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-indigo-100"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Note
        </button>

        <div className="space-y-2 mt-6">
          {statusOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                setActiveTab(o.value);
                setCurrentPage(1); // Reset page on tab switch
              }}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === o.value
                  ? "bg-indigo-300 text-indigo-900 font-bold"
                  : "hover:bg-indigo-600"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">📘 Subjects</h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(getSubjectCounts()).map(([sub, count]) => (
              <li key={sub} className="flex justify-between">
                <span>{sub}</span>
                <span className="bg-white text-indigo-700 px-2 rounded-full">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f8fafc] p-6">
        {loading ? (
          <Spinner />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(prov) => (
                <>
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
                            className={`bg-white p-4 rounded shadow border-l-4 ${
                              statusColors[n.status] || "border-gray-300"
                            }`}
                          >
                            <h2 className="font-bold text-lg flex items-center gap-2">
                              <FaLightbulb /> {n.title}
                            </h2>
                            <p className="text-sm my-2">{n.content}</p>
                            {n.subject && (
                              <p className="text-sm text-gray-600">
                                📚 {n.subject}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 text-xs py-2">
                              {n.tags?.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
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
                                className="text-blue-600 underline flex items-center gap-1"
                              >
                                <FaLink /> Visit
                              </a>
                            )}
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleEdit(n)}
                                className="text-yellow-600 hover:text-yellow-800"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(n._id)}
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

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="col-span-full flex justify-center mt-6">
                      <ul className="flex gap-2 items-center text-sm">
                        <li>
                          <button
                            className="w-8 h-8 rounded-full border text-gray-600 hover:bg-gray-100"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            «
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-8 h-8 rounded-full border text-gray-600 hover:bg-gray-100"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            ‹
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((pageNum) => {
                            if (pageNum === 1 || pageNum === totalPages) return true;
                            if (Math.abs(currentPage - pageNum) <= 1) return true;
                            return false;
                          })
                          .map((pageNum, idx, arr) => (
                            <React.Fragment key={pageNum}>
                              {idx > 0 &&
                                pageNum - arr[idx - 1] > 1 && (
                                  <span className="px-1">...</span>
                                )}
                              <li>
                                <button
                                  className={`w-8 h-8 rounded-full border ${
                                    currentPage === pageNum
                                      ? "bg-blue-500 text-white font-bold"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </button>
                              </li>
                            </React.Fragment>
                          ))}
                        <li>
                          <button
                            className="w-8 h-8 rounded-full border text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                          >
                            ›
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-8 h-8 rounded-full border text-gray-600 hover:bg-gray-100"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            »
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Modal (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] md:w-[600px] space-y-3">
            <h2 className="text-xl font-bold mb-3">
              {editId ? "✏️ Update Note" : "➕ Add Note"}
            </h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border p-2 rounded w-full"
            />
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="border p-2 rounded w-full"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="border p-2 rounded w-full h-24"
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="border p-2 rounded w-full"
            />
            <input
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="Resource URL"
              className="border p-2 rounded w-full"
            />
            <Select
              value={statusOptions.find((o) => o.value === status)}
              onChange={(opt) => setStatus(opt.value)}
              options={statusOptions}
              styles={customStyles}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddOrUpdateNote}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                {editId ? "Update Note" : "Add Note"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
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
