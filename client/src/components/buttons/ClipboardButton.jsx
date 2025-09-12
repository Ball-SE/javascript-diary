import copyLight from "../../assets/images/Copy_light.png";
import axios from "axios";
import { toast } from "sonner";

export function ClipboardButton({ postId }) {
    const handleShareOnClipboard = async () => {
        try {
            const response = await axios.get(
                `https://blog-post-project-api.vercel.app/posts/${postId}`
            );
            const articleUrl = response.data.url || window.location.href;
            navigator.clipboard.writeText(articleUrl);
            toast.success("Copied!", {description: "This article has been copied to your clipboard"});
        } catch (error) {
            console.error("Error fetching post data:", error);
            toast.error("Error copying link. Please try again.", {description: "Please try again."});
        }
    }
  return (
    <button className="bg-white border border-[#75716B] text-[#26231E] px-4 py-2 rounded-full flex items-center hover:bg-gray-50 transition-colors duration-200 shadow-sm" 
    
    onClick={handleShareOnClipboard}>
      <img src={copyLight} alt="Copy link" className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">Copy link</span>
    </button>
  );
}
