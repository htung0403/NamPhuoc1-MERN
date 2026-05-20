import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import GioiThieu from './pages/GioiThieu';
import DangKy from './admin/DangKy';
import Dashboard from './admin/Dashboard';
import LienHe from './pages/LienHe';
import TuyenSinh from './pages/TuyenSinh';
import DangNhap from './admin/DangNhap';
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
import ChuongTrinhTieuChuanBGD from './pages/ChuongTrinhTieuChuanBGD';
import TinTuc from './pages/TinTuc';
import SuKien from './pages/SuKien';
import Search from './pages/Search';
import CacToChuyenMon from './pages/CacToChuyenMon';
import BanChapHanhCongDoan from './pages/BanChapHanhCongDoan';
import BanGiamHieu from './pages/BanGiamHieu';
import ChiBoDang from './pages/ChiBoDang';
import PhuHuynh from './pages/PhuHuynh';
import VanBanCongKhai from './pages/VanBanCongKhai';

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
        <Route path='/tuyensinh' element={<PublicLayout><TuyenSinh /></PublicLayout>} />
        <Route path='/tin-tuc' element={<PublicLayout><TinTuc /></PublicLayout>} />
        <Route path='/su-kien' element={<PublicLayout><SuKien /></PublicLayout>} />
        <Route path='/chuong-trinh-tieu-chuan-bo-gddt' element={<PublicLayout><ChuongTrinhTieuChuanBGD /></PublicLayout>} />
        <Route path='/cac-to-chuyen-mon' element={<PublicLayout><CacToChuyenMon /></PublicLayout>} />
        <Route path='/ban-chap-hanh-cong-doan' element={<PublicLayout><BanChapHanhCongDoan /></PublicLayout>} />
        <Route path='/ban-giam-hieu' element={<PublicLayout><BanGiamHieu /></PublicLayout>} />
        <Route path='/chi-bo-dang' element={<PublicLayout><ChiBoDang /></PublicLayout>} />
        <Route path='/phu-huynh' element={<PublicLayout><PhuHuynh /></PublicLayout>} />
        <Route path='/van-ban-cong-khai' element={<PublicLayout><VanBanCongKhai /></PublicLayout>} />
        <Route path='/admin/dang-nhap' element={<AdminLayout><DangNhap /></AdminLayout>} />
        <Route path='/:postSlug' element= {<PublicLayout><PostPage/></PublicLayout>} />
        <Route path='/search' element= {<PublicLayout><Search/></PublicLayout>} />
        {/* Admin Routes */}
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path='/admin' element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path='/admin/dang-ky' element={<AdminLayout><DangKy /></AdminLayout>} />
          <Route path='/upload-file' element={<AdminLayout><UploadFile /></AdminLayout>} />
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
