import { useState } from "react";
import axios from "axios";
import { AlertDialog } from "../alert/AlertDialog";
import { useAuth } from "../../hooks/useAuth";

export function CommentForm({ postId, onAdded }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
  const { isAuthenticated } = useAuth();

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comments`,
        { comment_text: text.trim() },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      onAdded?.(response.data.comment);
      setText("");
    } catch (error) {
      console.error("Failed to send comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#26231E] mb-4">Comments</h3>
      <textarea
        placeholder="What are your thoughts?"
        className="w-full text-base p-4 font-medium border border-[#DAD6D1] bg-[#FFFFFF] rounded-lg resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#26231E] focus:border-transparent"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        {isAuthenticated ? (
          <button
            className="bg-[#26231E] text-white text-base font-medium px-6 py-2 rounded-full hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
            onClick={handleSend}
            disabled={submitting || !text.trim()}
          >
            {submitting ? 'Sending...' : 'Send'}
          </button>
        ) : (
          <AlertDialog
            trigger={
              <button
                className="bg-[#26231E] text-white text-base font-medium px-6 py-2 rounded-full hover:bg-[#1a1a1a] transition-colors disabled:opacity-60"
                disabled={!text.trim()}
              >
                Send
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
