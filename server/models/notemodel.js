import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
      },
    ],
    resourceUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Concepts",
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const noteModel = mongoose.models.note || mongoose.model("note", noteSchema);
export default noteModel;
