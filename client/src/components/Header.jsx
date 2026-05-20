import { Button, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineRight, AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../images/logo.png";
import "../index.css";

const dropdownClass =
  "absolute left-0 top-full z-50 hidden w-64 rounded-card border border-blue-50 bg-white p-2 shadow-xl group-hover:block";
const mobileDropdownClass =
  "static mt-2 block w-full rounded-card border border-blue-50 bg-blue-50/60 p-2 shadow-none";
const dropdownLinkClass =
  "block rounded-button px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-primary";
const navItemClass =
  "block w-full rounded-button px-3 py-2.5 text-left font-heading text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-primary lg:w-auto lg:text-center";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleSubMenu = (subMenu) => {
    setActiveSubMenu(activeSubMenu === subMenu ? null : subMenu);
  };

  return (
    <Navbar className="fixed left-0 top-0 z-20 w-full border-b border-blue-100 bg-white/95 px-2 py-2 shadow-sm backdrop-blur sm:px-3">
      <Link to="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none">
        <img src={logoImg} alt="Logo Trường Tiểu học Nam Phước 1" className="h-10 w-10 flex-shrink-0 object-contain sm:h-14 sm:w-14" />
        <div className="min-w-0 leading-tight">
          <p className="truncate font-heading text-[13px] font-extrabold text-primary sm:text-base">
            Trường Tiểu học Nam Phước 1
          </p>
          <p className="hidden text-xs font-semibold text-slate-500 sm:block">
            Nam Phước, Đà Nẵng
          </p>
        </div>
      </Link>

      <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 lg:order-2">
        <form onSubmit={handleSubmit} className="hidden lg:block">
          <TextInput
            type="text"
            placeholder="Tìm kiếm..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-52"
          />
        </form>
        <Button className="hidden h-10 w-10 rounded-button border-primary text-primary sm:inline-flex lg:hidden" color="light" pill>
          <AiOutlineSearch aria-hidden="true" />
        </Button>
        <Navbar.Toggle className="rounded-button text-primary hover:bg-blue-50 focus:ring-primary" />
      </div>

      <Navbar.Collapse className="mt-3 max-h-[calc(100vh-76px)] overflow-y-auto rounded-card border border-blue-50 bg-white p-2 shadow-lg lg:order-1 lg:mt-0 lg:max-h-none lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <form onSubmit={handleSubmit} className="mb-3 block lg:hidden">
          <TextInput
            type="text"
            placeholder="Tìm kiếm..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>
        <div className="relative group">
          <button
            type="button"
            className={navItemClass}
            onClick={isMobile ? () => toggleMenu("gioi-thieu") : undefined}
          >
            GIỚI THIỆU
          </button>
          <div className={isMobile && activeMenu === "gioi-thieu" ? mobileDropdownClass : dropdownClass}>
            <Link to="/gioi-thieu/thu-ngo" className={dropdownLinkClass}>
              THÔNG ĐIỆP
            </Link>
            <div className="relative sub-menu">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-button px-4 py-2 text-left text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-primary"
                onClick={isMobile ? () => toggleSubMenu("co-cau-to-chuc") : undefined}
              >
                CƠ CẤU TỔ CHỨC
                <AiOutlineRight />
              </button>
              <div
                className={`${isMobile ? (activeSubMenu === "co-cau-to-chuc" ? "block" : "hidden") : "absolute left-full top-0 hidden w-64 rounded-card border border-blue-50 bg-white p-2 shadow-xl sub-menu-hover:block"}`}
              >
                <Link to="/chi-bo-dang" className={dropdownLinkClass}>CHI BỘ ĐẢNG</Link>
                <Link to="/ban-giam-hieu" className={dropdownLinkClass}>BAN GIÁM HIỆU</Link>
                <Link to="/ban-chap-hanh-cong-doan" className={dropdownLinkClass}>BAN CHẤP HÀNH CÔNG ĐOÀN</Link>
                <Link to="/cac-to-chuyen-mon" className={dropdownLinkClass}>CÁC TỔ CHUYÊN MÔN</Link>
              </div>
            </div>
          </div>
        </div>

        <Link to="/chuong-trinh-tieu-chuan-bo-gddt" className={navItemClass}>
          CHƯƠNG TRÌNH
        </Link>

        <Link to="/van-ban-cong-khai" className={navItemClass}>
          VĂN BẢN CÔNG KHAI
        </Link>

        <div className="relative group">
          <button
            type="button"
            className={navItemClass}
            onClick={isMobile ? () => toggleMenu("phu-huynh") : undefined}
          >
            PHỤ HUYNH
          </button>
          <div className={isMobile && activeMenu === "phu-huynh" ? mobileDropdownClass : dropdownClass}>
            <Link to="/phu-huynh" className={dropdownLinkClass}>
              THÔNG BÁO CHUNG
            </Link>
          </div>
        </div>

        <div className="relative group">
          <button
            type="button"
            className={navItemClass}
            onClick={isMobile ? () => toggleMenu("hoat-dong") : undefined}
          >
            HOẠT ĐỘNG
          </button>
          <div className={isMobile && activeMenu === "hoat-dong" ? mobileDropdownClass : dropdownClass}>
            <Link to="/tin-tuc" className={dropdownLinkClass}>TIN TỨC</Link>
            <Link to="/su-kien" className={dropdownLinkClass}>SỰ KIỆN</Link>
          </div>
        </div>

        <Link to="/lien-he" className={navItemClass}>
          LIÊN HỆ
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
