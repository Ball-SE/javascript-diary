import { useState } from "react";
import { products } from "../../data/post-data";

function BlogCard() {
  // const { category, title, description, image, author, date } = props;
  const [posts, setPosts] = useState(products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
    {posts.map((post,index) => (
      <div className="flex flex-col gap-4 p-[10px]" key={index}>
        <a href="#" className="relative h-[212px] sm:h-[360px]">
          <img
            className="w-full h-full object-cover rounded-md"
            src={post.image}
            alt={post.title}
          />
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {post.category}
            </span>
          </div>
          <a href="#">
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {post.title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center text-sm">
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={post.image}
              alt={post.author}
            />
            <span>{post.author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    ))}
    </div>
  );
}

export default BlogCard;
