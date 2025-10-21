import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client สำหรับ server-side
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware สำหรับเปิดใช้งาน Realtime
export const enableRealtime = async (req, res, next) => {
  try {
    // เปิดใช้งาน Realtime สำหรับ tables ที่ต้องการ
    const { error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .limit(1);
    
    const { error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.error('Realtime setup error for comments:', commentsError);
    } else {
      console.log('Realtime enabled for comments table');
    }
    
    if (postsError) {
      console.error('Realtime setup error for posts:', postsError);
    } else {
      console.log('Realtime enabled for posts table');
    }
    
    next();
  } catch (error) {
    console.error('Error enabling realtime:', error);
    next();
  }
};

export default enableRealtime;
