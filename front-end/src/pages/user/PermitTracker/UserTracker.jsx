import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ icon

export default function PermitTracker() {
  const [tracking, setTracking] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/permittracker/track")
      .then((res) => res.json())
      .then((data) => setTracking(data))
      .catch((err) => console.error("E-Permit Tracker Service error:", err));
  }, []);

  const filteredTracking = tracking.filter((t) =>
    `${t.permitType} ${t.status} ${t.application_type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg min-h-screen flex flex-col">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">
        E-Permit Tracker
      </h1>
      <p className="mb-6 text-center">
        Track the status of your Business, Building, and other permit applications. <br />
        You can search by your name, permit ID, or application type.
      </p>

      {/* Search Input */}
      <div className="w-full max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search your name, permit id, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />
      </div>

      {tracking.length === 0 ? (
        <p className="text-gray-500 italic text-center flex-grow">
          No application submitted
        </p>
      ) : (
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Permit ID</th>
                <th className="px-4 py-2 border">Permit Type</th>
                <th className="px-4 py-2 border">Application Type</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTracking.length > 0 ? (
                filteredTracking.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{t.id}</td>
                    <td className="px-4 py-2 border">{t.permitType}</td>
                    <td className="px-4 py-2 border">{t.application_type}</td>
                    <td className="px-4 py-2 border">{t.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No matching applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Back Button at Bottom-Left with Icon */}
    <div className="mt-8 text-center">
      <button
        onClick={() => navigate('/user/dashboard')}
        className="inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 underline"
      >
        <ArrowLeft size={18} />
         Back to Dashboard
     </button>
    </div>

    </div>
  );
}
