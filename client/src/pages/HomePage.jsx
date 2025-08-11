import React, { useEffect, useReducer, useState, useRef } from "react";
import axios from "axios";
import SophisticatedProductGrid from "../components/SophisticatedProductGrid";
import HeroSection from "../components/HeroSection";
import Recommendations from "../components/Recommendations";
import AdvancedFilter from "../components/AdvancedFilter";
import Button from "../components/Button";
import { useLocation, Link, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, ...action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const filterScrollRef = useRef(null);
  const filterContainerRef = useRef(null);
  const limit = 12;

  const [{ loading, error, products, pages, total }, dispatch] = useReducer(
    reducer,
    {
      products: [],
      loading: true,
      error: "",
      pages: 1,
      total: 0,
    }
  );

  const categories = [
    { name: "All", value: "", icon: "🛍️" },
    { name: "Electronics", value: "electronics", icon: "📱" },
    { name: "Fashion", value: "fashion", icon: "👕" },
    { name: "Home & Garden", value: "home", icon: "🏠" },
    { name: "Sports", value: "sports", icon: "⚽" },
    { name: "Books", value: "books", icon: "📚" },
    { name: "Beauty", value: "beauty", icon: "💄" },
  ];

  const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Price: Low to High", value: "price_asc" },
    { name: "Price: High to Low", value: "price_desc" },
    { name: "Newest First", value: "newest" },
    { name: "Best Rating", value: "rating" },
    { name: "Most Popular", value: "popular" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const queryParams = new URLSearchParams({
          keyword,
          category,
          page: page.toString(),
          limit: limit.toString(),
          sort: sortBy,
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
        });

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || ""}/api/products?${queryParams}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchProducts();
  }, [keyword, category, page, sortBy, priceRange]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURL({ page: newPage });
  };

  const handleCategoryChange = (newCategory) => {
    setPage(1);
    updateURL({ category: newCategory, page: 1 });
  };

  const handleSortChange = (newSort) => {
    setPage(1);
    setSortBy(newSort);
    updateURL({ sort: newSort, page: 1 });
  };

  const handlePriceFilter = () => {
    setPage(1);
    updateURL({
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      page: 1,
    });
  };

  const clearFilters = () => {
    setPage(1);
    setSortBy("featured");
    setPriceRange({ min: "", max: "" });
    navigate("/");
  };

  const updateURL = (params) => {
    const newParams = new URLSearchParams(location.search);

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== 1) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    navigate({ search: newParams.toString() });
  };

  const hasFilters =
    keyword ||
    category ||
    priceRange.min ||
    priceRange.max ||
    sortBy !== "featured";

  // Check if filter container has horizontal scroll
  useEffect(() => {
    const checkScroll = () => {
      if (filterScrollRef.current && filterContainerRef.current) {
        const container = filterScrollRef.current;
        const wrapper = filterContainerRef.current;

        if (container.scrollWidth > container.clientWidth) {
          wrapper.classList.add("has-scroll");
        } else {
          wrapper.classList.remove("has-scroll");
        }
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 aspect-square rounded-2xl mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Only show when no search/filters */}
      {!hasFilters && <HeroSection />}

      <div
        className={`container-responsive ${hasFilters ? "py-24" : "py-16"} `}
      >
        {/* Search Results Header */}
        {keyword && (
          <div className="mb-8 animate-slide-up">
            <h1 className="text-heading-xl text-gray-900 mb-2">
              Search Results for "{keyword}"
            </h1>
            <p className="text-body-lg text-gray-600">{total} products found</p>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <span className="text-body-md font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
              Categories:
            </span>
            <div className="flex gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`category-pill whitespace-nowrap ${
                    category === cat.value ? "active" : ""
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Sort - Horizontal Scroll Layout */}
        <div className="mb-8 animate-slide-up">
          <div
            ref={filterContainerRef}
            className="filter-container overflow-x-auto"
          >
            <div
              ref={filterScrollRef}
              className="filter-scroll-wrapper flex gap-4 pb-4"
            >
              {/* Sort By Filter */}
              <div className="filter-card bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-modern dark:shadow-lg flex-shrink-0 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="filter-select mt-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                        className="price-input w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                        className="price-input w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handlePriceFilter}
                        className="ml-1"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Filter */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Featured
                    </label>
                    <button
                      onClick={() => handleSortChange("featured")}
                      className={`filter-btn mt-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "featured"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-100"
                      }`}
                    >
                      Featured
                    </button>
                  </div>
                </div>
              </div>

              {/* Best Rating Filter */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Best Rating
                    </label>
                    <button
                      onClick={() => handleSortChange("rating")}
                      className={`filter-btn mt-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "rating"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-100"
                      }`}
                    >
                      Best Rating
                    </button>
                  </div>
                </div>
              </div>

              {/* Most Popular Filter */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Most Popular
                    </label>
                    <button
                      onClick={() => handleSortChange("popular")}
                      className={`filter-btn mt-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "popular"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-100"
                      }`}
                    >
                      Most Popular
                    </button>
                  </div>
                </div>
              </div>

              {/* Newest First Filter */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <span className="text-lg">📅</span>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Newest First
                    </label>
                    <button
                      onClick={() => handleSortChange("newest")}
                      className={`filter-btn mt-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        sortBy === "newest"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-100"
                      }`}
                    >
                      Newest First
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="filter-card bg-white rounded-2xl p-4 shadow-modern flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="icon-wrapper">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div>
                    <label className="filter-label text-body-sm font-semibold text-gray-700">
                      Advanced Filters
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedFilter(true)}
                      className="mt-1"
                    >
                      Advanced Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Clear Filters - Only show if filters active */}
              {hasFilters && (
                <div className="filter-card bg-red-50 border border-red-200 rounded-2xl p-4 shadow-modern flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="icon-wrapper">
                      <svg
                        className="w-5 h-5 text-red-600"
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
                    </div>
                    <div>
                      <label className="filter-label text-body-sm font-semibold text-red-700">
                        Clear All
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-1 text-red-600 hover:bg-red-100"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations Section - Only show when no search/filters */}
        {!hasFilters && products && products.length > 0 && (
          <Recommendations type="general" />
        )}
      </div>

      {/* Advanced Filter Modal */}
      {showAdvancedFilter && (
        <AdvancedFilter
          currentFilters={{
            category,
            sort: sortBy,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
          }}
          onFilterChange={(newFilters) => {
            // Update all filters at once
            const params = new URLSearchParams();
            if (newFilters.category)
              params.set("category", newFilters.category);
            if (newFilters.sort && newFilters.sort !== "featured")
              params.set("sort", newFilters.sort);
            if (newFilters.minPrice)
              params.set("minPrice", newFilters.minPrice);
            if (newFilters.maxPrice)
              params.set("maxPrice", newFilters.maxPrice);
            if (keyword) params.set("keyword", keyword);

            navigate({ search: params.toString() });

            // Update local state
            setSortBy(newFilters.sort || "featured");
            setPriceRange({
              min: newFilters.minPrice || "",
              max: newFilters.maxPrice || "",
            });
            setPage(1);
          }}
          onClose={() => setShowAdvancedFilter(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
