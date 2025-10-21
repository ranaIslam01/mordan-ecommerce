import React, { useState, useEffect, useContext, useReducer } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Store } from "../context/Store";
import { useWishlist } from "../context/WishlistContext";
import Button from "../components/Button";
import StarRating from "../components/StarRating";

// Product fetch korar jonno reducer
const productFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Review submit korar jonno reducer
const reviewSubmitReducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_REQUEST":
      return { ...state, loadingSubmit: true };
    case "SUBMIT_SUCCESS":
      return { ...state, loadingSubmit: false, successSubmit: true };
    case "SUBMIT_FAIL":
      return { ...state, loadingSubmit: false, errorSubmit: action.payload };
    case "SUBMIT_RESET":
      return {
        ...state,
        loadingSubmit: false,
        successSubmit: false,
        errorSubmit: "",
      };
    default:
      return state;
  }
};

export default function ProductPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Product fetch korar jonno state ebong dispatch
  const [{ loading, error, product }, dispatchProduct] = useReducer(
    productFetchReducer,
    {
      product: { reviews: [] },
      loading: true,
      error: "",
    }
  );

  // Review submit korar jonno state ebong dispatch
  const [{ loadingSubmit, errorSubmit, successSubmit }, dispatchReview] =
    useReducer(reviewSubmitReducer, {
      loadingSubmit: false,
      errorSubmit: "",
      successSubmit: false,
    });

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Review er jonno state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      dispatchProduct({ type: "FETCH_REQUEST" });
      try {
        const baseUrl = (
          process.env.REACT_APP_API_URL || "https://mordan-ecommerce.onrender.com"
        ).replace(/\/?$/, "");
        const { data } = await axios.get(
          `${baseUrl}/api/products/${productId}`
        );
        dispatchProduct({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatchProduct({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchProduct();

    if (successSubmit) {
      dispatchReview({ type: "SUBMIT_RESET" });
      setRating(0);
      setComment("");
    }
  }, [productId, successSubmit]);

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.qty + qty : qty;

    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, qty: quantity },
    });
    navigate("/cart");
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      alert("Please enter comment and rating");
      return;
    }
    dispatchReview({ type: "SUBMIT_REQUEST" });
    try {
      await axios.post(
        `${(
          process.env.REACT_APP_API_URL || "https://mordan-ecommerce.onrender.com"
        ).replace(/\/?$/, "")}/api/products/${productId}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );
      dispatchReview({ type: "SUBMIT_SUCCESS" });
      alert("Review submitted successfully. It might take a moment to appear.");
    } catch (err) {
      dispatchReview({
        type: "SUBMIT_FAIL",
        payload: err.response?.data?.message || err.message,
      });
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.318 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Product
          </h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/">
            <Button variant="primary">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock additional images for gallery (in real app, this would come from API)
  const productImages = [
    product.image?.startsWith("http")
      ? product.image
      : product.image?.startsWith("/images/")
      ? product.image
      : `/images/${product.image}`,
    // Add more images here when available
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Products
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Product Gallery */}
          <div className="lg:col-span-7">
            <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 shadow-lg dark:shadow-2xl">
              {/* Main Image */}
              <div className="relative group mb-6">
                <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <img
                    src={productImages[selectedImage] || productImages[0]}
                    alt={product.name}
                    className="w-full h-96 xl:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105 bg-gray-100 dark:bg-gray-800"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="absolute top-4 right-4 w-12 h-12 bg-black/50 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 dark:hover:bg-primary-700 transition-all duration-300 border border-white/20 dark:border-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={toggleWishlist}
                  className={`absolute top-4 left-4 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 dark:border-gray-700 ${
                    isInWishlist(product._id)
                      ? "bg-red-500 text-white"
                      : "bg-black/50 dark:bg-gray-800/80 text-white hover:bg-red-500 dark:hover:bg-red-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : "border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5">
            <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 shadow-lg dark:shadow-2xl sticky top-8">
              {/* Product Title & Brand */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                    {product.brand || "Premium Brand"}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {product.category || "Electronics"}
                  </span>
                </div>
                <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <StarRating rating={product.rating} size="lg" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    ${product.price}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium">
                    20% OFF
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.countInStock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      product.countInStock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.countInStock > 0
                      ? `${product.countInStock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Quantity
                  </h3>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 w-fit border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-16 text-center font-semibold text-gray-900 dark:text-white text-lg">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.countInStock, qty + 1))
                      }
                      className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 flex items-center justify-center border border-gray-200 dark:border-gray-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="h-14 text-lg font-semibold shadow-glow-lg hover:shadow-glow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {product.countInStock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </div>
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="h-12"
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Buy Now
                  </div>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Free Shipping
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Easy Returns
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    24/7 Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 shadow-lg dark:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 font-serif">
              Customer Reviews
            </h2>

            {/* Reviews Summary */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {product.rating.toFixed(1)}
                </div>
                <StarRating rating={product.rating} size="lg" />
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Based on {product.numReviews} reviews
                </p>
              </div>

              <div className="md:col-span-2">
                {/* Rating Distribution would go here */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{stars}★</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 80 + 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8">
                        {Math.floor(Math.random() * 50)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            {product.reviews?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews?.map((review, index) => (
                  <div
                    key={review._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-slide-up shadow dark:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {review.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-serif">
                Write a Review
              </h3>

              {userInfo ? (
                <form onSubmit={submitReviewHandler} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                        className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      placeholder="Share your thoughts about this product..."
                      className="w-full p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    disabled={loadingSubmit}
                    variant="primary"
                    size="lg"
                    className="px-8"
                  >
                    {loadingSubmit ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>

                  {errorSubmit && (
                    <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl">
                      {errorSubmit}
                    </div>
                  )}
                </form>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Sign in to write a review
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Share your experience with other customers
                  </p>
                  <Link to={`/login?redirect=/product/${productId}`}>
                    <Button variant="primary">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 dark:bg-gray-900/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-primary-700 transition-all duration-300 border border-white/20 dark:border-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={productImages[selectedImage] || productImages[0]}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
