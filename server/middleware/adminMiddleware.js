import { protect } from "./authMiddleware.js";

// শুধু logged-in admin user access করতে পারবে
const adminProtect = async (req, res, next) => {
  // প্রথমে user protect middleware দিয়ে verify হবে
  await protect(req, res, async () => {
    if (req.user && req.user.isAdmin) {
      next(); // admin হলে route চালাবে
    } else {
      res.status(403);
      throw new Error("Not authorized as an admin");
    }
  });
};

export { adminProtect };
