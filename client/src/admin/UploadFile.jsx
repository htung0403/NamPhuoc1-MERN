import { useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { deletePdfFromStorage, uploadPdfToStorage, validateFile } from "../cloudinary";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import useCheckAuth from "./checkAuth.js";

const MAX_PDF_FILE_SIZE = 20 * 1024 * 1024;

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileStoragePath, setFileStoragePath] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ title: "" });
  const [category, setCategory] = useState("uncategorized");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  useCheckAuth();

  const handleUploadFile = async () => {
    try {
      if (!file) {
        setUploadError("Chưa chọn tệp");
        return;
      }
      const validation = validateFile(file, {
        images: { maxSize: 0, allowedTypes: [] },
        pdf: { maxSize: MAX_PDF_FILE_SIZE, allowedTypes: ["application/pdf"] },
      });
      if (!validation.valid) {
        setUploadError(validation.error);
        return;
      }
      setUploadError(null);
      const uploadedFile = await uploadPdfToStorage(
        file,
        (progress) => setUploadProgress(progress.toFixed(0))
      );
      setUploadProgress(null);
      setUploadError(null);
      setFileUrl(uploadedFile.url);
      setFileStoragePath(uploadedFile.path);
    } catch (uploadError) {
      setUploadError(uploadError.message || "Tải tệp thất bại");
      setUploadProgress(null);
    }
  };

  const handleDeleteFile = async () => {
    if (!fileStoragePath) {
      setUploadError("Không thể xác định tệp để xóa");
      return;
    }
    try {
      setDeleting(true);
      await deletePdfFromStorage(fileStoragePath);
      setFileUrl("");
      setFileStoragePath("");
      setFile(null);
      setUploadError(null);
    } catch {
      setUploadError("Xóa tệp thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreatePost = async () => {
    if (category === "uncategorized") {
      setError("Vui lòng chọn một danh mục.");
      return;
    }
    if (!fileUrl) {
      setUploadError("Chưa tải lên tệp");
      return;
    }

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: fileUrl,
          category,
          isFile: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUploadError(null);
        navigate(`/${data.slug}`);
      } else {
        const postErrorData = await res.json();
        setUploadError(postErrorData.message);
      }
    } catch {
      setUploadError("Đã xảy ra lỗi khi tạo bài đăng");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50/40 p-4 md:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-md"><h1 className="mb-8 text-center font-heading text-2xl font-bold text-primary">Tải lên tệp</h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost();
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-gray-700">Tiêu đề</span><TextInput
            className="[&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
            type="text"
            placeholder="Tiêu đề"
            required
            id="title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <HiOutlineDocumentText className="h-8 w-8" />
              </div>
              <div>
                <p className="font-heading text-base font-bold text-primary">Tệp PDF đính kèm</p>
                <p className="mt-1 text-sm text-gray-500">Chọn tệp PDF từ máy tính, dung lượng tối đa 20MB.</p>
                {file && <p className="mt-2 text-sm font-semibold text-gray-700">Đã chọn: {file.name}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <FileInput
                className="[&_input]:cursor-pointer [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:bg-white"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileUrl("");
                  setFileStoragePath("");
                }}
              />
              <Button
                type="button"
                className="rounded-xl border border-primary bg-white px-5 font-heading font-bold text-primary hover:bg-blue-50"
                size="sm"
                onClick={handleUploadFile}
                disabled={uploadProgress}
              >
                {uploadProgress ? (
                  <div className="h-12 w-12">
                    <CircularProgressbar value={uploadProgress} text={`${uploadProgress || 0}%`} />
                  </div>
                ) : (
                  "Tải tệp lên"
                )}
              </Button>
            </div>
          </div>
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        {fileUrl && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl">Xem tệp:</h2>
              <Button
                type="button"
                className="rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50"
                size="sm"
                onClick={handleDeleteFile}
                disabled={deleting}
              >
                {deleting ? "Đang xóa..." : "Xóa tệp"}
              </Button>
            </div>
            <iframe src={fileUrl} style={{ width: "100%", height: "800px" }} title="File Viewer" />
          </div>
        )}
        <Button type="submit" className="w-full rounded-xl bg-primary py-3 font-heading font-bold text-white hover:bg-primary-dark">
          Đăng
        </Button>
        {error && (
          <Alert className="mt-5" color="failure">
            {error}
          </Alert>
        )}
      </form>
      </div>
    </div>
  );
};

export default UploadFile;
