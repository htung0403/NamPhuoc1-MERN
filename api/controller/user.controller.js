const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const { supabase, tables } = require("../config/supabase.js");

module.exports = {
  test: (req, res) => {
    res.json({ message: "API is working" });
  },
  updateUser: async (req, res, next) => {
    if (req.user.id !== parseInt(req.params.userId, 10)) {
      return next(errorHandler(403, "Không có quyền thay đổi thông tin"));
    }

    const { username, password, fullName, email, profilePicture } = req.body;

    if (password) {
      if (password.length < 6) {
        return next(errorHandler(400, "Mật khẩu phải có ít nhất 6 kí tự"));
      }
      req.body.password = bcryptjs.hashSync(password, 10);
    }

    if (username) {
      if (username.length < 7 || username.length > 20) {
        return next(errorHandler(400, "Tên người dùng phải từ 7 đến 20 ký tự"));
      }
      if (username.includes(" ")) {
        return next(errorHandler(400, "Tên người dùng không được chứa khoảng trắng"));
      }
      if (username !== username.toLowerCase()) {
        return next(errorHandler(400, "Tên người dùng phải viết thường"));
      }
      if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, "Tên người dùng chỉ được chứa chữ cái và số"));
      }
    }

    try {
      const userId = parseInt(req.params.userId, 10);
      const updatePayload = {};
      if (username !== undefined) updatePayload.username = username;
      if (req.body.password !== undefined) updatePayload.password = req.body.password;
      if (fullName !== undefined) updatePayload.fullName = fullName;
      if (email !== undefined) updatePayload.email = email;
      if (profilePicture !== undefined) updatePayload.profilePicture = profilePicture;

      const { data: updatedUser, error } = await supabase
        .from(tables.users)
        .update(updatePayload)
        .eq("id", userId)
        .select("*")
        .maybeSingle();

      if (error) {
        return next(errorHandler(500, error.message));
      }

      if (!updatedUser) {
        return next(errorHandler(404, "Không tìm thấy người dùng"));
      }

      const { password: pass, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Update error:", error);
      next(errorHandler(500, "Lỗi máy chủ"));
    }
  },
  deleteUser: async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    if (req.user.id !== userId) {
      return next(errorHandler(403, "Bạn không có quyền xóa tài khoản này"));
    }
    try {
      const { data, error } = await supabase
        .from(tables.users)
        .delete()
        .eq("id", userId)
        .select("id");

      if (error) {
        return next(errorHandler(500, error.message));
      }

      if (!data || data.length === 0) {
        return next(errorHandler(404, "User not found"));
      }

      res.status(200).json("Xóa tài khoản thành công");
    } catch (error) {
      next(error);
    }
  },
  signout: (req, res, next) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }).status(200).json("Đăng xuất thành công");
    } catch (error) {
      next(error);
    }
  },
};
