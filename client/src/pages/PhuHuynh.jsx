import React, { useState, useEffect } from 'react';
import PostCardSquare from '../components/PostCardSquare';

const PhuHuynh = () => {
  document.title = `PHỤ HUYNH - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1`;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);

  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:3005/api';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/post/getposts?category=phu-huynh`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await response.json();
        setPosts(data.posts);
        if(data.posts.length<9){
          setShowMore(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
        const res = await fetch(`${API_URL}/post/getposts?category=phu-huynh&startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
            setPosts((prev) => [...prev, ...data.posts]);
            if(data.posts.length<9){
              setShowMore(false);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-[70px] mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-start">
        <div className="w-3 h-10 mr-4 bg-cyan-600 border rounded-lg"></div>
        <h1 className="font-semibold text-[1.7rem] text-cyan-600">
          THÔNG BÁO CHUNG DÀNH CHO PHỤ HUYNH
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-6">
        {posts.map((post) => (
          <PostCardSquare key={post._id} post={post} />
        ))}
      </div>
      {showMore && (
        <div className="flex justify-center">
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}

export default PhuHuynh;