import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { mergeHomeImages } from "../homeImages";
import { uploadToCloudinary, validateFile } from "../cloudinary";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://namphuoc1.edu.vn/api"
    : "http://localhost:3005/api";

const editableSections = [
  { key: "heroImages", title: "Ảnh slider đầu trang", imageField: "src" },
  { key: "highlightCards", title: "Ảnh 3 thẻ nổi bật", imageField: "image" },
  { key: "galleryImages", title: "Ảnh thư viện cuối trang", imageField: "src" },
];

const toEditableValue = (images) => ({
  heroImages: images.heroImages.map(({ src, alt }) => ({ src, alt })),
  highlightCards: images.highlightCards.map(({ image }) => ({ image })),
  beliefImage: { ...images.beliefImage },
  galleryImages: images.galleryImages.map(({ src, alt }) => ({ src, alt })),
});

export default function HomeImages() {
  const [formData, setFormData] = useState(() => toEditableValue(mergeHomeImages()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/home-images`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Không thể tải cấu hình ảnh");
        setFormData(toEditableValue(mergeHomeImages(data.value)));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const updateArrayItem = (sectionKey, index, field, value) => {
    setFormData((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateBeliefImage = (field, value) => {
    setFormData((current) => ({
      ...current,
      beliefImage: { ...current.beliefImage, [field]: value },
    }));
  };

  const handleUpload = async (file, onUploaded) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setError("");
      const imageUrl = await uploadToCloudinary(file, "homeImages", "image");
      onUploaded(imageUrl);
    } catch (uploadError) {
      setError(uploadError.message || "Tải ảnh thất bại");
    } finally {
      setUploadingKey("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/settings/home-images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value: formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lưu cấu hình ảnh thất bại");
      setFormData(toEditableValue(mergeHomeImages(data.value)));
      setMessage("Đã lưu ảnh trang chủ");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const renderImageEditor = ({ label, imageUrl, alt, onImageChange, onAltChange, uploadKey }) => (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="mb-3 font-heading font-semibold text-slate-800">{label}</p>
      <img src={imageUrl} alt={alt || label} className="mb-4 h-44 w-full rounded-xl object-cover shadow-sm" />
      <div className="space-y-3">
        <TextInput className="[&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20" value={imageUrl} placeholder="URL ảnh" onChange={(event) => onImageChange(event.target.value)} />
        {onAltChange && (
          <TextInput className="[&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20" value={alt} placeholder="Mô tả ảnh" onChange={(event) => onAltChange(event.target.value)} />
        )}
        <FileInput className="[&_input]:cursor-pointer [&_input]:rounded-lg [&_input]:border-primary [&_input]:text-primary"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploadingKey(uploadKey);
            handleUpload(file, onImageChange);
          }}
          disabled={Boolean(uploadingKey)}
        />
        {uploadingKey === uploadKey && <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>}
      </div>
    </div>
  );

  if (loading) {
    return <div className="w-full p-6 text-center">Đang tải cấu hình ảnh...</div>;
  }

  return (
    <div className="w-full bg-blue-50/40 p-4 pb-28 md:p-6 md:pb-28">
      <div className="w-full">
        <div className="mb-6 rounded-2xl border-l-4 border-primary bg-white p-5 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-primary">Chỉnh sửa ảnh trang chủ</h1>
          <p className="mt-1 text-slate-600">Cập nhật ảnh đang hiển thị trên trang Home.</p>
        </div>

        {message && <Alert color="success" className="mb-4">{message}</Alert>}
        {error && <Alert color="failure" className="mb-4">{error}</Alert>}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {editableSections.map((section) => (
            <section key={section.key} className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-heading text-xl font-bold text-slate-800">{section.title}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {formData[section.key].map((item, index) =>
                  renderImageEditor({
                    label: `${section.title} ${index + 1}`,
                    imageUrl: item[section.imageField],
                    alt: item.alt || "",
                    onImageChange: (value) => updateArrayItem(section.key, index, section.imageField, value),
                    onAltChange:
                      section.imageField === "src"
                        ? (value) => updateArrayItem(section.key, index, "alt", value)
                        : null,
                    uploadKey: `${section.key}-${index}`,
                  })
                )}
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-heading text-xl font-bold text-slate-800">Ảnh phần giới thiệu</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {renderImageEditor({
                label: "Ảnh nội dung giới thiệu",
                imageUrl: formData.beliefImage.src,
                alt: formData.beliefImage.alt,
                onImageChange: (value) => updateBeliefImage("src", value),
                onAltChange: (value) => updateBeliefImage("alt", value),
                uploadKey: "beliefImage",
              })}
            </div>
          </section>

          <div className="fixed bottom-0 right-0 z-20 left-0 md:left-56 border-t border-blue-100 bg-white/95 flex justify-end px-4 py-4 pr-8 shadow-lg backdrop-blur"><Button type="submit" className="rounded-xl bg-primary px-8 py-3 font-heading font-bold text-white hover:bg-primary-dark" disabled={saving || Boolean(uploadingKey)}>
            {saving ? "Đang lưu..." : "Lưu ảnh trang chủ"}
          </Button></div>
        </form>
      </div>
    </div>
  );
}
