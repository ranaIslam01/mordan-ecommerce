import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // 1. Authorization header থেকে
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Cookie থেকে fallback
  if (!token && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

export { protect };
