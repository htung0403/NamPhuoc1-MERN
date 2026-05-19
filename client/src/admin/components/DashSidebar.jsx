import React from "react";
import { HiArrowSmRight, HiDocumentText, HiPhotograph, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:3005/api';
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const dispatch = useDispatch();
  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_URL}/user/signout`, {
        method: "POST",
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate('/admin/dang-nhap');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const navItemClass = (active) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-sm font-bold transition ${
      active
        ? "bg-[#E8F4FD] text-primary"
        : "text-gray-600 hover:bg-blue-50 hover:text-primary"
    }`;

  return (
    <aside className="h-full w-full border-l-4 border-primary bg-white px-3 py-5 shadow-sm md:min-h-[calc(100vh-80px)] md:w-56">
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard?tab=ho-so" className={navItemClass(tab === "ho-so")}>
          <HiUser className="h-5 w-5" />
          <span>Hồ sơ</span>
          {currentUser.isAdmin && (
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Admin</span>
          )}
        </Link>
        {currentUser.isAdmin && (
          <>
            <Link to="/dashboard?tab=bai-dang" className={navItemClass(tab === "bai-dang")}>
              <HiDocumentText className="h-5 w-5" />
              <span>Bài đăng</span>
            </Link>
            <Link to="/dashboard?tab=anh-trang-chu" className={navItemClass(tab === "anh-trang-chu")}>
              <HiPhotograph className="h-5 w-5" />
              <span>Ảnh trang chủ</span>
            </Link>
          </>
        )}

        <button
          type="button"
          className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left font-heading text-sm font-bold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          onClick={handleSignout}
        >
          <HiArrowSmRight className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );}
