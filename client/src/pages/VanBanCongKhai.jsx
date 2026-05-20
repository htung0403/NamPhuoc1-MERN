import React, { useEffect, useState } from "react";
import PostCardSquare from "../components/PostCardSquare";

export default function VanBanCongKhai() {
  document.title = "VĂN BẢN CÔNG KHAI - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://namphuoc1.edu.vn/api"
      : "http://localhost:3005/api";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/post/getposts?category=van-ban-cong-khai`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await response.json();
        const fetchedPosts = data.posts || [];
        setPosts(fetchedPosts);
        if (fetchedPosts.length < 9) setShowMore(false);
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
      const res = await fetch(`${API_URL}/post/getposts?category=van-ban-cong-khai&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        const fetchedPosts = data.posts || [];
        setPosts((prev) => [...prev, ...fetchedPosts]);
        if (fetchedPosts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <div className="school-container py-14 text-center font-semibold text-primary">Đang tải văn bản công khai...</div>;
  }

  if (error) {
    return <div className="school-container py-14 text-center font-semibold text-red-600">Error: {error}</div>;
  }

  return (
    <div className="school-container py-8 sm:py-12">
      <div className="flex flex-col gap-3">
        <h1 className="school-section-title text-2xl sm:text-3xl">Văn bản công khai</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Các văn bản, thông báo và tài liệu công khai của Trường Tiểu học Nam Phước 1.
        </p>
      </div>

      <div className="news-card-grid mt-6 sm:mt-8">
        {posts.map((post) => (
          <PostCardSquare key={post._id} post={post} />
        ))}
      </div>

      {showMore && (
        <div className="mt-8 flex justify-center sm:mt-10">
          <button onClick={handleShowMore} className="school-button px-7 py-3" type="button">
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}
