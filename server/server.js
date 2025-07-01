import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroutes.js";
import userRouter from "./routes/userroutes.js";
import noteRouter from "./routes/noteroutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect MongoDB
connectDB();

// ✅ Allow both local and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://brainbin-frontend.onrender.com'
];

// ✅ CORS setup (mobile + secure compatible)
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => res.send("API Working"));

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

// ✅ Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
