import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const { state } = useAuth();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Unknown time';
        
        const now = new Date();
        const date = new Date(timestamp);
        
        if (isNaN(date.getTime())) {
            return 'Unknown time';
        }
        
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        
        
        // Less than 1 minute
        if (diffInMinutes < 1) return 'Just now';
        
        // Less than 1 hour
        if (diffInMinutes < 60) {
            return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
        }
        
        // Less than 24 hours
        if (diffInHours < 24) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
        }
        
        // Less than 48 hours
        if (diffInHours < 48) return 'Yesterday';
        
        // More than 2 days - show actual date
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Fetch admin notifications with pagination
    const fetchAdminNotifications = async (page = 1) => {
        if (!state.user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // ดึงข้อมูล comments และ likes ที่เกี่ยวข้องกับ admin posts
            const [commentsResponse, likesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/posts/admin/notifications/comments?page=${page}&limit=10`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${API_BASE_URL}/posts/admin/notifications/likes?page=${page}&limit=10`, {
                    headers: {
                        'Content-Type': 'application/json'
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
            setCurrentPage(page);
            setTotalPages(Math.max(commentsData.totalPages || 1, likesData.totalPages || 1));
            setTotalNotifications((commentsData.total || 0) + (likesData.total || 0));
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
            await fetch(`${API_BASE_URL}/posts/admin/notifications/${notificationId}/read`, {
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
            await fetch(`${API_BASE_URL}/posts/admin/notifications/read-all`, {
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

    // Handle page change
    const handlePageChange = (page) => {
        fetchAdminNotifications(page);
    };

    useEffect(() => {
        if (state.user) {
            fetchAdminNotifications(1);
        }
    }, [state.user]);

    return {
        notifications,
        loading,
        error,
        currentPage,
        totalPages,
        totalNotifications,
        fetchAdminNotifications,
        handlePageChange,
        markAsRead,
        markAllAsRead
    };
}
