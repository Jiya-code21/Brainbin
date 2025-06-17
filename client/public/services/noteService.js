import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const createNote = (noteData, token) =>
  API.post("/notes/create", noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getNotes = (subject, status, page, token) =>
  API.get(`/notes?subject=${subject}&status=${status}&page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateNoteStatus = (id, newStatus, token) =>
  API.put(
    `/notes/status/${id}`,
    { status: newStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
