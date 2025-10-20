import { Router } from "express";
import { postValidations } from "../middlewares/postValidations.mjs";
import { createClient } from "@supabase/supabase-js";

// เชื่อมต่อ Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const assignmentsRoutes = Router();

assignmentsRoutes.post("/", [postValidations], async (req, res) => {
    const { title, image, category_id, description, content, status_id } = req.body;
    const currentDate = new Date();
  
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: title,
            image: image,
            category_id: category_id,
            description: description,
            content: content,
            status_id: status_id,
            date: currentDate
          }
        ])
        .select();

      if (error) throw error;

      return res.status(201).json({
        message: "Created post successfully",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({
        message: "Server could not create post because database connection",
        error: error.message
      });
    }
});

export default assignmentsRoutes;