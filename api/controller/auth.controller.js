import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password, fullName, role } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !fullName ||
    username === "" ||
    email === "" ||
    fullName === ""
  ) {
  next(errorHandler(400, 'All fields required!'));
}

  try {
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user with default role 'phuhuynh'
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || "khach", // Default role
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res,next) => {
  const {email , password} = req.body;

  if (!email || !password || email === '' || password === ''){
    next(errorHandler(400, 'All fields are required'))
  }

  try {
    const validUser = await User.findOne({ email });
    if(!validUser){
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword){
      return next(errorHandler(400,'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id }, process.env.JWT_SECRET
    );
    const {password: pass, ...rest} = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token,{ httpOnly:true }).json(rest)
    
  }catch (error) {
    next(error);
  }
};