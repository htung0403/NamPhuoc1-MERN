import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Không có quyền thay đổi thông tin"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Mật khẩu phải có ít nhất 6 kí tự"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Tên người dùng phải từ 7 đến 20 ký tự"));
    }
    if (req.body.username.includes(" ")) {
      return next(
        errorHandler(400, "Tên người dùng không được chứa khoảng trắng")
      );
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Tên người dùng phải viết thường"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Tên người dùng chỉ được chứa chữ cái và số")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          fullName: req.body.fullName,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId){
    return next(errorHandler(403, 'Bạn không có quyền xóa tài khoản này'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json('Xóa tài khoản thành công');
  }
  catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('Đăng xuất thành công');
  } catch (error) {
    next(error);
  }
} 
