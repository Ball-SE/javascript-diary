import React from 'react';
import { Bell, Eye, RefreshCw } from 'lucide-react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';

function NotiManagement() {
    const { notifications, loading, error, fetchAdminNotifications, markAsRead } = useAdminNotifications();

    const handleViewPost = (postId) => {
        // นำทางไปยังโพสต์
        window.location.href = `/posts/${postId}`;
    };

    const handleMarkAsRead = (notificationId) => {
        markAsRead(notificationId);
    };

    const handleRefresh = () => {
        fetchAdminNotifications();
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b-2 border-gray-200 p-8">
                <h3 className="text-2xl font-semibold text-[#26231E]">Notification</h3>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 text-[#26231E] border border-[#26231E] rounded-full hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>
            
            {/* Notifications List */}
            <div className="px-8 py-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#26231E]"></div>
                        <span className="ml-3 text-[#75716B]">Loading notifications...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 mx-auto text-red-400 mb-4" />
                        <p className="text-red-500 text-lg mb-2">Error loading notifications</p>
                        <p className="text-gray-400 text-sm">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-[#26231E] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-0">
                        {notifications.map((notification) => (
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
                                                onClick={() => {
                                                    handleViewPost(notification.postId);
                                                    handleMarkAsRead(notification.id);
                                                }}
                                                className="ml-4 text-[#26231E] hover:text-orange-500 transition-colors flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default NotiManagement;
