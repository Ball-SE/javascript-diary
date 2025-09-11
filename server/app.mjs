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

app.get("/posts", async (req, res) => {
  // ลอจิกในอ่านข้อมูลโพสต์ทั้งหมดในระบบ
  try {
    // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
    const category = req.query.category || "";
    const keyword = req.query.keyword || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    // 2) ทำให้แน่ใจว่า query parameter page และ limit จะมีค่าอย่างต่ำเป็น 1
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;
    // offset คือค่าที่ใช้ในการข้ามจำนวนข้อมูลบางส่วนตอน query ข้อมูลจาก database
    // ถ้า page = 2 และ limit = 6 จะได้ offset = (2 - 1) * 6 = 6 หมายความว่าต้องข้ามแถวไป 6 แถวแรก และดึงแถวที่ 7-12 แทน

    // 3) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
    let query = `
      SELECT posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;
    let values = [];

    // 4) เขียน query จากเงื่อนไขของการใส่ query parameter category และ keyword
    if (category && keyword) {
      query += `
        WHERE categories.name ILIKE $1 
        AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
      `;
      values = [`%${category}%`, `%${keyword}%`];
    } else if (category) {
      query += " WHERE categories.name ILIKE $1";
      values = [`%${category}%`];
    } else if (keyword) {
      query += `
        WHERE posts.title ILIKE $1 
        OR posts.description ILIKE $1 
        OR posts.content ILIKE $1
      `;
      values = [`%${keyword}%`];
    }

    // 5) เพิ่มการ odering ตามวันที่, limit และ offset
    query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;

    values.push(safeLimit, offset);

    // 6) Execute the main query (ดึงข้อมูลของบทความ)
    const result = await connectionPool.query(query, values);

    // 7) สร้าง Query สำหรับนับจำนวนทั้งหมดตามเงื่อนไข พื่อใช้สำหรับ pagination metadata
    let countQuery = `
      SELECT COUNT(*)
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;
    let countValues = values.slice(0, -2); // ลบค่า limit และ offset ออกจาก values

    if (category && keyword) {
      countQuery += `
        WHERE categories.name ILIKE $1 
        AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
      `;
    } else if (category) {
      countQuery += " WHERE categories.name ILIKE $1";
    } else if (keyword) {
      countQuery += `
        WHERE posts.title ILIKE $1 
        OR posts.description ILIKE $1 
        OR posts.content ILIKE $1
      `;
    }

    const countResult = await connectionPool.query(countQuery, countValues);
    const totalPosts = parseInt(countResult.rows[0].count, 10);

    // 8) สร้าง response พร้อมข้อมูลการแบ่งหน้า (pagination)
    const results = {
      totalPosts,
      totalPages: Math.ceil(totalPosts / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      posts: result.rows,
    };
    // เช็คว่ามีหน้าถัดไปหรือไม่
    if (offset + safeLimit < totalPosts) {
      results.nextPage = safePage + 1;
    }
    // เช็คว่ามีหน้าก่อนหน้าหรือไม่
    if (offset > 0) {
      results.previousPage = safePage - 1;
    }
    // 9) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
    return res.status(200).json(results);
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database issue",
    });
  }
});

app.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await connectionPool.query(
      "SELECT * FROM posts WHERE id = $1", 
      [
        postId
      ]);

      if(!result.rows[0]) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      return res.status(200).json({
        data: result.rows[0],
      });

  } catch (error) {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

app.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, image, category_id, description, content, status_id } = req.body;
  const currentDate = new Date();


  try {
    const updatedResult = await connectionPool.query(
      "UPDATE posts SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6, date = $7 WHERE id = $8 RETURNING *",
      [
        title, 
        image, 
        category_id, 
        description, 
        content, 
        status_id, 
        currentDate, 
        postId
      ]
    );

    if(!updatedResult.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }

  return res.status(200).json({
    message: "Updated post successfully",
  });
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedResult = await connectionPool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [postId]
    );

    if(!deletedResult.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    await connectionPool.query(
      "DELETE FROM comments WHERE post_id = $1",
      [postId]
    );

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});



app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
