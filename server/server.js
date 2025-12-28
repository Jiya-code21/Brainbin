import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authroutes.js";
import userRouter from "./routes/userroutes.js";
import noteRouter from "./routes/noteroutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Allowed Frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://brainbin-frontend.onrender.com",
];

// ✅ CORS (Node 22 + Render safe)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight fix (IMPORTANT)
app.options("/*", cors());

app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

// ✅ Server start
app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${port}`);
});

