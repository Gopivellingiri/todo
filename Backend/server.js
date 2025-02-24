import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import connectDB from "./config/db.js";
import taskRoutes from "./Routes/taskRoutes.js";

dotenv.config();
const app = express();

//Connect to mongodb
connectDB();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://todo-mernstack-reactjs.netlify.app",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
