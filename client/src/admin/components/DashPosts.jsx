import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Modal,
  Button,

} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:3005/api';

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'tin-tuc':
        return 'Tin Tức';
      case 'su-kien':
        return 'Sự Kiện';
      case 'phu-huynh':
        return 'Phụ Huynh';
      case 'van-ban-cong-khai':
        return 'Văn Bản Công Khai';
      default:
        return category;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/post/getposts?userId=${currentUser.id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length<9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser.id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
        const res = await fetch(`${API_URL}/post/getposts?userId=${currentUser.id}&startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
            setUserPosts((prev) => [...prev, ...data.posts]);
            if(data.posts.length<9){
              setShowMore(false);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${API_URL}/post/deletepost/${postIdToDelete}/${currentUser.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post.id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full overflow-x-auto p-4 md:p-8">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-primary font-heading text-sm font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-5 py-4">Ngày đăng</th>
                  <th className="px-5 py-4">Ảnh bìa</th>
                  <th className="px-5 py-4">Tiêu đề</th>
                  <th className="px-5 py-4">Danh mục</th>
                  <th className="px-5 py-4">Xóa</th>
                  <th className="px-5 py-4">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((post, index) => (
                  <tr key={post.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} transition hover:bg-blue-50`}>
                    <td className="px-5 py-4 text-gray-600">{new Date(post.updatedAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-5 py-4">
                      <Link to={`/${post.slug}`}>
                        <img src={post.image} alt={post.title} className="h-10 w-16 rounded-lg bg-gray-100 object-cover" />
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Link className="font-semibold text-gray-900 hover:text-primary" to={`/${post.slug}`}>{post.title}</Link>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{getCategoryDisplayName(post.category)}</td>
                    <td className="px-5 py-4">
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post.id);
                        }}
                        className="inline-flex cursor-pointer rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Xóa
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link className="inline-flex rounded-lg border border-primary/30 px-3 py-1 text-sm font-semibold text-primary transition hover:bg-blue-50" to={`/sua-bai-viet/${post.id}`}>
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showMore && (
            <div className="flex justify-center">
              <button onClick={handleShowMore} className="w-full py-7 text-sm font-semibold text-primary hover:underline">
                Xem thêm
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl text-primary">▣</div>
          <p className="font-heading text-lg font-bold text-gray-800">Chưa có bài đăng nào</p>
          <p className="mt-2 text-sm text-gray-500">Các bài viết mới sẽ hiển thị tại đây.</p>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bạn có chắc chắn xóa bài đăng này?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Chắc chắn
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
