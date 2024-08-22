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
import { set } from 'mongoose';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
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
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
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
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Ngày đăng</TableHeadCell>
              <TableHeadCell>Ảnh bìa</TableHeadCell>
              <TableHeadCell>Tiêu đề</TableHeadCell>
              <TableHeadCell>Danh mục</TableHeadCell>
              <TableHeadCell>Xóa</TableHeadCell>
              <TableHeadCell>
                <span>Chỉnh sửa</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <TableBody key={post._id} className="divide-y">
                <TableRow className="bg-white">
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <Link to={`/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className="font-medium text-gray-900" to={`/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell>
                    {post.category}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Xóa
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link className="text-teal-500 hover:underline" to={`/sua-bai-viet/${post._id}`}>
                        <span>
                            Chỉnh sửa
                        </span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {
            showMore && (
              <div className="flex justify-center">
                <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                  Xem thêm
                </button>
              </div>
            )
          }
        </>
      ) : (
        <p>Bạn không có bài đăng</p>
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
