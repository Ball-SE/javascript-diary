import { useState } from "react"
import happyLight from "../../assets/images/Happy_light.png"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export function LikeButton({ post }) {
    const [isLiked, setIsLiked] = useState(false)
    
    const handleLike = () => {
        setIsLiked(!isLiked)
    }
    
    return (
        <AlertDialog>
            
            <AlertDialogTrigger asChild>
                <button 
                    onClick={handleLike}
                    className={"bg-white border border-[#75716B] text-[#26231E] px-4 py-2 rounded-full flex items-center hover:bg-gray-50 transition-colors duration-200 shadow-sm"}
                >
                    <img src={happyLight} alt="Like" className="w-5 h-5 mr-3" />
                    <span className="text-base font-medium">
                        {post?.likes || 0}
                    </span>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col items-center justify-center">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Create an account to continue</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogAction><Link to="/signup">Create account</Link></AlertDialogAction>
                <AlertDialogFooter>
                    <AlertDialogDescription>
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </AlertDialogDescription>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
    )
}