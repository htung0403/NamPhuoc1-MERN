import { Footer } from "flowbite-react";
import { BsFacebook } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="mt-10 bg-blue-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 text-sm text-slate-700 sm:grid-cols-2">
          <div className="school-card p-5 shadow-none">
            <Footer.Title className="font-heading font-extrabold text-primary" title="Thông tin" />
            <p className="mt-3 leading-7">
              <strong>Hiệu trưởng:</strong> Võ Quý
              <br />
              <strong>Website:</strong> namphuoc1.edu.vn
              <br />
              <strong>Email:</strong> voquy711np1@gmail.com
            </p>
          </div>
          <div className="school-card p-5 shadow-none">
            <Footer.Title className="font-heading font-extrabold text-primary" title="Địa chỉ" />
            <p className="mt-3 leading-7">
              Nam Phước, Đà Nẵng
              <br />
              Hotline: (024) 3787 0338
            </p>
          </div>
        </div>
        <Footer.Copyright
          className="mt-6 text-center text-xs font-bold text-slate-600 sm:text-sm"
          href="#"
          by="Trường Tiểu học Nam Phước 1 - Đà Nẵng."
          year={new Date().getFullYear()}
        />
      </div>
    </Footer>
  );
}
