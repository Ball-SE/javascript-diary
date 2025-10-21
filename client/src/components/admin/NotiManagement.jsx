import React from 'react';
import { Bell, Eye } from 'lucide-react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import NotificationPagination from '../layout/NotificationPagination';

function NotiManagement() {
    const { 
        notifications, 
        loading, 
        error, 
        currentPage, 
        totalPages, 
        totalNotifications,
        handlePageChange, 
        markAsRead 
    } = useAdminNotifications();

    const handleViewPost = (postId) => {
        // นำทางไปยังโพสต์
        window.location.href = `/post/${postId}`;
    };

    const handleMarkAsRead = (notificationId) => {
        markAsRead(notificationId);
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 border-b-2 border-gray-200 p-3 sm:p-4 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#26231E] mb-2 sm:mb-0">Notification</h3>
                {totalNotifications > 0 && (
                    <div className="text-xs sm:text-sm text-gray-500">
                        {totalNotifications} total notifications
                    </div>
                )}
            </div>
            
            {/* Notifications List */}
            <div className="flex-1 flex flex-col overflow-hidden px-2 sm:px-4 lg:px-8 py-2 sm:py-3">
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
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#26231E] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : notifications.length > 0 ? (
                    <>
                        {/* Scrollable Notifications List */}
                        <div className="flex-1 overflow-y-auto space-y-0">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="border-b border-gray-200 py-4 sm:py-6">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* User Avatar */}
                                        <img
                                            src={notification.user.avatar}
                                            alt={notification.user.name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                                        />
                                        
                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                                        <span className="font-semibold text-[#26231E] text-sm sm:text-base">
                                                            {notification.user.name}
                                                        </span>
                                                        <span className="text-[#26231E] text-sm sm:text-base break-words">
                                                            {notification.action}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Comment content if exists */}
                                                    {notification.comment && (
                                                        <div className="bg-gray-50 p-2 sm:p-3 rounded-md mb-2">
                                                            <p className="text-gray-600 text-xs sm:text-sm italic break-words">
                                                                "{notification.comment}"
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    <p className="text-orange-500 text-xs sm:text-sm">
                                                        {notification.timestamp}
                                                    </p>
                                                </div>
                                                
                                                {/* View Button */}
                                                <button
                                                    onClick={() => {
                                                        handleViewPost(notification.postId);
                                                        handleMarkAsRead(notification.id);
                                                    }}
                                                    className="mt-2 sm:mt-0 sm:ml-4 text-[#26231E] hover:text-orange-500 transition-colors flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 sm:px-0 sm:py-0 bg-gray-100 sm:bg-transparent rounded sm:rounded-none"
                                                >
                                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">View</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination - Fixed at bottom */}
                        <div className="flex-shrink-0">
                            <NotificationPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                loading={loading}
                            />
                        </div>
                    </>
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
