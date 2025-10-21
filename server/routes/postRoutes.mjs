import { Router } from "express";
import { postValidations } from "../middlewares/postValidations.mjs";
import multer from "multer";
import protectAdmin from "../middlewares/protectAdmin.mjs";
import { createClient } from "@supabase/supabase-js";
import enableRealtime from "../middlewares/enableRealtime.mjs";

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
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const safePage = Math.max(1, page);
      const safeLimit = Math.max(1, Math.min(50, limit)); // ลด max limit
      const offset = (safePage - 1) * safeLimit;

      // Query เฉพาะข้อมูลที่จำเป็น
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id, image, title, description, date, likes_count,
          categories(name),
          statuses(status),
          users(name, profile_pic)
        `)
        .order('date', { ascending: false })
        .range(offset, offset + safeLimit - 1);

      if (error) throw error;

      // Format ข้อมูลแบบง่าย
      const formattedPosts = posts?.map(post => ({
        id: post.id,
        image: post.image,
        category: post.categories?.name,
        status: post.statuses?.status,
        title: post.title,
        description: post.description,
        date: post.date,
        likes_count: post.likes_count,
        author: post.users?.name,
        author_pic: post.users?.profile_pic,
      })) || [];

      // นับจำนวนทั้งหมด
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      const totalPosts = count || 0;

      res.json({
        totalPosts,
        totalPages: Math.ceil(totalPosts / safeLimit),
        currentPage: safePage,
        limit: safeLimit,
        posts: formattedPosts,
        nextPage: offset + safeLimit < totalPosts ? safePage + 1 : null
      });

    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
});

// Route สำหรับการสร้างโพสต์ใหม่
postRoutes.post("/", [imageFileUpload, protectAdmin, enableRealtime], async (req, res) => {
  try {
    // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
    const newPost = req.body;
    const file = req.files.imageFile[0];

    // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
    const bucketName = "my-personal-blog";
    const sanitizedFileName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, '_') // เปลี่ยนตัวอักษรพิเศษเป็น underscore
    .replace(/\s+/g, '_'); // เปลี่ยน space เป็น underscore

    const filePath = `posts/${Date.now()}_${sanitizedFileName}`;

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

// Create new category
postRoutes.post("/categories", protectAdmin, async (req, res) => {
  try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ 
          message: "Category name is required" 
        });
      }
      
      // Check if category already exists
      const { data: existingCategory, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name.trim())
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingCategory) {
        return res.status(409).json({ 
          message: "Category already exists" 
        });
      }
      
      // Create new category
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: name.trim() }])
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Server could not create category",
        error: error.message
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

// Get single category by ID
postRoutes.get("/categories/:id", async (req, res) => {
  try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ 
          message: "Category not found" 
        });
      }
      
      res.status(200).json(data);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Server could not read category",
        error: error.message
      });
  }
});

// Update category by ID
postRoutes.put("/categories/:id", protectAdmin, async (req, res) => {
  try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ 
          message: "Category name is required" 
        });
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ 
          message: "Category not found" 
        });
      }
      
      res.status(200).json(data);
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Server could not update category",
        error: error.message
      });
  }
});

// Delete category by ID
postRoutes.delete("/categories/:id", protectAdmin, async (req, res) => {
  try {
      const { id } = req.params;
      
      // First check if category exists
      const { data: existingCategory, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError || !existingCategory) {
        return res.status(404).json({ 
          message: "Category not found" 
        });
      }
      
      // Check if category is being used by any posts
      const { data: postsUsingCategory, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .eq('category_id', id)
        .limit(1);
      
      if (postsError) throw postsError;
      
      if (postsUsingCategory && postsUsingCategory.length > 0) {
        return res.status(400).json({ 
          message: "Cannot delete category that is being used by posts" 
        });
      }
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      res.status(200).json({ 
        message: "Category deleted successfully" 
      });
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Server could not delete category",
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

postRoutes.post("/:postId/comments", [enableRealtime], async (req, res) => {
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

    // Broadcast notification via Supabase Realtime
    try {
      await supabase
        .channel('notifications')
        .send({
          type: 'comment_notification',
          payload: {
            commentId: inserted.id,
            postId: Number(postId),
            userId: userId,
            userName: userRow?.name,
            userAvatar: userRow?.profile_pic,
            commentText: inserted.comment_text,
            timestamp: inserted.created_at
          }
        });
    } catch (broadcastError) {
      console.error('Error broadcasting notification:', broadcastError);
      // Don't fail the request if broadcasting fails
    }

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

// Admin Notifications Routes
// ดึงข้อมูล comments ที่เกี่ยวข้องกับ admin posts
postRoutes.get("/admin/notifications/comments", async (req, res) => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        comment_text,
        created_at,
        post_id,
        user_id,
        posts!inner(
          id,
          title,
          user_id
        ),
        users!inner(
          name,
          profile_pic
        )
      `)
      // .eq('posts.user_id', req.user.id) // เฉพาะ comments ในโพสต์ของ admin - ปิดไว้ชั่วคราว
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.comment_text,
      created_at: comment.created_at ? new Date(comment.created_at).toISOString() : new Date().toISOString(),
      post_id: comment.post_id,
      post_title: comment.posts.title,
      user_name: comment.users.name,
      user_avatar: comment.users.profile_pic
    }));

    res.json({ comments: formattedComments });
  } catch (error) {
    console.error('Error fetching admin comment notifications:', error);
    res.status(500).json({ message: 'Failed to fetch comment notifications', error: error.message });
  }
});

// ดึงข้อมูล likes ที่เกี่ยวข้องกับ admin posts
postRoutes.get("/admin/notifications/likes", async (req, res) => {
  try {
    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
        id,
        post_id,
        user_id,
        posts!inner(
          id,
          title,
          user_id
        ),
        users!inner(
          name,
          profile_pic
        )
      `)
      // .eq('posts.user_id', req.user.id) // เฉพาะ likes ในโพสต์ของ admin - ปิดไว้ชั่วคราว
      .order('id', { ascending: false })
      .limit(50);

    if (error) throw error;

    const formattedLikes = likes.map(like => ({
      id: like.id,
      created_at: like.created_at ? new Date(like.created_at).toISOString() : new Date().toISOString(),
      post_id: like.post_id,
      post_title: like.posts.title,
      user_name: like.users.name,
      user_avatar: like.users.profile_pic
    }));

    res.json({ likes: formattedLikes });
  } catch (error) {
    console.error('Error fetching admin like notifications:', error);
    res.status(500).json({ message: 'Failed to fetch like notifications', error: error.message });
  }
});

// Mark notification as read
postRoutes.put("/admin/notifications/:notificationId/read", async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // ในอนาคตสามารถเพิ่มตาราง notification_reads เพื่อติดตามการอ่าน
    // ตอนนี้เราจะ return success เพื่อให้ frontend ทำงานได้
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
});

// Mark all notifications as read
postRoutes.put("/admin/notifications/read-all", async (req, res) => {
  try {
    // ในอนาคตสามารถเพิ่มตาราง notification_reads เพื่อติดตามการอ่าน
    // ตอนนี้เราจะ return success เพื่อให้ frontend ทำงานได้
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
  }
});


export default postRoutes;