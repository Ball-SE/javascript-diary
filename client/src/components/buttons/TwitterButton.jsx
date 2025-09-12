import twitter from "../../assets/images/twitter.png";
import axios from "axios";

export function TwitterButton({ postId }){

    const handleShareOnTwitter = async () => {
        try {
            const response = await axios.get(
                `https://blog-post-project-api.vercel.app/posts/${postId}`
            );
            const articleUrl = response.data.url || window.location.href;
            const shareUrl = `https://www.twitter.com/share?&url=${(articleUrl)}`;
            window.open(shareUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error("Error fetching post data:", error);
            // Fallback to current page URL if API fails
            const shareUrl = `https://www.twitter.com/share?&url=${(window.location.href)}`;
            window.open(shareUrl, "_blank", "noopener,noreferrer");
        }
    }

    return (
        <button className="hover:opacity-80 transition-opacity" onClick={handleShareOnTwitter}>
            <img src={twitter} alt="Twitter" className="w-10 h-10" />
        </button>
    )
}