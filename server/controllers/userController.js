import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate JWT and set as cookie
      const token = generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("💥 ERROR IN authUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ইমেইলকে নরম্যালাইজ করা (অতিরিক্ত স্পেস এবং বড় হাতের অক্ষর বাদ দেওয়া)
    const normalizedEmail = email.trim().toLowerCase();

    // ইউজার আগে থেকেই আছে কিনা তা পরীক্ষা করা
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return; // এখানে কোড শেষ করে দেওয়া হচ্ছে
    }

    // নতুন ইউজার অবজেক্ট তৈরি করা
    const user = new User({
      name,
      email: normalizedEmail,
      password, // পাসওয়ার্ড এখানে প্লেইন টেক্সট হিসেবেই থাকবে, মডেল এটিকে হ্যাশ করবে
    });

    // ডেটাবেসে ইউজার সেভ করা (এই ধাপে userModel.js এর pre-save হুক কাজ করবে)
    const createdUser = await user.save();

    if (createdUser) {
      // টোকেন তৈরি করা এবং রেসপন্স পাঠানো
      const token = generateToken(res, createdUser._id);
      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: token,
      });
    } else {
      // যদি কোনো কারণে ইউজার তৈরি না হয়
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // যেকোনো অপ্রত্যাশিত ইরর ধরার জন্য এবং টার্মিনালে দেখানোর জন্য
    console.error("💥 ERROR IN registerUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("💥 ERROR IN getUserProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("💥 ERROR IN updateUserProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { authUser, registerUser, getUserProfile, updateUserProfile };
