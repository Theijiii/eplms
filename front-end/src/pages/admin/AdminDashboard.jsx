import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const services = [
  { name: "Building Permit", key: "building", color: "#60a5fa" },
  { name: "Barangay Permit", key: "barangay", color: "#34d399" },
  { name: "Franchise Permit", key: "franchise", color: "#fbbf24" },
  { name: "Business Permit", key: "business", color: "#f87171" },
];

const AdminDashboard = ({ transactions }) => {
  const [dataState, setDataState] = useState({
    building: 0,
    barangay: 0,
    franchise: 0,
    business: 0,
  });
  const [recentTxs, setRecentTxs] = useState([]);

  // load aggregates from local tx log if available
  useEffect(() => {
    try {
      const txs = JSON.parse(localStorage.getItem('tx_log') || '[]');
      if (txs && txs.length) {
        const agg = { building: 0, barangay: 0, franchise: 0, business: 0 };
        txs.forEach(t => { if (agg[t.service] !== undefined) agg[t.service] += 1; });
        setDataState((prev) => ({ ...prev, ...agg }));
        setRecentTxs(txs.slice(0, 10));
      }
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (transactions) {
      setDataState(transactions);
    } else {
      // Example API fetch (replace with your endpoint)
      fetch("/api/transactions")
        .then((res) => res.json())
        .then((data) => setDataState(data))
        .catch(() => {});
    }
  }, [transactions]);

  const chartData = {
    labels: services.map((s) => s.name),
    datasets: [
      {
        label: "Transactions",
        data: services.map((s) => dataState[s.key]),
        backgroundColor: services.map((s) => s.color),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Service Transactions Overview",
      },
    },
  };

  return (
    <div className="p-8 min-h-screen font-sans" style={{ background: '#FBFBFB', fontFamily: 'Inter, Segoe UI, Arial, Helvetica Neue, sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: '#4CAF50' }}>GoServePH</h1>
        <p className="text-lg mt-2 font-medium" style={{ color: '#4A90E2' }}>Serbisyong Publiko, Abot-Kamay Mo</p>
      </div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            if (!confirm('Reset analytics and local mock submissions? This cannot be undone.')) return;
            try {
              localStorage.removeItem('tx_log');
              localStorage.removeItem('mock_franchise_submissions');
            } catch (e) { /* ignore */ }
            setDataState({ building:0, barangay:0, franchise:0, business:0 });
            setRecentTxs([]);
            // optional: reload to ensure all pages reflect cleared state
            window.location.reload();
          }}
          className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Reset Analytics
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#FDA811' }}>Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {services.map((service) => (
          <div
            key={service.key}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
            style={{ border: `2px solid ${service.color}` }}
          >
            <span
              className="text-lg font-semibold mb-2"
              style={{ color: service.color }}
            >
              {service.name}
            </span>
            <span className="text-2xl font-bold" style={{ color: '#4CAF50' }}>{dataState[service.key]}</span>
            <span className="text-gray-500">Transactions</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AdminDashboard;
