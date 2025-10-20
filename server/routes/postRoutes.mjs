import { Router } from "express";
import { postValidations } from "../middlewares/postValidations.mjs";
import multer from "multer";
import protectAdmin from "../middlewares/protectAdmin.mjs";
import { createClient } from "@supabase/supabase-js";

// เชื่อมต่อ Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const postRoutes = Router();

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

postRoutes.get("/test-db", async (req, res) => {
  try {
      const { data, error } = await supabase
        .from('posts')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) throw error;
      
      res.status(200).json({ 
        message: "Supabase connection successful",
        postsCount: data
      });
  } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).json({ 
        message: "Database connection failed",
        error: error.message 
      });
  }
});

postRoutes.get("/", async (req, res) => {
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

      // 3) สร้าง Supabase query สำหรับดึงข้อมูลโพสต์
      let query = supabase
        .from('posts')
        .select(`
          id, image, title, description, date, content, status_id, likes_count,
          categories!inner(name),
          statuses!inner(status),
          users(name, profile_pic)
        `)
        .order('date', { ascending: false })
        .range(offset, offset + safeLimit - 1);

      // 4) เพิ่มเงื่อนไขการค้นหาตาม category และ keyword
      if (category && keyword) {
        query = query
          .eq('categories.name', category)
          .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);
      } else if (category) {
        query = query.eq('categories.name', category);
      } else if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);
      }

      // 5) Execute the main query
      const { data: posts, error } = await query;

      if (error) throw error;

      // 6) จัดรูปแบบข้อมูลให้ตรงกับ format เดิม
      const formattedPosts = posts?.map(post => ({
        id: post.id,
        image: post.image,
        category: post.categories?.name,
        title: post.title,
        description: post.description,
        date: post.date,
        content: post.content,
        status: post.statuses?.status,
        status_id: post.status_id,
        likes_count: post.likes_count,
        author: post.users?.name,
        author_pic: post.users?.profile_pic,
      })) || [];

      // 7) นับจำนวนทั้งหมดสำหรับ pagination
      const { count, error: countError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      const totalPosts = count || 0;

      // 8) สร้าง response พร้อมข้อมูลการแบ่งหน้า (pagination)
      const results = {
        totalPosts,
        totalPages: Math.ceil(totalPosts / safeLimit),
        currentPage: safePage,
        limit: safeLimit,
        posts: formattedPosts,
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
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({
        message: "Server could not read post because database issue",
        error: error.message
      });
    }
});

// Route สำหรับการสร้างโพสต์ใหม่
postRoutes.post("/", [imageFileUpload, protectAdmin], async (req, res) => {
  try {
    // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
    const newPost = req.body;
    const file = req.files.imageFile[0];

    // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
    const bucketName = "my-personal-blog";
    const filePath = `posts/${Date.now()}_${file.originalname}`; // สร้าง path ที่ไม่ซ้ำกัน

    // 3) อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
      });

    if (error) {
      throw error;
    }

    // 4) ดึง URL สาธารณะของไฟล์ที่อัปโหลด
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    // 4.5) ระบุ user_id จาก token
    const token = (req.headers.authorization || '').split(' ')[1];
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = authData.user.id;

    // 5) บันทึกข้อมูลโพสต์ลงในฐานข้อมูล Supabase
    const { data: insertedPost, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          title: newPost.title,
          image: publicUrl,
          category_id: parseInt(newPost.category_id),
          description: newPost.description,
          content: newPost.content,
          status_id: parseInt(newPost.status_id),
          user_id: userId,
        }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // 6) ส่งผลลัพธ์กลับไปยัง client
    return res.status(201).json({ message: "Created post successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not create post",
      error: err.message,
    });
  }
});

postRoutes.get("/categories", async (req, res) => {
  try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      
      res.status(200).json({ categories: data });
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Server could not read categories",
        error: error.message
      });
  }
});

postRoutes.get("/statuses", async (req, res) => {
  try {
      const { data, error } = await supabase
        .from('statuses')
        .select('*');
      
      if (error) throw error;
      
      res.status(200).json({ statuses: data });
  } catch (error) {
      res.status(500).json({ 
        message: "Server could not read statuses",
        error: error.message
      });
  }
});
  
postRoutes.get("/:postId", async (req, res) => {
    const { postId } = req.params;
  
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories!inner(name),
          statuses!inner(status),
          users(name, username, profile_pic, bio)
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      if(!data) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      // Format response to include category name and author info
      const formattedPost = {
        ...data,
        category: data.categories?.name,
        status: data.statuses?.status,
        author: data.users?.name,
        author_username: data.users?.username,
        author_pic: data.users?.profile_pic,
        author_bio: data.users?.bio
      };

      return res.status(200).json({
        data: formattedPost,
      });

    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({
        message: "Server could not read post because database connection",
        error: error.message
      });
    }
});

