import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Briefcase, Landmark, ClipboardList, Search } from "lucide-react";
import Footer from "../../components/user/Footer";

// 🧩 Services data
const SERVICES = [
  {
    id: 1,
    name: "Business Permit Services",
    description: "Manage new applications and renew existing permits.",
    icon: <Briefcase className="w-10 h-10 text-green-600" />,
    path: "/user/business/type",
  },
  {
    id: 2,
    name: "Building Permit Services",
    description: "Submit and track building-related permits.",
    icon: <Building2 className="w-10 h-10 text-orange-500" />,
    path: "/user/building/type",
  },
  {
    id: 3,
    name: "Franchise Permit Services",
    description: "Apply for and manage Tricycle Franchise applications.",
    icon: <ClipboardList className="w-10 h-10 text-yellow-500" />,
    path: "/user/franchise/type",
  },
  {
    id: 4,
    name: "E-Permit Tracker",
    description: "Track and monitor your submitted applications.",
    icon: <Search className="w-10 h-10 text-purple-500" />,
    path: "/user/permittracker",
  },
  {
    id: 5,
    name: "Barangay Permit Services",
    description: "Quickly process barangay clearances and certificates.",
    icon: <Landmark className="w-10 h-10 text-blue-600" />,
    path: "/user/barangay/type",
  },
];

export default function UserDashboard() {
  const [filteredServices, setFilteredServices] = useState(SERVICES);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // 🎨 Color palette
  const palette = {
    primary: "#4CAF50",
    secondary: "#4A90E2",
    accent: "#FDA811",
    background: "#FBFBFB",
    text: "#222",
    footer: "#e5e7eb",
    font: "Montserrat, Segoe UI, Arial, Helvetica Neue, sans-serif",
  };

  // 🔍 Search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredServices(
      SERVICES.filter((service) => service.name.toLowerCase().includes(value))
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FBFBFB] overflow-x-hidden"
    >
      {/* Hero Section */}
{/*
<section
  className="relative flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center text-text flex-shrink-0 bg-cover bg-left bg-no-repeat mb-[100px] pt-50 pb-40"
  style={{
    backgroundImage: "url('/BG.jpg')",
  }}
>
  <div className="absolute inset-0 bg-white/80"></div>

  <div className="relative z-10">
    <h1 className="font-poppins text-4xl md:text-6xl font-extrabold mb-6 text-white">
      <span style={{ color: "#4A90E2" }}>Go</span>
      <span style={{ color: "#4CAF50" }}>Serve</span>
      <span style={{ color: "#4A90E2" }}>PH</span>
    </h1>

    <p className="text-lg md:text-2xl mb-4 max-w-2xl font-semibold text-black">
      Serbisyong Publiko, Abot-Kamay Mo
    </p>

    <p className="text-base md:text-lg mb-8 max-w-2xl text-black">
      Fast, secure, and easy way to manage all your government permits and
      licenses online.
    </p>

    <a href="#services">
      <button
        className="font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-200 text-lg"
        style={{ background: "#4A90E2", color: "#fff" }}
      >
        Get Started
      </button>
    </a>
  </div>
</section>
*/}


<section id="services" className="px-4 pb-16 flex-shrink-0">
  <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center text-primary pt-16">
    Our Services
  </h2>

  {/* 🔍 Search bar */}
  <div className="flex justify-center mb-6">
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search a service..."
        className="w-full pl-10 p-3 border border-[#4CAF50] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
      />
    </div>
  </div>

  {/* 🧩 Service cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
    {filteredServices.map((service) => (
      <button
        key={service.id}
        onClick={() => {
          setSelectedService(service);
          setShowConfirm(true);
        }}
        className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center hover:border-accent font-montserrat"
      >
     <div className="mb-4">{service.icon}</div>
     <h3 className="font-montserrat font-bold text-lg mb-2 text-gray-800">
      {service.name}
     </h3>
    <p className="text-sm text-gray-600">{service.description}</p>
   </button>

    ))}
  </div>

  {/* Confirmation Modal */}
  {showConfirm && selectedService && (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/10"
        style={{
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 font-montserrat">
        <div
          className="rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
          style={{
            background: "#FBFBFB",
            border: "1px solid #4A90E2",
            color: "#222",
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: "#4CAF50" }}>
            Proceed to {selectedService.name}?
          </h2>

          <div className="mb-4">
            <span className="block text-sm font-semibold text-secondary mb-1">
              Permit Type:
            </span>
            <span className="block text-lg font-bold text-primary">
              {selectedService.name.replace(" Services", "")}
            </span>
            {selectedService.path && (
              <span className="block text-sm font-semibold mt-1 text-accent">
                {(() => {
                  const path = selectedService.path;
                  if (path.includes("new")) return "New";
                  if (path.includes("renewal")) return "Renewal";
                  if (path.includes("amendment")) return "Amendment";
                  if (path.includes("tracker")) return "Tracking";
                  return "";
                })()}
              </span>
            )}
          </div>

          <p className="mb-6" style={{ color: "#222" }}>
            You are about to fill up the form for{" "}
            <span className="font-semibold" style={{ color: "#4A90E2" }}>
              {selectedService.name}
            </span>
            . Do you want to continue?
          </p>

          <div className="flex justify-end gap-3">
            <button
                onClick={() => setShowConfirm(false)}
                 className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = "#FDA811";
                   e.currentTarget.style.color = "#FFFFFF";
                }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#D1D5DB"; // bg-gray-300
                    e.currentTarget.style.color = "#1F2937"; // text-gray-800
                  }}
                >

                Cancel
              </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                navigate(selectedService.path);
              }}
              className="px-4 py-2 rounded-lg font-semibold transition"
              style={{ background: "#4CAF50", color: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FDA811")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4CAF50")}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  )}
</section>

      {/* 🧩 Footer stays at bottom */}

    </div>
  );
}
