import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const announcements = [
    {
      id: 1,
      text: "🔥 Free shipping on orders over $50!",
      action: "Shop Now",
      link: "/deals",
      type: "offer",
      bgColor: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      text: "✨ New arrivals are here - Check them out!",
      action: "Explore",
      link: "/new",
      type: "info", 
      bgColor: "from-blue-500 to-purple-500"
    },
    {
      id: 3,
      text: "💰 Save up to 70% in our flash sale!",
      action: "Save Now",
      link: "/deals",
      type: "sale",
      bgColor: "from-green-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!isVisible) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className={`relative bg-gradient-to-r ${currentAnnouncement.bgColor} text-white py-2 px-4 text-center text-sm font-medium transition-all duration-500`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="animate-pulse">📢</span>
          <span>{currentAnnouncement.text}</span>
          <Link
            to={currentAnnouncement.link}
            className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105"
          >
            {currentAnnouncement.action}
          </Link>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-0 left-0 w-full flex">
        {announcements.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-0.5 transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
