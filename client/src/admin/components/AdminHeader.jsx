import { Button, Navbar, Dropdown, Avatar } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch, AiOutlineRight } from 'react-icons/ai'
import '../../index.css';
import {useSelector, useDispatch} from 'react-redux'
import { signOutSuccess } from '../../redux/user/userSlice';
import logoImg from '../../images/logo.png'


export default function AdminHeader() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:3005/api';
  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_URL}/user/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Navbar className='relative z-50 border-b border-blue-100 bg-white py-3 shadow-sm'>
        <Link to="/" className='self-center'>
          <img src={logoImg} alt="Logo" className='ml-3 h-14 w-14 object-contain md:ml-[100px]' />
        </Link>
        <Navbar.Toggle/>
        <Navbar.Collapse>
          <div className='relative group'>
              <Link to='/create-post'>
                <div className='cursor-pointer rounded-xl border border-primary px-4 py-2 font-heading text-sm font-bold text-primary transition hover:bg-blue-50'>
                  ĐĂNG BÀI VIẾT
                </div>
              </Link>
          </div>
          <div className='relative group'>
              <Link to='/upload-file'>
                <div className='cursor-pointer rounded-xl border border-primary px-4 py-2 font-heading text-sm font-bold text-primary transition hover:bg-blue-50'>
                  ĐĂNG TỆP PDF
                </div>
              </Link>
          </div>
        </Navbar.Collapse>
        {currentUser? (
            <Dropdown
            arrowIcon= {false}
            inline
            label= {
                <Avatar
                className='cursor-pointer rounded-full ring-0 transition hover:ring-2 hover:ring-primary'
                alt='user' 
                img={currentUser.profilePicture}
                rounded/>
            }>
                <Dropdown.Header>
                    <span className='block text-sm'>@{currentUser.username}</span>
                    <span className='block text-sm font-medium truncate'>{currentUser.fullName}</span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=ho-so'}>
                    <Dropdown.Item>
                        Hồ sơ
                    </Dropdown.Item>
                </Link>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={handleSignout}>Đăng xuất</Dropdown.Item>
            </Dropdown>
        ): (
            <Link to='/admin/dang-nhap'>
                <Button className='border border-primary bg-white text-primary hover:bg-blue-50'>
                    Đăng nhập
                </Button>
            </Link>
        )
        }
    </Navbar>
  )
}
