import { Router } from "express";
import { postValidations } from "../middlewares/postValidations.mjs";
import connectionPool from "../utils/db.mjs";

const assignmentsRoutes = Router();

assignmentsRoutes.post("/", [postValidations], async (req, res) => {
    const { title, image, category_id, description, content, status_id } = req.body;
    const currentDate = new Date();
  
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

export default assignmentsRoutes;