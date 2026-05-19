import React, { useEffect, useState } from "react";
import PostCardSquare from "../components/PostCardSquare";

const TinTuc = () => {
  document.title = "TIN TỨC - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
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
        const response = await fetch(`${API_URL}/post/getposts?category=tin-tuc`);

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
        setTotalPosts(data.totalPosts || fetchedPosts.length);
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
      const res = await fetch(`${API_URL}/post/getposts?category=tin-tuc&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        const fetchedPosts = data.posts || [];
        setPosts((prev) => [...prev, ...fetchedPosts]);
        setTotalPosts(data.totalPosts || totalPosts);
        if (fetchedPosts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <div className="school-container py-14 text-center font-semibold text-primary">Đang tải tin tức...</div>;
  }

  if (error) {
    return <div className="school-container py-14 text-center font-semibold text-red-600">Error: {error}</div>;
  }

  const count = totalPosts || posts.length;

  return (
    <div className="school-container py-8 sm:py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="school-section-title text-2xl sm:text-3xl">Tin tức của trường</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Những thông tin mới nhất về hoạt động dạy học và đời sống học đường.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button type="button" className="rounded-full bg-primary px-4 py-2 font-heading text-xs font-extrabold text-white sm:px-5 sm:text-sm">
            Tất cả ({count})
          </button>
          <button type="button" className="rounded-full border border-primary bg-white px-4 py-2 font-heading text-xs font-extrabold text-primary sm:px-5 sm:text-sm">
            Tin tức ({count})
          </button>
        </div>
      </div>

      <div className="news-card-grid mt-6 sm:mt-8">
        {posts.map((post) => (
          <PostCardSquare key={post._id} post={post} />
        ))}
      </div>

      {showMore && (
        <div className="mt-8 flex justify-center sm:mt-10">
          <button onClick={handleShowMore} className="school-button px-8 py-3" type="button">
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default TinTuc;
