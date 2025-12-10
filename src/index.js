import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("ATS Backend Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
