
import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.mjs";
import assignmentsRoutes from "./routes/assignmentsRoutes.mjs";
import authRoutes from "./routes/auth.mjs";

const app = express();
const port = process.env.PORT || 4001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' })); // ลดจาก 10mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use("/posts", postRoutes);
app.use("/assignments", assignmentsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    port: port 
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
