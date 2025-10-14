import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
export default function UserHeader() {
  const [time, setTime] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll behavior (hide header on scroll down)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!time) return null;

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-sm border-b-4 border-[#FDA811] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex justify-between items-center h-22">
        {/* LEFT: Logo + Title + Tagline */}
<div className="flex items-center gap-3">
  <NavLink to="/user/dashboard">
    <img
      src="/GSM_logo.png"
      alt="Logo"
      className="w-15 h-15 object-contain cursor-pointer hover:opacity-90 transition"
    />
  </NavLink>
  <div className="flex flex-col leading-tight">
    <span className="text-xl font-bold font-montserrat">
      <span className="text-blue-700">Go</span>
      <span className="text-green-700">Serve</span>
      <span className="text-blue-700">PH</span>
    </span>
    <span className="text-m text-gray-600 font-montserrat">
      Serbisyong Publiko, Abot-Kamay Mo.
    </span>
  </div>
</div>


        {/* RIGHT: Time and Date */}
        <div className="text-right text-lg text-gray-800">
          <div className="font-semibold">{time.toLocaleTimeString()}</div>
          <div>
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
