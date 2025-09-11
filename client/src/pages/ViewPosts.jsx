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

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const response = await axios.get(
          `https://blog-post-project-api.vercel.app/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

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
                  <CommentForm />
                  <ViewPostCard />
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
                      src={heroImage}
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
                    I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
                    <br /><br />
                    When I'm not writing, I spend time volunteering at my local animal shelter, helping cats find loving homes.
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