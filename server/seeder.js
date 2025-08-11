import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js"; // (আমরা একটু পরেই এই ফাইলটি তৈরি করব)
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    // Create a sample order
    const sampleOrder = {
      user: adminUser,
      orderItems: [
        {
          name: createdProducts[0].name,
          qty: 2,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
      ],
      shippingAddress: {
        address: "123 Main St",
        city: "Dhaka",
        postalCode: "1207",
        country: "Bangladesh",
      },
      paymentMethod: "Cash On Delivery",
      itemsPrice: createdProducts[0].price * 2,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: createdProducts[0].price * 2,
      isPaid: false,
      isDelivered: false,
    };

    await Order.create(sampleOrder);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
