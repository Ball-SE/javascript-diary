import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';

export function NotiUser() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, loading, markAsRead } = useRealtimeNotifications();
    
    // Calculate unread notifications count based on database isRead status
    const unreadCount = notifications.filter(notif => !notif.isRead).length;

    const toggleNotifications = () => {
        setIsOpen(!isOpen);
        
        // Mark all notifications as read when opening the dropdown
        if (!isOpen && notifications.length > 0) {
            notifications.forEach(notif => {
                if (!notif.isRead) {
                    markAsRead(notif.id);
                }
            });
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button 
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <Bell className="w-6 h-6" />
                {/* Notification Badge - only show if there are unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#F9F8F6] rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    
                    {loading ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        notification.isRead ? 'opacity-60' : 'bg-blue-50'
                                    }`}
                                    onClick={() => {
                                        // Mark as read when clicked
                                        if (!notification.isRead) {
                                            markAsRead(notification.id);
                                        }
                                        
                                        // Navigate to the post when notification is clicked
                                        if (notification.postId) {
                                            window.location.href = `/posts/${notification.postId}`;
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* User Avatar */}
                                        <img
                                            src={notification.user.avatar}
                                            alt={notification.user.name}
                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                        />
                                        
                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-800 text-sm">
                                                    {notification.user.name}
                                                </span>
                                                <span className="text-gray-600 text-sm">
                                                    {notification.message}
                                                </span>
                                            </div>
                                            {notification.postTitle && (
                                                <p className="text-gray-500 text-xs mb-1 truncate">
                                                    "{notification.postTitle}"
                                                </p>
                                            )}
                                            <p className="text-orange-500 text-xs">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                        </div>
                    )}
                    
                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-gray-100">
                        {notifications.length > 0 && (
                            <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View all notifications
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}