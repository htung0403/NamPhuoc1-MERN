import { Link } from "react-router-dom";

export const getCategoryDisplayName = (category) => {
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

export const stripHtmlTags = (html = "") => {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export default function PostCard({ post }) {
  const excerpt = !post?.isFile ? stripHtmlTags(post?.content).trim() : "";
  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
    : "";

  return (
    <article className="group school-card flex h-full overflow-hidden border border-blue-50 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/${post.slug}`} className="flex w-full flex-col">
        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary to-accent">
          {post?.image ? (
            <img
              src={post.image}
              alt={post.title || "Tin tức Trường Tiểu học Nam Phước 1"}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center font-heading text-lg font-extrabold text-white">
              Trường Tiểu học Nam Phước 1
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-primary">
              {getCategoryDisplayName(post?.category)}
            </span>
            {formattedDate && (
              <time className="text-xs font-semibold text-slate-500">
                {formattedDate}
              </time>
            )}
          </div>
          <h3 className="line-clamp-2 font-heading text-lg font-extrabold text-slate-900 transition group-hover:text-primary">
            {post?.title}
          </h3>
          {excerpt && (
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {excerpt}
            </p>
          )}
          <span className="mt-auto text-sm font-extrabold text-primary">
            Đọc bài viết
          </span>
        </div>
      </Link>
    </article>
  );
}
