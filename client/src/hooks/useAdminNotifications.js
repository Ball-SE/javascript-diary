import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { state } = useAuth();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

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

    // Fetch admin notifications
    const fetchAdminNotifications = async () => {
        if (!state.user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // ดึงข้อมูล comments และ likes ที่เกี่ยวข้องกับ admin posts
            const [commentsResponse, likesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/admin/notifications/comments`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch(`${API_BASE_URL}/admin/notifications/likes`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            if (!commentsResponse.ok || !likesResponse.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const commentsData = await commentsResponse.json();
            const likesData = await likesResponse.json();

            // รวม notifications และเรียงตามเวลา
            const allNotifications = [
                ...commentsData.comments?.map(comment => ({
                    id: `comment-${comment.id}`,
                    type: 'comment',
                    user: {
                        name: comment.user_name || 'Unknown User',
                        avatar: comment.user_avatar || '/src/assets/images/jacob.jpg'
                    },
                    action: `Commented on your article: ${comment.post_title}`,
                    comment: comment.content,
                    timestamp: formatTimestamp(comment.created_at),
                    postId: comment.post_id
                })) || [],
                ...likesData.likes?.map(like => ({
                    id: `like-${like.id}`,
                    type: 'like',
                    user: {
                        name: like.user_name || 'Unknown User',
                        avatar: like.user_avatar || '/src/assets/images/jacob.jpg'
                    },
                    action: `liked your article: ${like.post_title}`,
                    timestamp: formatTimestamp(like.created_at),
                    postId: like.post_id
                })) || []
            ];

            // เรียงตามเวลาล่าสุด
            allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            setNotifications(allNotifications);
        } catch (err) {
            console.error('Error fetching admin notifications:', err);
            setError(err.message);
            
            // Fallback to mock data for development
            const mockNotifications = [
                {
                    id: 1,
                    type: 'comment',
                    user: {
                        name: "Jacob Lash",
                        avatar: "/src/assets/images/jacob.jpg"
                    },
                    action: "Commented on your article: The Fascinating World of Cats: Why We Love Our Furry Friends",
                    comment: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
                    timestamp: "4 hours ago",
                    postId: 1
                },
                {
                    id: 2,
                    type: 'like',
                    user: {
                        name: "Jacob Lash", 
                        avatar: "/src/assets/images/jacob.jpg"
                    },
                    action: "liked your article: The Fascinating World of Cats: Why We Love Our Furry Friends",
                    timestamp: "4 hours ago",
                    postId: 1
                }
            ];
            setNotifications(mockNotifications);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    useEffect(() => {
        if (state.user) {
            fetchAdminNotifications();
        }
    }, [state.user]);

    return {
        notifications,
        loading,
        error,
        fetchAdminNotifications,
        markAsRead,
        markAllAsRead
    };
}
