// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  withCredentials: true, // 🚨 Makes sure cookie is sent
});

export const getMyNotes = () => API.get("/notes/my-notes");
export const createNote = (data) => API.post("/notes/create", data);
export const deleteNote = (id) => API.delete(`/notes/delete/${id}`);
export const updateNote = (id, data) => API.put(`/notes/update/${id}`, data);
