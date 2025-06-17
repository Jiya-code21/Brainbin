import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaEdit, FaTrash, FaBook, FaLink, FaTags, FaLightbulb } from "react-icons/fa";

const statusColors = {
  Concepts: "border-cyan-500",
  "In Progress": "border-yellow-500",
  Done: "border-green-500",
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [status, setStatus] = useState("Concepts");
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("Concepts");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/notes/my-notes", {
        withCredentials: true,
      });
      const sorted = res.data.notes?.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setNotes(sorted || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

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
        await axios.put(`http://localhost:4000/api/notes/update/${editId}`, noteData, {
          withCredentials: true,
        });
        setEditId(null);
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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSubject("");
    setTags("");
    setResourceUrl("");
    setStatus("Concepts");
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
    setTags(note.tags.join(", "));
    setResourceUrl(note.resourceUrl);
    setStatus(note.status);
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

    const movedNote = notes.find((note) => note._id === draggableId);
    if (!movedNote) return;

    try {
      await axios.put(
        `http://localhost:4000/api/notes/update/${draggableId}`,
        { ...movedNote, status: activeTab },
        { withCredentials: true }
      );
      fetchNotes();
    } catch (err) {
      console.error("Error updating note on drag:", err);
    }
  };

  const filteredNotes = notes.filter((note) => note.status === activeTab);

  return (
    <div className="bg-[#f7f9fb] min-h-screen px-6 py-8 text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black-700 flex items-center gap-2">
          <FaBook className="text-black-500" /> Notes Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Concepts", "In Progress", "Done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-semibold shadow-sm ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Note Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border rounded"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="p-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="col-span-2 p-2 border rounded h-24"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="p-2 border rounded"
        />
        <input
          value={resourceUrl}
          onChange={(e) => setResourceUrl(e.target.value)}
          placeholder="Resource URL"
          className="p-2 border rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Concepts</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button
          onClick={handleAddOrUpdateNote}
          className={`col-span-2 py-2 font-bold text-white rounded ${
            editId ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {editId ? "✏️ Update Note" : "➕ Add Note"}
        </button>
      </div>

      {/* Notes Cards Grid (4 Cards Per Row) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredNotes.map((note, index) => (
                <Draggable key={note._id} draggableId={note._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border-l-4 ${statusColors[note.status] || "border-gray-300"} p-4 rounded-lg shadow bg-white w-full max-w-sm`}
                    >
                      <h2 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                        <FaLightbulb /> {note.title}
                      </h2>
                      <p className="text-sm mt-1">{note.content}</p>

                      {note.subject && (
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          📚 Subject: {note.subject}
                        </p>
                      )}

                      {note.tags?.length > 0 && (
                        <p className="mt-1 text-sm flex flex-wrap gap-1 items-center text-gray-700">
                          <FaTags className="text-sm" />{" "}
                          {note.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </p>
                      )}

                      {note.resourceUrl && (
                        <a
                          href={note.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-blue-500 underline text-sm flex items-center gap-1"
                        >
                          <FaLink /> Resource Link
                        </a>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(note)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Notes;
