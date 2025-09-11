import { useState } from "react"
import happyLight from "../../assets/images/happy_light.png"
import { AlertDialog } from "../alert/AlertDialog";

export function LikeButton({ post }) {
    const [isLiked, setIsLiked] = useState(false)
    
    const handleLike = () => {
        setIsLiked(!isLiked)
    }
    
    return (
        <AlertDialog
        trigger ={
                <button 
                    onClick={handleLike}
                    className={"bg-white border border-[#75716B] text-[#26231E] px-4 py-2 rounded-full flex items-center hover:bg-gray-50 transition-colors duration-200 shadow-sm"}
                >
                    <img src={happyLight} alt="Like" className="w-5 h-5 mr-3" />
                    <span className="text-base font-medium">
                        {post?.likes || 0}
                    </span>
                </button>
        }
        />
        
    )
}