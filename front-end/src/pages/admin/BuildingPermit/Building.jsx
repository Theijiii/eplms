import { useEffect, useState } from "react";
import { logTx } from "../../../lib/txLogger";

export default function BuildingPermit() {
  const [building, setBuilding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal / admin actions state
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");

  useEffect(() => {
    fetch("http://localhost:3002/newbuildingapp")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch permits");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Backend data:", data);
        // ensure it's always an array
        setBuilding(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Building Permit Service error:", err);
        setError("Failed to load building permits.");
        setLoading(false);
      });
  }, []);

  // KPI counters
  const total = building.length;
  const approved = building.filter((p) => p.status === "Approved").length;
  const rejected = building.filter((p) => p.status === "Rejected").length;
  const pending = building.filter((p) => p.status === "Pending").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const openModal = (permit) => {
    setSelectedPermit(permit);
    setAssignedOfficerInput(permit.assigned_officer || "");
    setActionComment("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setIsModalOpen(false);
  };

  const updatePermitStatus = (id, status, comment) => {
    setBuilding((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              review_status:
                status === "Approved"
                  ? "Approved"
                  : status === "Rejected"
                  ? "Rejected"
                  : p.review_status,
              review_comments: comment || p.review_comments,
              last_updated: new Date().toISOString(),
            }
          : p
      )
    );

    setSelectedPermit((prev) =>
      prev && prev.id === id
        ? { ...prev, status, review_comments: comment || prev.review_comments }
        : prev
    );
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Approved", actionComment);
    logTx({
      service: "building",
      permitId: selectedPermit.id,
      action: "approve",
      comment: actionComment,
    });
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Rejected", actionComment);
    logTx({
      service: "building",
      permitId: selectedPermit.id,
      action: "reject",
      comment: actionComment,
    });
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    setBuilding((prev) =>
      prev.map((p) =>
        p.id === selectedPermit.id
          ? {
              ...p,
              assigned_officer: assignedOfficerInput,
              last_updated: new Date().toISOString(),
            }
          : p
      )
    );
    setSelectedPermit((prev) =>
      prev ? { ...prev, assigned_officer: assignedOfficerInput } : prev
    );
    logTx({
      service: "building",
      permitId: selectedPermit.id,
      action: "assign",
      comment: `assigned:${assignedOfficerInput}`,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Building Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of submitted building permits
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">Total Permits</p>
          <p className="text-blue-900 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Approved</p>
          <p className="text-green-900 text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-800 text-sm font-medium">Rejected</p>
          <p className="text-red-900 text-2xl font-bold">{rejected}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 text-2xl font-bold">{pending}</p>
        </div>
      </div>

      {/* Debug Data */}
      <pre className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-4 max-h-64 overflow-auto">
        {JSON.stringify(building, null, 2)}
      </pre>

      {/* Loading/Error States */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">
          Loading permits...
        </p>
      )}
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}
      {!loading && building.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No permits available.</p>
      )}

      {/* Table */}
      {!loading && building.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Form of Ownership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Estimated Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {building.map((p) => (
                <tr key={p.building_id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {`${p.first_name || ""} ${p.last_name || ""}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {`${p.street || ""}, ${p.barangay || ""}, ${p.city_municipality || ""}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {p.form_of_ownership || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    ₱{p.total_estimated_cost?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        p.status || "Pending"
                      )}`}
                    >
                      {p.status || "Pending"}
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
