import { Spinner } from "flowbite-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Link, useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [pdfPages, setPdfPages] = useState(0);
  const [pdfError, setPdfError] = useState("");
  const [pdfWidth, setPdfWidth] = useState(320);
  const pdfContainerRef = useRef(null);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://namphuoc1.edu.vn/api"
      : "http://localhost:3005/api";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };
    fetchRecentPosts();
  }, []);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1`;
    }
  }, [post]);

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "tin-tuc":
        return "Tin tức";
      case "su-kien":
        return "Sự kiện";
      case "phu-huynh":
        return "Phụ huynh";
      default:
        return category || "Tin trường";
    }
  };

  const stripHtmlTags = (html = "") => html.replace(/<[^>]*>/g, " ");
  const isPdfUrl = (value = "") =>
    /^https:\/\/res\.cloudinary\.com\/.+\/raw\/upload\/.+\.pdf(?:[?#].*)?$/i.test(value);

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
    : "";

  const readingTime = useMemo(() => {
    const isFilePost = post?.isFile || isPdfUrl(post?.content);
    const content = isFilePost ? post?.title || "" : stripHtmlTags(post?.content || "");
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [post]);

  const truncatedTitle =
    post?.title && post.title.length > 40 ? `${post.title.slice(0, 40)}...` : post?.title;

  const categories = [
    { slug: "tin-tuc", label: "Tin tức" },
    { slug: "su-kien", label: "Sự kiện" },
    { slug: "phu-huynh", label: "Phụ huynh" },
  ];

  const isFilePost = post?.isFile || isPdfUrl(post?.content);

  useEffect(() => {
    if (!isFilePost || !pdfContainerRef.current) return undefined;

    const updatePdfWidth = () => {
      const containerWidth = pdfContainerRef.current?.clientWidth || 320;
      setPdfWidth(Math.max(280, Math.min(containerWidth - 16, 1040)));
    };

    updatePdfWidth();
    const resizeObserver = new ResizeObserver(updatePdfWidth);
    resizeObserver.observe(pdfContainerRef.current);

    return () => resizeObserver.disconnect();
  }, [isFilePost]);

  useEffect(() => {
    setPdfPages(0);
    setPdfError("");
  }, [post?.content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="school-container py-16 text-center font-semibold text-red-600">
        Không thể tải bài viết.
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-[2000px] grid-cols-1 gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:grid-cols-3 lg:gap-8 lg:px-8 lg:py-10 xl:px-10">
      <div className="lg:col-span-2">
        {post && (
          <>
            <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-1.5 rounded-card bg-white/70 px-3 py-2 text-xs text-gray-500 shadow-sm sm:gap-2 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:shadow-none">
              <Link to="/" className="hover:text-primary">Trang chủ</Link>
              <span>&gt;</span>
              <Link to="/tin-tuc" className="hover:text-primary">Tin tức</Link>
              <span>&gt;</span>
              <span className="font-bold text-primary">{truncatedTitle}</span>
            </nav>

            <article className="mt-5 sm:mt-8">
              <header className="mx-auto max-w-5xl">
                <h1 className="text-left font-heading text-2xl font-bold leading-snug text-slate-900 sm:text-3xl md:text-center">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center justify-start gap-2 rounded-card bg-white/80 p-3 text-xs font-semibold text-gray-500 shadow-sm sm:bg-transparent sm:p-0 sm:text-sm sm:shadow-none md:justify-center">
                  {formattedDate && (
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarAlt aria-hidden="true" />
                      {formattedDate}
                    </span>
                  )}
                  <span className="hidden sm:inline">·</span>
                  <Link
                    to={`/${post.category}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white"
                  >
                    <FaTag aria-hidden="true" />
                    {getCategoryDisplayName(post.category)}
                  </Link>
                  <span className="hidden sm:inline">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <FaClock aria-hidden="true" />
                    {readingTime} phút đọc
                  </span>
                </div>
              </header>

              {!isFilePost && (
                <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-xl sm:mt-8">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="max-h-[240px] w-full object-contain sm:max-h-[320px] lg:max-h-[360px]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex min-h-[180px] items-center justify-center bg-primary px-6 text-center font-heading text-xl font-extrabold text-white sm:min-h-[220px] sm:text-2xl">
                      Trường Tiểu học Nam Phước 1
                    </div>
                  )}
                </div>
              )}

              <div className="post-content mx-auto mt-6 w-full max-w-4xl break-words font-body text-[15px] leading-7 text-gray-700 sm:mt-8 sm:text-base sm:leading-relaxed">
                {isFilePost ? (
                  <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
                    <div
                      ref={pdfContainerRef}
                      className="overflow-x-auto bg-slate-100 px-1 py-3 sm:px-3 sm:py-4"
                    >
                      {pdfError ? (
                        <div className="mx-auto max-w-xl rounded-xl bg-white p-5 text-center text-sm font-semibold text-red-600">
                          {pdfError}
                        </div>
                      ) : (
                        <Document
                          file={post.content}
                          loading={
                            <div className="flex min-h-[60vh] items-center justify-center">
                              <Spinner size="xl" />
                            </div>
                          }
                          error="Không thể hiển thị PDF. Vui lòng mở hoặc tải PDF bằng nút phía trên."
                          onLoadSuccess={({ numPages }) => {
                            setPdfPages(numPages);
                            setPdfError("");
                          }}
                          onLoadError={() =>
                            setPdfError(
                              "Không thể hiển thị PDF. Vui lòng mở hoặc tải PDF bằng nút phía trên."
                            )
                          }
                        >
                          {Array.from({ length: pdfPages }, (_, index) => (
                            <Page
                              key={`pdf-page-${index + 1}`}
                              pageNumber={index + 1}
                              width={pdfWidth}
                              className="mx-auto mb-4 w-fit overflow-hidden bg-white shadow-sm last:mb-0"
                              devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
                              renderAnnotationLayer
                              renderTextLayer
                            />
                          ))}
                        </Document>
                      )}
                    </div>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                )}
              </div>
            </article>
          </>
        )}
      </div>

      <aside className="self-start lg:sticky lg:top-28 lg:col-span-1">
        <section className="school-card p-4 sm:p-5">
          <h2 className="school-section-title text-lg sm:text-xl">Bài viết gần đây</h2>
          <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
            {recentPosts &&
              recentPosts.map((recentPost) => (
                <Link
                  key={recentPost._id}
                  to={`/${recentPost.slug}`}
                  className="flex gap-3 rounded-card p-2 transition hover:bg-blue-50"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-card bg-primary sm:h-20 sm:w-20">
                    {recentPost.image ? (
                      <img
                        src={recentPost.image}
                        alt={recentPost.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-bold text-white">
                        Nam Phước 1
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-heading text-sm font-extrabold leading-5 text-slate-800 sm:text-base">
                      {recentPost.title}
                    </h3>
                    {recentPost.createdAt && (
                      <time className="mt-2 block text-xs font-semibold text-gray-500">
                        {new Date(recentPost.createdAt).toLocaleDateString("vi-VN")}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </section>

        <section className="school-card mt-5 p-4 sm:mt-6 sm:p-5">
          <h2 className="school-section-title text-lg sm:text-xl">Danh mục</h2>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/${category.slug}`}
                className="rounded-full border border-primary px-3 py-1.5 font-heading text-sm font-extrabold text-primary transition hover:bg-primary hover:text-white sm:px-4 sm:py-2"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}
