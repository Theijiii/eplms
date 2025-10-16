import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode globally
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Table data
  const permitApplicationss = [
    { id: "B-1001", applicant: "Juan Dela Cruz", type: "Building", date: "2025-10-10", applicationType: "New", status: "Approved" },
    { id: "B-1002", applicant: "Maria Santos", type: "Business", date: "2025-10-12", applicationType: "Renewal", status: "Pending" },
    { id: "B-1003", applicant: "Pedro Reyes", type: "Franchise", date: "2025-10-13", applicationType: "New", status: "Rejected" },
    { id: "B-1004", applicant: "Ana Lopez", type: "Barangay", date: "2025-10-14", applicationType: "Renewal", status: "Approved" },
    { id: "B-1005", applicant: "Liza Cruz", type: "Business", date: "2025-10-15", applicationType: "Liquor Permit", status: "Approved" },
    { id: "B-1006", applicant: "Mark Lim", type: "Business", date: "2025-10-16", applicationType: "Amendment", status: "Pending" },
    { id: "B-1007", applicant: "Rico Tan", type: "Barangay", date: "2025-10-17", applicationType: "New", status: "Approved" },
    { id: "B-1008", applicant: "Ella Fajardo", type: "Franchise", date: "2025-10-18", applicationType: "Renewal", status: "Pending" },
    { id: "B-1009", applicant: "Sam Lee", type: "Building", date: "2025-10-19", applicationType: "Electrical", status: "Approved" },
    { id: "B-1010", applicant: "Mia Gomez", type: "Building", date: "2025-10-20", applicationType: "Mechanical", status: "Pending" },
    { id: "B-1011", applicant: "Paul Cruz", type: "Building", date: "2025-10-21", applicationType: "Plumbing", status: "Approved" },
    { id: "B-1012", applicant: "Nina Ramos", type: "Building", date: "2025-10-22", applicationType: "Fencing", status: "Rejected" },
    { id: "B-1013", applicant: "Omar Sy", type: "Building", date: "2025-10-23", applicationType: "Demolition", status: "Approved" },
    { id: "B-1014", applicant: "Tina Yu", type: "Building", date: "2025-10-24", applicationType: "Excavation", status: "Pending" },
    { id: "B-1015", applicant: "Leo Chan", type: "Building", date: "2025-10-25", applicationType: "Occupancy", status: "Approved" },
    { id: "B-1016", applicant: "Grace Park", type: "Building", date: "2025-10-26", applicationType: "Electronics", status: "Pending" },
    { id: "B-1017", applicant: "Ivan Cruz", type: "Building", date: "2025-10-27", applicationType: "Signage", status: "Approved" },
  ];

  // Stats
  const total = permitApplicationss.length;
  const approved = permitApplicationss.filter(t => t.status === "Approved").length;
  const rejected = permitApplicationss.filter(t => t.status === "Rejected").length;
  const pending = permitApplicationss.filter(t => t.status === "Pending").length;

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300 font-sans">
      {/* Header Card */}
      <div className="relative shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden min-h-[250px] p-12 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/bgaddash.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-[#4CAF50] tracking-wide font-[Montserrat]">
            Permit & Licensing Management System
          </h2>
          <p className="mt-2 text-sm md:text-base max-w-2xl text-gray-600 dark:text-gray-300">
            Welcome Back <span className="font-semibold">Admin!,</span> Here’s a quick look at today’s stats and recent activities.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total Permits</p>
          <p className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">Approved</p>
          <p className="text-green-900 dark:text-green-100 text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">Rejected</p>
          <p className="text-red-900 dark:text-red-100 text-2xl font-bold">{rejected}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-lg shadow transition-colors duration-300">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">{pending}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="rounded-xl shadow p-6 flex-1 col-span-2 bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-black dark:text-white text-lg">Active Applications</span>
            <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
          </div>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: ["Business", "Franchise", "Building", "Health"],
                datasets: [
                  {
                    label: "Applications",
                    data: [120, 90, 70, 110],
                    backgroundColor: ["#FFF7A3", "#B5F5B5", "#FFB5B5", "#B5D8FF"],
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: isDark ? "#fff" : "#000", font: { weight: "bold" } } },
                },
                scales: {
                  x: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" } },
                  y: { ticks: { color: isDark ? "#fff" : "#000" }, grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl shadow p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-800 transition-colors duration-300 min-h-[420px]">
          <span className="font-semibold mb-6 text-black dark:text-white text-lg">Applications Status</span>
          <div className="h-[260px] w-[260px]">
            <Pie
              data={{
                labels: ["Approved", "Pending", "Rejected"],
                datasets: [
                  {
                    data: [approved, pending, rejected],
                    backgroundColor: ["#B5F5B5", "#FFF7A3", "#FFB5B5"],
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: isDark ? "#fff" : "#000", font: { weight: "500" } },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
          <span className="text-sm mt-6 text-gray-700 dark:text-gray-300">
            {approved} approved / {total} total applications
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow p-6 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-black dark:text-white">All Permit Applications</span>
          <button className="text-gray-400 dark:text-gray-300 hover:text-orange-500 text-xl">⋮</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full shadow rounded-lg transition-colors duration-300">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {permitApplicationss.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 text-sm">{t.id}</td>
                  <td className="px-6 py-4 text-sm">{t.applicant}</td>
                  <td className="px-6 py-4 text-sm">{t.type}</td>
                  <td className="px-6 py-4 text-sm">{t.date}</td>
                  <td className="px-6 py-4 text-sm">{t.applicationType}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        t.status === "Approved"
                          ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100"
                          : t.status === "Pending"
                          ? "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100"
                          : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
