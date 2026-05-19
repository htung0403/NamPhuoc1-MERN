const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const { supabase, tables } = require("../config/supabase.js");

module.exports = {
  signup: async (req, res, next) => {
    const { username, email, password, fullName } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !fullName ||
      username === "" ||
      email === "" ||
      fullName === ""
    ) {
      return next(errorHandler(400, "All fields required!"));
    }

    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const { error } = await supabase.from(tables.users).insert({
        username,
        email,
        password: hashedPassword,
        fullName,
        isAdmin: false, // Default role
      });

      if (error) {
        if (error.code === "23505") {
          return next(errorHandler(409, "Email hoặc username đã tồn tại"));
        }
        return next(errorHandler(500, error.message));
      }

      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      next(error);
    }
  },

  signin: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"));
    }

    try {
      const { data: validUser, error } = await supabase
        .from(tables.users)
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        return next(errorHandler(500, error.message));
      }

      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, "Invalid password"));
      }
      const token = jwt.sign(
        { id: validUser.id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      const { password: pass, ...rest } = validUser;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({ ...rest, token });
    } catch (error) {
      next(error);
    }
  },
};
