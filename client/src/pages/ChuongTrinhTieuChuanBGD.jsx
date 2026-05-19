import React from "react";
import img from "../images/background_card/image.png";

export default function ChuongTrinhTieuChuanBGD() {
  document.title =
    "CHƯƠNG TRÌNH TIÊU CHUẨN BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  return (
    <div className="school-container py-8 sm:py-12">
      <h1 className="school-section-title text-2xl sm:text-3xl">
        Chương trình tiêu chuẩn Bộ Giáo dục và Đào tạo
      </h1>
      <section className="school-card mt-6 grid grid-cols-1 gap-6 overflow-hidden p-5 sm:p-6 md:grid-cols-2 md:gap-8">
        <img
          src={img}
          alt="Hoạt động chương trình học tại Trường Tiểu học Nam Phước 1"
          className="h-56 w-full rounded-card object-cover sm:h-72 md:h-full"
          loading="lazy"
        />
        <div>
          <h2 className="font-heading text-xl font-extrabold text-slate-900 sm:text-2xl">
            Định hướng các chương trình trong nhà trường
          </h2>
          <p className="mt-4 text-justify text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Các chương trình giáo dục của trường Tiểu học Nam Phước 1 hướng tới
            mục tiêu đào tạo và chuẩn bị cho học sinh nền tảng tốt nhất để trở
            thành công dân toàn cầu có kỹ năng Thế kỷ 21: vừa am hiểu kiến thức,
            sử dụng được ngoại ngữ, vừa có các kỹ năng tư duy và kỹ năng sống cần
            thiết cho bản thân, sẵn sàng hội nhập quốc tế.
          </p>
          <p className="mt-4 text-justify text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Sau khi kết thúc chương trình học, các em học sinh có thể tự tin
            chuyển cấp trong hệ thống, hoặc thi vào các trường chuyên, công lập,
            ngoài công lập, song ngữ và quốc tế.
          </p>
        </div>
      </section>
    </div>
  );
}
