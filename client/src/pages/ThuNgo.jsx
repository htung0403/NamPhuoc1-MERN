import React from "react";

export default function ThuNgo() {
  document.title = "THÔNG ĐIỆP NĂM HỌC - TRƯỜNG TIỂU HỌC NAM PHƯỚC 1";

  const quotationMarkImg =
    "https://firebasestorage.googleapis.com/v0/b/namphuoc1-web.appspot.com/o/quotation-mark-min.png?alt=media&token=c67acbf3-e857-4699-bdd5-d27682427aef";

  return (
    <div className="school-container py-8 sm:py-12">
      <h1 className="school-section-title text-2xl sm:text-3xl">Thông điệp năm học</h1>
      <section className="school-card mt-6 overflow-hidden bg-amber-50 p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <img
            src={quotationMarkImg}
            alt="Dấu trích dẫn thông điệp năm học"
            className="h-10 w-10 flex-shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <div className="text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            <p className="text-justify">
              Nhà trường luôn mong muốn mỗi học sinh đến lớp với niềm vui, sự tự
              tin và tinh thần khám phá. Thầy cô đồng hành cùng các em trong từng
              bài học, từng hoạt động để nuôi dưỡng tình yêu thương, tính kỷ luật
              và khát vọng vươn lên.
            </p>
            <p className="mt-5 font-heading font-bold text-primary">
              Trường Tiểu học Nam Phước 1
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
