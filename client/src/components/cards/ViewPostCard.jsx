import { comment } from "../../data/comment.js";

function ViewPostCard(){
    return (
        <div className="space-y-6">
            {comment.map((commentItem, index) => {
                return (
                    <div key={commentItem.id}>
                        <div className="flex flex-col gap-4">
                            {/* Profile Picture */}
                            <div className=" flex items-center gap-3">
                                <img 
                                    src={commentItem.image} 
                                    alt={commentItem.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                {/* Username */}
                                <h4 className="font-semibold text-[#43403B] text-xl ">
                                    {commentItem.name}
                                </h4>
                                    
                                {/* Timestamp */}
                                <p className="text-xs font-medium text-[#75716B] ">
                                        {commentItem.creat_at}
                                    </p>
                                </div>

                            </div>
                            
                            {/* Comment Content */}
                            <div className="w-full">
                                <p className="text-[#75716B] font-medium text-base">
                                    {commentItem.comment}
                                </p>
                            </div>
                        </div>
                        
                        {/* Separator line (except for last comment) */}
                        {index < comment.length - 1 && (
                            <div className="mt-6 border-t border-gray-300"></div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default ViewPostCard;