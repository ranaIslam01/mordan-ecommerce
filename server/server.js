import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// এনভায়রনমেন্ট ভ্যারিয়েবল লোড করুন
dotenv.config();
// ডেটাবেসের সাথে সংযোগ স্থাপন করুন
connectDB();

const app = express();

// CORS মিডলওয়্যার (রাউটগুলোর আগে ব্যবহার করতে হবে)
const allowedOrigins = [
  "https://mordan-ecommerce.vercel.app", // আপনার প্রোডাকশন ফ্রন্টএন্ড
  "http://localhost:3000", // আপনার লোকাল ডেভেলপমেন্ট ফ্রন্টএন্ড
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin ছাড়া রিকোয়েস্ট (যেমন Postman) অথবা অনুমোদিত ডোমেইন থেকে আসা রিকোয়েস্ট গ্রহণ করুন
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // ফ্রন্টএন্ড থেকে কুকি পাঠানোর অনুমতি দেওয়ার জন্য এটি জরুরি
  })
);

// বডি পার্সার এবং কুকি পার্সার মিডলওয়্যার
app.use(express.json()); // JSON বডি পার্স করার জন্য
app.use(express.urlencoded({ extended: true })); // URL-encoded বডি পার্স করার জন্য
app.use(cookieParser()); // কুকি পার্স করার জন্য

// API রাউটগুলো
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// গ্লোবাল এরর হ্যান্ডলার (সবশেষে থাকবে)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack); // ডিবাগিং এর জন্য সম্পূর্ণ স্ট্যাক ট্রেস লগ করুন
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // প্রোডাকশনে এররের স্ট্যাক ট্রেস ক্লায়েন্টকে পাঠানো উচিত নয়
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

// সার্ভার চালু করুন
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