// Like endpoints
postRoutes.get("/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    let userId = null;
    if (token) {
      const { data: authData } = await supabase.auth.getUser(token);
      userId = authData?.user?.id || null;
    }

    const { count: totalLikes, error: countErr } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);
    if (countErr) throw countErr;

    let liked = false;
    if (userId) {
      const { data: existing, error: existErr } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();
      if (existErr) throw existErr;
      liked = Boolean(existing);
    }

    res.status(200).json({ likesCount: totalLikes || 0, liked });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Failed to fetch likes', error: error.message });
  }
});

postRoutes.post("/:postId/like", async (req, res) => {
  const { postId } = req.params;
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = authData.user.id;

    // Check existing like
    const { data: existing, error: existErr } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    if (existErr) throw existErr;

    let liked;
    if (existing) {
      // Unlike
      const { error: delErr } = await supabase
        .from('likes')
        .delete()
        .eq('id', existing.id);
      if (delErr) throw delErr;

      await supabase.rpc('decrement_likes_count', { target_post_id: Number(postId) }).catch(async () => {
        const { data: postRow } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
        const next = Math.max(0, (postRow?.likes_count || 0) - 1);
        await supabase.from('posts').update({ likes_count: next }).eq('id', postId);
      });
      liked = false;
    } else {
      // Like
      const { error: insErr } = await supabase
        .from('likes')
        .insert([{ post_id: Number(postId), user_id: userId }]);
      if (insErr) throw insErr;

      await supabase.rpc('increment_likes_count', { target_post_id: Number(postId) }).catch(async () => {
        const { data: postRow } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
        const next = (postRow?.likes_count || 0) + 1;
        await supabase.from('posts').update({ likes_count: next }).eq('id', postId);
      });
      liked = true;
    }

    const { count: totalLikes } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    res.status(200).json({ liked, likesCount: totalLikes || 0 });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
});
  
postRoutes.put("/:postId", [postValidations], async (req, res) => {
    const { postId } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;
    const currentDate = new Date();
  
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: title,
          image: image,
          category_id: category_id,
          description: description,
          content: content,
          status_id: status_id,
          date: currentDate
        })
        .eq('id', postId)
        .select();

      if (error) throw error;

      if(!data || data.length === 0) {
        return res.status(404).json({
          message: "Server could not find a requested post to update",
        });
      }

      return res.status(200).json({
        message: "Updated post successfully",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({
        message: "Server could not update post because database connection",
        error: error.message
      });
    }
});
  
postRoutes.delete("/:postId", async (req, res) => {
    const { postId } = req.params;
  
    try {
      // ลบ comments ที่เกี่ยวข้องก่อน
      const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId);

      if (deleteCommentsError) {
        console.error("Error deleting comments:", deleteCommentsError);
      }

      // ลบโพสต์
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .select();

      if (error) throw error;

      if(!data || data.length === 0) {
        return res.status(404).json({
          message: "Server could not find a requested post to delete",
        });
      }

      return res.status(200).json({
        message: "Deleted post successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({
        message: "Server could not delete post because database connection",
        error: error.message
      });
    }
});

export default postRoutes;
 
// Comments endpoints
postRoutes.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`id, comment_text, created_at, user_id, users(name, profile_pic)`) // join users
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const formatted = (data || []).map(row => ({
      id: row.id,
      text: row.comment_text,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        name: row.users?.name,
        profile_pic: row.users?.profile_pic,
      }
    }));

    res.status(200).json({ comments: formatted });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

postRoutes.post("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { comment_text } = req.body;
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = authData.user.id;

    if (!comment_text || String(comment_text).trim() === '') {
      return res.status(400).json({ message: 'comment_text is required' });
    }

    const { data: insertedRows, error: insertErr } = await supabase
      .from('comments')
      .insert([{ post_id: Number(postId), user_id: userId, comment_text: String(comment_text).trim() }])
      .select('id, comment_text, created_at, user_id');
    if (insertErr) throw insertErr;

    const inserted = insertedRows?.[0];

    // attach user info
    const { data: userRow } = await supabase
      .from('users')
      .select('name, profile_pic')
      .eq('id', userId)
      .single();

    res.status(201).json({
      comment: {
        id: inserted.id,
        text: inserted.comment_text,
        created_at: inserted.created_at,
        user: { id: userId, name: userRow?.name, profile_pic: userRow?.profile_pic }
      }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
});