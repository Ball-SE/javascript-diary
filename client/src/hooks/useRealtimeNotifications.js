import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useAuth();

  // Fetch initial notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (state.user) {
        // ดึงข้อมูลแจ้งเตือนสำหรับ user ที่ login
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            id, type, title, message, post_id, is_read, created_at,
            posts(id, title),
            users!notifications_author_id_fkey(name, profile_pic)
          `)
          .eq('user_id', state.user.id)
          .order('created_at', { ascending: false })
          .limit(20);
  
        if (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
        } else {
          const formattedNotifications = data.map(notif => ({
            id: notif.id,
            type: notif.type,
            user: {
              name: notif.users?.name || 'Unknown',
              avatar: notif.users?.profile_pic || '/src/assets/images/jacob.jpg'
            },
            message: notif.message,
            timestamp: formatTimestamp(notif.created_at),
            postTitle: notif.posts?.title,
            postId: notif.post_id,
            isRead: notif.is_read
          }));
          
          setNotifications(formattedNotifications);
          console.log('Notifications loaded from database:', formattedNotifications.length);
        }
      } else {
        // ดึงข้อมูลแจ้งเตือนสำหรับ user ที่ไม่ login (public notifications)
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            id, type, title, message, post_id, created_at,
            posts(id, title),
            users!notifications_author_id_fkey(name, profile_pic)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
  
        if (error) {
          console.error('Error fetching public notifications:', error);
          setNotifications([]);
        } else {
          const formattedNotifications = data.map(notif => ({
            id: notif.id,
            type: notif.type,
            user: {
              name: notif.users?.name || 'Unknown',
              avatar: notif.users?.profile_pic || '/src/assets/images/jacob.jpg'
            },
            message: notif.message,
            timestamp: formatTimestamp(notif.created_at),
            postTitle: notif.posts?.title,
            postId: notif.post_id,
            isRead: false
          }));
          
          setNotifications(formattedNotifications);
          console.log('Public notifications loaded:', formattedNotifications.length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) return 'Unknown time';
    
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // if (!state.user) return;

    // Fetch initial notifications (empty for new users)
    fetchNotifications();

    console.log('Setting up Supabase realtime subscription...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Current user:', state.user.name);
    
    // Test Supabase connection
    supabase.from('posts').select('count').then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error);
      } else {
        console.log('✅ Supabase connection successful:', data);
      }
    });

    // Test Realtime connection
    const testChannel = supabase.channel('test');
    testChannel.subscribe((status) => {
      console.log('🧪 Test channel status:', status);
    });

    // Subscribe to new posts
    const postsSubscription = supabase
    .channel('posts')
    .on('postgres_changes', 
        { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
        }, 
        (payload) => {
        console.log('🔥 NEW POST DETECTED:', payload);
        
        // Get post details with author info
        supabase
            .from('posts')
            .select(`
            id, title, date, user_id,
            users(name, profile_pic)
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data: postData, error }) => {
            if (error) {
                console.error('Error fetching post details:', error);
                return;
            }

            console.log('Post data:', postData);
            
            // แสดงแจ้งเตือน realtime (ไม่สร้างในฐานข้อมูล)
            if (postData.users) {
                // อัปเดต state สำหรับ user ปัจจุบัน
                if (state.user && postData.user_id !== state.user.id) {
                const newNotification = {
                    id: `article-${postData.id}`,
                    type: 'article',
                    user: {
                    name: postData.users.name,
                    avatar: postData.users.profile_pic || '/src/assets/images/jacob.jpg'
                    },
                    message: 'Published new article.',
                    timestamp: formatTimestamp(postData.date),
                    postTitle: postData.title,
                    postId: postData.id
                };

                setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                console.log('✅ New notification added to state:', newNotification);
                }
            }
            });
        }
    )
    .subscribe((status) => {
        console.log('Subscription status:', status);
    });

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up subscription...');
      postsSubscription.unsubscribe();
    };
  }, [state.user]);

  return {
    notifications,
    loading,
    fetchNotifications
  };
}
