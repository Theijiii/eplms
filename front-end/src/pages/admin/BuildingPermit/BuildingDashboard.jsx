import { useEffect, useState } from "react";

export default function BuildingDashboard() {
  const [building, setBuilding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/buildingpermit/building")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setBuilding(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Building Permit Service error:", err);
        setError("Failed to load building permits.");
        setLoading(false);
      });
  }, []);

  // KPI counters
  const total = building.length;
  const active = building.filter((p) => p.permit.status === "Active").length;
  const expired = building.filter((p) => p.permit.status === "Expired").length;
  const pending = building.filter((p) => p.permit.status === "Pending").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100";
      case "Expired":
        return "text-red-600 bg-red-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Building Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of issued building permits
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">Total Permits</p>
          <p className="text-blue-900 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Active</p>
          <p className="text-green-900 text-2xl font-bold">{active}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-800 text-sm font-medium">Expired</p>
          <p className="text-red-900 text-2xl font-bold">{expired}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 text-2xl font-bold">{pending}</p>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading permits...</p>
      )}
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}
      {!loading && building.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No permits available.</p>
      )}

..., [02/09/2025 12:27 am]
{/* Table */}
      {!loading && building.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permit No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {building.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {p.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {p.permit.permitNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {p.permit.issued}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {p.permit.expiry}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        p.permit.status
                      )}`}
                    >
                      {p.permit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}