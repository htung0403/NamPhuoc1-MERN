import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GioiThieu from './pages/GioiThieu';
import DangKy from './admin/DangKy';
import Dashboard from './admin/Dashboard';
import LienHe from './pages/LienHe';
import TuyenSinh from './pages/TuyenSinh';
import DangNhap from './admin/DangNhap';
import Profile from './admin/Profile';
import PublicLayout from './layout/PublicLayout';
import AdminLayout from './layout/AdminLayout';
import './index.css';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import TaoBaiViet from './admin/TaoBaiViet';
import UpdatePost from './admin/SuaBaiViet';
import PostPage from './pages/PostPage';
import ThuNgo from './pages/ThuNgo';
import UploadFile from './admin/UploadFile';

export default function App() {
  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<PublicLayout><Home /></PublicLayout>} />
        <Route path='/gioi-thieu' element={<PublicLayout><GioiThieu /></PublicLayout>} />
        <Route path='/gioi-thieu/thu-ngo' element={<PublicLayout><ThuNgo /></PublicLayout>} />
        <Route path='/lien-he' element={<PublicLayout><LienHe /></PublicLayout>} />
        <Route path='/tuyensinh' element={<PublicLayout><TuyenSinh /></PublicLayout>} />+
        <Route path='/admin/dang-nhap' element={<AdminLayout><DangNhap /></AdminLayout>} />
        <Route path='/:postSlug' element= {<PublicLayout><PostPage/></PublicLayout>} />
        {/* Admin Routes */}
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path='/admin' element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path='/admin/dang-ky' element={<AdminLayout><DangKy /></AdminLayout>} />
          <Route path='/admin/thong-tin' element={<AdminLayout><Profile></Profile></AdminLayout>}/>
          <Route path='/upload-file-word' element={<AdminLayout><UploadFile /></AdminLayout>} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path='/create-post' element={<AdminLayout><TaoBaiViet /></AdminLayout>} />
          <Route path='/sua-bai-viet/:postId' element={<AdminLayout><UpdatePost /></AdminLayout>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </React.StrictMode>
  );
}