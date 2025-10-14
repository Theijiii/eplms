import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FranchiseDashboard() {
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchFranchises();
  }, []);

  // ---------- Fetch all franchises ----------
  const fetchFranchises = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/franchises.php");
      const data = await res.json();
      setFranchises(data);
    } catch (err) {
      console.error("Franchise Permit Service error:", err);
    }
  };

  const totalPages = Math.ceil(franchises.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFranchises = franchises.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const total = franchises.length;
  const approved = franchises.filter((f) => f.status === "Approved").length;
  const pending = franchises.filter((f) => f.status === "Pending").length;
  const rejected = franchises.filter((f) => f.status === "Rejected").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-green-600 bg-green-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      case "Rejected": return "text-red-600 bg-red-100";
      case "For Compliance": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // ---------- View Franchise ----------
  const handleView = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/view_franchise.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedFranchise(data.data);
        setIsModalOpen(true);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching franchise details:", err);
      Swal.fire("Error", "Unable to fetch franchise details.", "error");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFranchise(null);
  };

  // ---------- CRUDE Action ----------
 const handleCrudeAction = (action) => {
  // If For Compliance → ask remarks
  if (action === "For Compliance") {
    Swal.fire({
      title: `Action: ${action}`,
      input: 'textarea',
      inputLabel: 'Notes',
      inputPlaceholder: 'Type your remarks here...',
      inputAttributes: { 'aria-label': 'Type your remarks here' },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const notes = result.value || ""; // rename to notes
        await updateStatus(action, notes); // send notes to backend
      }
    });
    } else {
      // Approve / Reject → simple confirmation
      Swal.fire({
        title: `Are you sure you want to ${action}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateStatus(action, ""); // no remarks
        }
      });
    }
  };

const updateStatus = async (action, notes) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/update_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: selectedFranchise.id, 
        action, 
        Notes: notes // <-- must match backend
      }),
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Updated!", data.message, "success");
      await fetchFranchises(); // refresh table
      setSelectedFranchise(prev => ({ ...prev, status: action, notes })); // update modal
    } else {
      Swal.fire("Oops!", data.message, "error");
    }
  } catch (err) {
    Swal.fire("Error", "Something went wrong.", "error");
  }
};

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header & KPI Cards */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Franchise Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of franchise permit applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">Total Permits</p>
          <p className="text-blue-900 text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">Approved</p>
          <p className="text-green-900 text-2xl font-bold">{approved}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">Pending</p>
          <p className="text-yellow-900 text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-800 text-sm font-medium">Rejected</p>
          <p className="text-red-900 text-2xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TODA</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Barangay</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedFranchises.length > 0 ? (
              paginatedFranchises.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 text-[12px] font-montserrat">
                <td className="px-3 py-2">{f.id}</td>
                <td className="px-3 py-2">{f.full_name}</td>
                <td className="px-3 py-2">{f.contact_number}</td>
                <td className="px-3 py-2">{f.make_brand} {f.model}</td>
                <td className="px-3 py-2">{f.route_zone}</td>
                <td className="px-3 py-2">{f.toda_name}</td>
                <td className="px-3 py-2">{f.barangay_of_operation}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 text-[12px] font-medium rounded-full ${getStatusColor(f.status)}`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleView(f.id)}
                    className="px-2.5 py-1 bg-blue-600 text-white text-[12px] rounded hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>

              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No franchise permits found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Next
        </button>
      </div>

      {/* ---------------- Modal ---------------- */}
{isModalOpen && selectedFranchise && (
  <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn font-[Montserrat]">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={closeModal}
    />

    {/* Modal Container */}
    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-11/12 md:w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Franchise Details
        </h2>
        <button
          aria-label="Close"
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(selectedFranchise).map(([key, value]) => (
            <div
              key={key}
              className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                {key.replaceAll("_", " ")}
              </div>
              <div className="font-medium text-gray-800 dark:text-gray-100 break-words">
                {value || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky bottom-0 z-10 flex justify-end flex-wrap gap-3">
        {selectedFranchise.status !== "Approved" &&
          selectedFranchise.status !== "Rejected" && (
            <>
              <button
                onClick={() => handleCrudeAction("Approved")}
                className="px-4 py-2 rounded-lg font-semibold text-[#FBFBFB] bg-[#4CAF50] hover:bg-[#FDA811] shadow-sm transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleCrudeAction("Rejected")}
                className="px-4 py-2 rounded-lg font-semibold text-[#FBFBFB] bg-[#FDA811] hover:bg-[#e53935] shadow-sm transition"
              >
                Reject
              </button>
            </>
          )}
        <button
          onClick={() => handleCrudeAction("For Compliance")}
          className="px-4 py-2 rounded-lg font-semibold text-[#FBFBFB] bg-[#4A90E2] hover:bg-[#6BB9FF] shadow-sm transition"
        >
          For Compliance
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-[#FBFBFB] hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
