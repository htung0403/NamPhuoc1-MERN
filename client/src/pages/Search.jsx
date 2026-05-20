import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCardSquare from "../components/PostCardSquare";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://namphuoc1.edu.vn/api"
      : "http://localhost:3005/api";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${API_URL}/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      const fetchedPosts = data.posts || [];
      setPosts(fetchedPosts);
      setLoading(false);
      setShowMore(fetchedPosts.length === 9);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setSidebarData((current) => ({
      ...current,
      [id]: value || (id === "sort" ? "desc" : "uncategorized"),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);

    if (sidebarData.category && sidebarData.category !== "uncategorized") {
      urlParams.set("category", sidebarData.category);
    } else {
      urlParams.delete("category");
    }

    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", posts.length);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${API_URL}/post/getposts?${searchQuery}`);
    if (!res.ok) return;

    const data = await res.json();
    const fetchedPosts = data.posts || [];
    setPosts((current) => [...current, ...fetchedPosts]);
    setShowMore(fetchedPosts.length === 9);
  };

  const categoryLabel = {
    uncategorized: "Tất cả danh mục",
    "tin-tuc": "Tin tức",
    "su-kien": "Sự kiện",
    "phu-huynh": "Phụ huynh",
    "van-ban-cong-khai": "Văn bản công khai",
  }[sidebarData.category];

  return (
    <main className="school-container py-8 sm:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <aside className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="school-card sticky top-28 space-y-5 p-4 sm:p-5">
            <div>
              <h1 className="school-section-title text-2xl">Tìm kiếm</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Lọc bài viết theo từ khóa, thời gian và danh mục.
              </p>
            </div>

            <div>
              <label htmlFor="searchTerm" className="mb-2 block font-heading text-sm font-bold text-slate-700">
                Từ khóa
              </label>
              <TextInput
                placeholder="Nhập từ khóa..."
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="sort" className="mb-2 block font-heading text-sm font-bold text-slate-700">
                Sắp xếp
              </label>
              <Select onChange={handleChange} value={sidebarData.sort} id="sort">
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </Select>
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block font-heading text-sm font-bold text-slate-700">
                Danh mục
              </label>
              <Select onChange={handleChange} value={sidebarData.category} id="category">
                <option value="uncategorized">Tất cả danh mục</option>
                <option value="tin-tuc">Tin tức</option>
                <option value="su-kien">Sự kiện</option>
                <option value="phu-huynh">Phụ huynh</option>
                <option value="van-ban-cong-khai">Văn bản công khai</option>
              </Select>
            </div>

            <button type="submit" className="school-button w-full py-3">
              Áp dụng
            </button>
          </form>
        </aside>

        <section className="lg:col-span-3">
          <div className="school-card p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Kết quả tìm kiếm
                </h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  {sidebarData.searchTerm
                    ? `Từ khóa: "${sidebarData.searchTerm}"`
                    : "Nhập từ khóa hoặc chọn bộ lọc để tìm bài viết."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                  {categoryLabel}
                </span>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-primary">
                  {sidebarData.sort === "desc" ? "Mới nhất" : "Cũ nhất"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {posts.length} bài viết
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!loading && posts.length === 0 && (
              <div className="school-card p-8 text-center text-slate-600">
                Không tìm thấy bài viết phù hợp.
              </div>
            )}

            {loading && (
              <div className="school-card p-8 text-center font-semibold text-primary">
                Đang tải...
              </div>
            )}

            {!loading && posts.length > 0 && (
              <div className="news-card-grid">
                {posts.map((post) => (
                  <PostCardSquare key={post._id} post={post} />
                ))}
              </div>
            )}

            {showMore && (
              <div className="mt-8 flex justify-center">
                <button onClick={handleShowMore} className="school-button px-8 py-3" type="button">
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
