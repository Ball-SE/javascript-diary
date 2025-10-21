import { useState, useEffect } from 'react';
import { Bell, Eye } from 'lucide-react';

function AdminNotification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data for demonstration - ในอนาคตจะดึงจาก API
    const mockNotifications = [
        {
            id: 1,
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
            user: {
                name: "Jacob Lash", 
                avatar: "/src/assets/images/jacob.jpg"
            },
            action: "liked your article: The Fascinating World of Cats: Why We Love Our Furry Friends",
            timestamp: "4 hours ago",
            postId: 1
        }
    ];

    useEffect(() => {
        // จำลองการโหลดข้อมูล
        setLoading(true);
        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 1000);
    }, []);

    const handleViewPost = (postId) => {
        // นำทางไปยังโพสต์
        window.location.href = `/posts/${postId}`;
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#26231E]">Notification</h1>
            </div>

            {/* Notifications List */}
            <div className="space-y-0">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#26231E]"></div>
                        <span className="ml-3 text-[#75716B]">Loading notifications...</span>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={notification.id} className="border-b border-gray-200 py-6">
                            <div className="flex items-start gap-4">
                                {/* User Avatar */}
                                <img
                                    src={notification.user.avatar}
                                    alt={notification.user.name}
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                                
                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-[#26231E] text-base">
                                                    {notification.user.name}
                                                </span>
                                                <span className="text-[#26231E] text-base">
                                                    {notification.action}
                                                </span>
                                            </div>
                                            
                                            {/* Comment content if exists */}
                                            {notification.comment && (
                                                <div className="bg-gray-50 p-3 rounded-md mb-2">
                                                    <p className="text-gray-600 text-sm italic">
                                                        "{notification.comment}"
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <p className="text-orange-500 text-sm">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                        
                                        {/* View Button */}
                                        <button
                                            onClick={() => handleViewPost(notification.postId)}
                                            className="ml-4 text-[#26231E] hover:text-orange-500 transition-colors flex items-center gap-1 text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-[#75716B] text-lg">No notifications yet</p>
                        <p className="text-gray-400 text-sm mt-2">You'll see notifications here when users interact with your content</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminNotification;
