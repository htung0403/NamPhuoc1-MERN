import React, { useState } from "react";

const initialValues = {
  name: "",
  email: "",
  message: "",
};

export default function LienHe() {
  document.title = "THÔNG TIN LIÊN HỆ - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    if (name === "name" && !value.trim()) return "Vui lòng nhập họ và tên.";
    if (name === "email") {
      if (!value.trim()) return "Vui lòng nhập email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email chưa đúng định dạng.";
    }
    if (name === "message") {
      if (!value.trim()) return "Vui lòng nhập nội dung liên hệ.";
      if (value.trim().length < 10) return "Nội dung cần ít nhất 10 ký tự.";
    }
    return "";
  };

  const errors = {
    name: validateField("name", values.name),
    email: validateField("email", values.email),
    message: validateField("message", values.message),
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (Object.values(errors).some(Boolean)) return;

    setSubmitted(true);
    setValues(initialValues);
    setTouched({});
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <p className="mt-2 text-sm font-semibold text-red-600">{errors[field]}</p>
    ) : null;

  return (
    <div className="school-container py-8 sm:py-12">
      <h1 className="school-section-title text-2xl sm:text-3xl">Liên hệ</h1>

      <div className="school-card mt-6 overflow-hidden p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
              Trường Tiểu học Nam Phước 1
            </h2>
            <div className="mt-5 space-y-3 text-base leading-7 text-slate-700 sm:mt-6 sm:text-lg">
              <p><b>Địa chỉ:</b> Xã Nam Phước, Thành phố Đà Nẵng</p>
              <p><b>Điện thoại:</b> 0867 795 587</p>
              <p><b>Email:</b> voquy711np1@gmail.com</p>
              <p><b>Website:</b> namphuoc1.edu.vn</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4 sm:mt-8 sm:space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="font-heading font-bold text-slate-800">
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-2 w-full rounded-button border border-blue-100 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:py-3"
                  placeholder="Nhập họ và tên"
                />
                {renderError("name")}
              </div>

              <div>
                <label htmlFor="email" className="font-heading font-bold text-slate-800">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-2 w-full rounded-button border border-blue-100 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:py-3"
                  placeholder="email@example.com"
                />
                {renderError("email")}
              </div>

              <div>
                <label htmlFor="message" className="font-heading font-bold text-slate-800">
                  Nội dung
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  className="mt-2 w-full rounded-button border border-blue-100 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:py-3"
                  placeholder="Nhập nội dung cần liên hệ"
                />
                {renderError("message")}
              </div>

              <button type="submit" className="school-button w-full px-7 py-3 sm:w-auto">
                Gửi liên hệ
              </button>

              {submitted && (
                <p className="rounded-button bg-green-50 px-4 py-3 font-semibold text-green-700">
                  Cảm ơn quý phụ huynh! Nhà trường đã ghi nhận nội dung liên hệ.
                </p>
              )}
            </form>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.485887957558!2d108.2540624759958!3d15.831039884814457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314208b46c5d13a1%3A0xed7e7d1bcb0c5a8a!2zVHLGsOG7nW5nIFRp4buDdSBI4buNYyBT4buRIDEgTmFtIFBoxrDhu5tj!5e0!3m2!1sen!2sus!4v1724128452117!5m2!1sen!2sus"
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            loading="lazy"
            title="Bản đồ Trường Tiểu học Nam Phước 1"
            className="min-h-[300px] rounded-card sm:min-h-[420px]"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
