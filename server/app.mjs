import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

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

app.post("/assignments", async (req, res) => {
  const { title, image, category_id, description, content, status_id } = req.body;
  const currentDate = new Date();

  if (!title || !image || !category_id || !description || !content || !status_id) {
    return res.status(400).json({
      message: "Server could not create post because there are missing data from client",
    });
  }

  try {
    await connectionPool.query(
      "INSERT INTO posts (title, image, category_id, description, content, status_id, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [ 
        title, 
        image, 
        category_id, 
        description, 
        content, 
        status_id,
        currentDate 
      ]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
  return res.status(201).json({
    message: "Created post successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
