import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import heroImage from "../assets/images/image.jpg";
import { FacebookButton } from "../components/buttons/FacebookButton";
import { LinkinButton } from "../components/buttons/LinkinButton";
import { TwitterButton } from "../components/buttons/TwitterButton";
import ViewPostCard from "../components/cards/ViewPostCard";
import { ClipboardButton } from "../components/buttons/ClipboardButton";
import { LikeButton } from "../components/buttons/LikeButton";
import { CommentForm } from "../components/forms/CommentForm";

function ViewPosts() {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [comments, setComments] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [API_BASE_URL, postId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [API_BASE_URL, postId]);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Navbar />
        {/* รูปภาพ */}
        <img
            className=" w-full max-w-7xl mx-auto aspect-[1200/587] h-full object-cover rounded-lg m-8"
            src={post.image}
            alt={post.title}
        />
      <main className="flex-grow">
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content - ด้านซ้าย */}
            <div className="flex-1">
              <div className="p-1">
                

                {/* ข้อมูลบทความ */}
                <div className="mb-8 ">
                  {/* Category และ Date */}
                  <div className="flex items-center mb-4 gap-4">
                    <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                      {post.category}
                    </span>
                    <p className="text-sm text-[#75716B]">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* หัวข้อบทความ */}
                  <h2 className="text-4xl font-semibold text-[#26231E] mb-4">
                    {post.title}
                  </h2>

                  {/* คำอธิบาย */}
                  <p className="text-[#75716B] text-base font-semibold mb-8">{post.description}</p>
                </div>

                {/* เนื้อหาบทความ */}
                <div className=" mb-8 markdown">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Social Sharing Section */}
                <div className="mb-8">
                  <div className="bg-[#EFEEEB] rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Like Button */}
                        <LikeButton post={post} />

                      {/* Social Share Buttons */}
                      <div className="flex items-center gap-3">
                        <ClipboardButton postId={postId}/>
                        <FacebookButton postId={postId}/>
                        <LinkinButton postId={postId}/>
                        <TwitterButton postId={postId}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="mb-8 flex flex-col gap-4">
                  <CommentForm postId={postId} onAdded={handleCommentAdded} />
                  <ViewPostCard comments={comments} />
                </div>
              </div>
            </div>

            {/* Author Section - ด้านขวา (Sticky) */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-[#EFEEEB] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                      src={post.author_pic || heroImage}
                      alt="Author"
                    />
                    <div>
                      <h3 className="text-xs font-medium text-[#75716B] ">
                        Author
                      </h3>
                      <p className="font-semibold text-xl text-[#43403B]">{post.author}</p>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-gray-300 mb-4"></div>
                  <p className="text-base font-medium text-[#75716B] leading-relaxed">
                    {post.author_bio || 'No bio available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ViewPosts;