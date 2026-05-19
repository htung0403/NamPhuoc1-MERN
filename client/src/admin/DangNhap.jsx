import { Alert, Spinner } from 'flowbite-react';
import React, { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi';
import logoImg from '../images/logo.png';
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice.js';


export default function DangNhap() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const navigate = useNavigate();
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:5173/api';
  const handleChage = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Vui lòng điền đầy đủ thông tin!'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        console.log('Cookies after login:', document.cookie); // Log cookies after login
        navigate('/dashboard?tab=ho-so');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-10 font-body'>
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-md">
        <div className="mb-8 text-center">
          <img src={logoImg} alt="Trường Tiểu học Nam Phước 1" className="mx-auto mb-4 h-20 w-20 object-contain" />
          <h1 className="font-heading text-2xl font-bold text-primary">Đăng nhập tài khoản</h1>
          <p className="mt-2 text-sm text-gray-500">Trường Tiểu học Nam Phước 1</p>
        </div>

        <form className='flex flex-col space-y-5' onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">Số điện thoại</span>
            <input
              type="email"
              id='email'
              placeholder="Email hoặc số điện thoại"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={handleChage}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">Mật khẩu</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                placeholder="*********"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                onChange={handleChage}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 transition hover:text-primary"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
              </button>
            </div>
          </label>
          <button className="flex w-full items-center justify-center rounded-xl bg-primary py-3 font-heading font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70" disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Đăng nhập'
            }
          </button>
          {
            errorMessage && (
              <Alert className='flex justify-center items-center text-lg' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </form>
      </div>
    </div>
  )
}
