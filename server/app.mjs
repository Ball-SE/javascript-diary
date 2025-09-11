import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes.mjs";
import assignmentsRoutes from "./routes/assignmentsRoutes.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);
app.use("/assignments", assignmentsRoutes);

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/profiles", (req, res) => {
  return res.json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
