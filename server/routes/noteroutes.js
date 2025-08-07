import express from "express";
import {
  createNote,
  getUserNotes,
  deleteNote,
  updateNote,
  toggleStarNote,
} from "../controllers/notecontroller.js";

import userAuth from "../middleware/useAuth.js";

const noteRouter = express.Router();

noteRouter.post("/create", userAuth, createNote);
noteRouter.get("/my-notes", userAuth, getUserNotes);
noteRouter.put("/update/:id", userAuth, updateNote);
noteRouter.delete("/delete/:id", userAuth, deleteNote);
noteRouter.patch("/star/:id", userAuth, toggleStarNote);

export default noteRouter;
