import facebook from "../../assets/images/facebook.png";
import axios from "axios";

export function FacebookButton({ postId }) {

  const handleShareOnFacebook = async () => {

    try {
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts/${postId}`
        
      );

      console.log(response.data);
      const articleUrl = response.data.url || window.location.href;
      console.log(articleUrl);
      const shareUrl = `https://www.facebook.com/share.php?u=${(articleUrl)}`;
      console.log(shareUrl);
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error fetching post data:", error);
      // Fallback to current page URL if API fails
      const shareUrl = `https://www.facebook.com/share.php?u=${(window.location.href)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button onClick={handleShareOnFacebook} className="hover:opacity-80 transition-opacity">
      <img src={facebook} alt="Facebook" className="w-10 h-10" />
    </button>
  );
}