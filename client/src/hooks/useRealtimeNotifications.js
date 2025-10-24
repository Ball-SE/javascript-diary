import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลแจ้งเตือนจากฐานข้อมูล (ทั้งสำหรับ user ที่ login และ public)
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id, type, title, message, post_id, is_read, created_at,
          posts(id, title),
          users!notifications_author_id_fkey(name, profile_pic)
        `)
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
          isRead: notif.is_read || false
        }));
        
        setNotifications(formattedNotifications);
        console.log('Notifications loaded from database:', formattedNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

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


  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      console.log('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // if (!state.user) return;

    // Fetch initial notifications (empty for new users)
    fetchNotifications();

    console.log('Setting up Supabase realtime subscription...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
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

    // Subscribe to new notifications
    const notificationsSubscription = supabase
    .channel('notifications')
    .on('postgres_changes', 
        { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
        }, 
        (payload) => {
        console.log('🔔 NEW NOTIFICATION DETECTED:', payload);
        
        // อัปเดต state โดยดึงข้อมูลใหม่จากฐานข้อมูล
        fetchNotifications();
        console.log('✅ Notifications updated from database');
        }
    )
    .subscribe((status) => {
        console.log('Notifications subscription status:', status);
    });

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up subscription...');
      notificationsSubscription.unsubscribe();
    };
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead
  };
}
