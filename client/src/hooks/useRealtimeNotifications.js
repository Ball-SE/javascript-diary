import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './useAuth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useAuth();

  // Fetch initial notifications
  const fetchNotifications = async () => {
    if (!state.user) return;
    
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
      
      const postsResponse = await fetch(`${API_BASE_URL}/posts?limit=3`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!postsResponse.ok) {
        throw new Error(`HTTP error! status: ${postsResponse.status}`);
      }
      
      const postsData = await postsResponse.json();
      
      if (postsData.posts) {
        const recentPosts = postsData.posts
          .filter(post => post.author !== state.user.name) // เปลี่ยนจาก author_id เป็น author
          .slice(0, 3) // ลดจำนวน notifications
          .map(post => ({
            id: `article-${post.id}`,
            type: 'article',
            user: {
              name: post.author || 'Unknown Author',
              avatar: post.author_pic || '/src/assets/images/jacob.jpg'
            },
            message: 'Published new article.',
            timestamp: formatTimestamp(post.date),
            postTitle: post.title,
            postId: post.id
          }));
        
        setNotifications(recentPosts);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
    if (!state.user) return;

    // Fetch initial notifications
    fetchNotifications();

    // Subscribe to new posts only (ลบ comments subscription ออก)
    const postsSubscription = supabase
      .channel('posts')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'posts' 
        }, 
        (payload) => {
          console.log('New post detected:', payload);
          
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

              // Only notify if the post is not from the current user
              if (postData.users && postData.users.name !== state.user.name) {
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

                setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
              }
            });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      postsSubscription.unsubscribe();
    };
  }, [state.user]);

  return {
    notifications,
    loading,
    fetchNotifications
  };
}
