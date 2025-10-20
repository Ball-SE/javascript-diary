function ViewPostCard({ comments = [] }){
    return (
        <div className="space-y-6">
            {comments.map((commentItem, index) => {
                return (
                    <div key={commentItem.id}>
                        <div className="flex flex-col gap-4">
                            {/* Profile Picture */}
                            <div className=" flex items-center gap-3">
                                <img 
                                    src={commentItem.user?.profile_pic}
                                    alt={commentItem.user?.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                {/* Username */}
                                <h4 className="font-semibold text-[#43403B] text-xl ">
                                    {commentItem.user?.name}
                                </h4>
                                    
                                {/* Timestamp */}
                                <p className="text-xs font-medium text-[#75716B] ">
                                        {(() => {
                                            const d = new Date(commentItem.created_at);
                                            const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                                            const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                                            return `${dateStr} at ${timeStr}`;
                                        })()}
                                    </p>
                                </div>

                            </div>
                            
                            {/* Comment Content */}
                            <div className="w-full">
                                <p className="text-[#75716B] font-medium text-base">
                                    {commentItem.text}
                                </p>
                            </div>
                        </div>
                        
                        {/* Separator line (except for last comment) */}
                        {index < comments.length - 1 && (
                            <div className="mt-6 border-t border-gray-300"></div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default ViewPostCard;