import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { uploadToCloudinary, validateFile, deleteFromCloudinary } from "../../cloudinary";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://namphuoc1.edu.vn/api' 
    : 'http://localhost:3005/api';
  const extractPublicIdFromUrl = (url) => {
    try {
      const regex = /\/(?:v\d+\/)?(.+?)\.\w+$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setImageFileUploadError(validation.error);
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = async () => {
    if (!currentUser.profilePicture) return;
    setImageFileUploadError(null);
    try {
      const publicId = extractPublicIdFromUrl(currentUser.profilePicture);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
      setImageFile(null);
      setImageFileUrl(null);
      setFormData({
        ...formData,
        profilePicture:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      });
    } catch (error) {
      setImageFileUploadError('Không thể xóa ảnh đại diện');
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    try {
      const downloadUrl = await uploadToCloudinary(
        imageFile,
        'avatar',
        'image',
        (progress) => setImageFileUploadProgress(progress.toFixed(0))
      );
      setImageFileUrl(downloadUrl);
      setFormData({ ...formData, profilePicture: downloadUrl });
      setImageFileUploading(false);
    } catch (error) {
      setImageFileUploadError(
        "Không thể đăng ảnh lên (Dung lượng ảnh không thể quá 10MB)"
      );
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Không có gì thay đổi");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Vui lòng chờ ảnh được tải lên");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`${API_URL}/user/update/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Thay đổi thông tin thành công!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_URL}/user/delete/${currentUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_URL}/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full p-4 md:p-8">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-md">
      <h1 className="text-center font-heading text-2xl font-bold text-primary">Hồ sơ</h1>
      <div className="mt-2 text-center"><span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Quản trị viên</span></div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="relative w-32 h-32 self-center mx-auto">
          <div
            className="h-full w-full cursor-pointer overflow-hidden rounded-full shadow-md ring-4 ring-primary/30 transition hover:ring-primary/50"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="user"
              className={`h-full w-full rounded-full object-cover ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
            />
          </div>
          {currentUser.profilePicture && !imageFile && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow"
            >
              ×
            </button>
          )}
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
          type="text"
          id="username"
          placeholder="Tên tài khoản"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
          type="text"
          id="fullName"
          placeholder="Họ và tên"
          defaultValue={currentUser.fullName}
          onChange={handleChange}
        />
        <TextInput
          className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border-gray-200 [&_input]:px-4 [&_input]:py-3 [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/20"
          type="password"
          id="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
        />
        <Button
          type="submit"
          className="w-full rounded-xl border border-primary bg-white font-heading font-bold text-primary hover:bg-blue-50"
          disabled={loading || imageFileUploading}
        >
          { loading ? 'Đang tải...' :'Cập nhật'}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              className="w-full rounded-xl bg-primary font-heading font-bold text-white hover:bg-primary-dark"
            >
              Tạo bài viết
            </Button>
          </Link>
        )}
      </form>
      <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 text-sm">
        <span onClick={() => setShowModal(true)} className="cursor-pointer text-red-500 hover:underline">
          Xóa tài khoản
        </span>
        <span onClick={handleSignout} className="cursor-pointer text-gray-500 hover:underline">
          Đăng xuất
        </span>
      </div>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold">Xác nhận xóa tài khoản</h3>
            <div className="flex justify-center gap-5 mt-5">
              <Button color="failure" onClick={handleDeleteUser}>
                Đồng ý
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
