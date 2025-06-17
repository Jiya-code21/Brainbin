import noteModel from "../models/notemodel.js";

// ✅ Create Note
export const createNote = async (req, res) => {
  const { title, content, subject, tags, resourceUrl, status } = req.body;
  const userId = req.userId;

  try {
    const note = new noteModel({
      title,
      content,
      subject,
      tags,
      resourceUrl,
      status,
      user: userId,
    });

    await note.save();

    res.json({ success: true, message: "Note created", note });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Notes of Logged-in User
export const getUserNotes = async (req, res) => {
  const userId = req.userId;

  try {
    const notes = await noteModel.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Note by ID
export const updateNote = async (req, res) => {
  const { title, content, subject, tags, resourceUrl, status } = req.body;

  try {
    const note = await noteModel.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, content, subject, tags, resourceUrl, status },
      { new: true }
    );

    if (!note) {
      return res.json({
        success: false,
        message: "Note not found or unauthorized",
      });
    }

    res.json({ success: true, message: "Note updated", note });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Note by ID
export const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.json({
        success: false,
        message: "Note not found or unauthorized",
      });
    }

    res.json({ success: true, message: "Note deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
