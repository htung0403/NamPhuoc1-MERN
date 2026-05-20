import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill, { Quill } from "react-quill";
import imageResize from "quill-image-resize-module-react";
import { uploadToCloudinary, validateFile, deleteFromCloudinary } from "../cloudinary";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import imageHandler from "./components/imageHandler";
import "quill/dist/quill.snow.css";
import { HiOutlineCloudUpload } from "react-icons/hi";
import useCheckAuth from "./checkAuth.js";

export default function UpdatePost() {
  Quill.register("modules/imageResize", imageResize);
  document.title = `Sửa bài viết - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1`;

  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const [category, setCategory] = useState("uncategorized");
  const [error, setError] = useState("");

  useCheckAuth();

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link", "image", "video"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data.posts[0]);
        setCategory(data.posts[0].category || "uncategorized");
      } catch {
        setPublishError("Đã xảy ra lỗi");
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Chưa chọn ảnh nền");
        return;
      }
      const validation = validateFile(file);
      if (!validation.valid) {
        setImageUploadError(validation.error);
        return;
      }
      setImageUploadError(null);
      const downloadURL = await uploadToCloudinary(
        file,
        "postImages",
        "image",
        (progress) => setImageUploadProgress(progress.toFixed(0))
      );
      setImageUploadProgress(null);
      setImageUploadError(null);
      setFormData({ ...formData, image: downloadURL });
    } catch {
      setImageUploadError("Tải ảnh thất bại");
      setImageUploadProgress(null);
    }
  };

  const extractPublicId = (url) => {
    try {
      const parts = new URL(url).pathname.split("/");
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex === -1) return null;
      const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
      const dotIndex = publicIdWithExt.lastIndexOf(".");
      return dotIndex === -1 ? publicIdWithExt : publicIdWithExt.substring(0, dotIndex);
    } catch {
      return null;
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.image) return;
    const publicId = extractPublicId(formData.image);
    if (!publicId) {
      setImageUploadError("Không thể xác định public ID của ảnh");
      return;
    }
    try {
      await deleteFromCloudinary(publicId, "image");
      setFormData({ ...formData, image: "" });
    } catch {
      setImageUploadError("Xóa ảnh thất bại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category === "uncategorized") {
      setError("Vui lòng chọn một danh mục.");
      return;
    }
    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`/${data.slug}`);
    } catch {
      setPublishError("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50/40 p-4 md:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-md"><h1 className="mb-8 text-center font-heading text-2xl font-bold text-primary">Chỉnh sửa bài viết</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Tiêu đề</span><TextInput
            className="[&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
            type="text"
            placeholder="Tiêu đề"
            required
            id="title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
          </label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Danh mục</span><Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFormData({ ...formData, category: e.target.value });
            }}
            className="[&_select]:rounded-xl [&_select]:border-gray-200 [&_select]:px-4 [&_select]:py-3 [&_select]:focus:border-primary [&_select]:focus:ring-2 [&_select]:focus:ring-primary/20"
            required
          >
            <option value="uncategorized">Chọn một danh mục</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="phu-huynh">Phụ huynh</option>
            <option value="van-ban-cong-khai">Văn bản công khai</option>
          </Select>
          </label>
        </div>
        <div className="rounded-2xl border border-dashed border-primary/40 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition hover:border-primary/70 hover:shadow-md">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HiOutlineCloudUpload className="h-8 w-8" />
              </div>
              <div>
                <p className="font-heading text-base font-bold text-primary">Ảnh bìa bài viết</p>
                <p className="mt-1 text-sm text-gray-500">Kéo thả ảnh vào đây hoặc chọn từ máy tính. Hỗ trợ JPG, PNG, WEBP.</p>
                {file && <p className="mt-2 text-sm font-semibold text-gray-700">Đã chọn: {file.name}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <FileInput
                className="[&_input]:cursor-pointer [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:bg-white"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="button"
                className="rounded-xl border border-primary bg-white px-5 font-heading font-bold text-primary hover:bg-blue-50"
                size="sm"
                onClick={handleUpdloadImage}
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="h-12 w-12">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    />
                  </div>
                ) : (
                  "Tải ảnh lên"
                )}
              </Button>
            </div>
          </div>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <div className="relative">
            <img src={formData.image} alt="upload" className="w-full h-72 object-contain" />
            <Button
              type="button"
              color="failure"
              size="xs"
              className="absolute top-2 right-2"
              onClick={handleDeleteImage}
            >
              Xóa ảnh
            </Button>
          </div>
        )}
        {formData?.isFile ? (
          <iframe src={formData.content} title="File Preview" width="100%" height="800px" />
        ) : (
          <div className="quill-editor overflow-hidden rounded-xl border border-gray-200 bg-white [&_.ql-container]:rounded-b-xl [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-gray-200">
            <ReactQuill
              modules={modules}
              theme="snow"
              placeholder="Nội dung..."
              className="min-h-72 mb-12"
              required
              value={formData.content}
              onChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
            />
          </div>
        )}
        <Button type="submit" className="w-full rounded-xl bg-primary py-3 font-heading font-bold text-white hover:bg-primary-dark">
          Đăng
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
        {error && (
          <Alert className="mt-5" color="failure">
            {error}
          </Alert>
        )}
      </form>
      </div>
    </div>
  );
}
