import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashProfile from './components/DashProfile.jsx';
import DashSidebar from './components/DashSidebar.jsx';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DashPosts from './components/DashPosts.jsx';
import HomeImages from './HomeImages.jsx';
import Cookies from 'js-cookie';
import { signOutSuccess } from '../redux/user/userSlice.js';
import useCheckAuth from "./checkAuth.js";



export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const checkTokenExpiry = () => {      
      const accessToken = Cookies.get('access_token');

      if (!accessToken) {
        navigate('/admin/dang-nhap');
        return;
      }

      try {
        const [header, payload, signature] = accessToken.split('.');
        const decodedToken = JSON.parse(atob(payload));
        const expiryTime = decodedToken.exp * 1000;
        if (Date.now() >= expiryTime) {
          dispatch(signOutSuccess());
          navigate('/admin/dang-nhap');
        }
      } catch (error) {
        navigate('/admin/dang-nhap');
      }
    };

    checkTokenExpiry(); // Check immediately on component mount
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  useCheckAuth();

  return(
    <div className='min-h-[calc(100vh-80px)] bg-blue-50/40 font-body md:flex'>
      <div className='md:w-56 md:shrink-0'>
        {/* Side bar */}
        <DashSidebar/>
      </div>
      {/* Profile */}
      {tab==='ho-so' && <DashProfile/>}
      {/* Post */}
      {tab === 'bai-dang' && <DashPosts/>}
      {tab === 'anh-trang-chu' && currentUser?.isAdmin && <HomeImages/>}
    </div>
  )
}
