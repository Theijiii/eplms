import React, { useState } from "react";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

export default function RequestClearance() {
  const [activeApp, setActiveApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const [permitApplications, setPermitApplications] = useState([
    { id: "2025-001", applicant: "Juan Dela Cruz", type: "New", date: "2025-10-15", status: "Pending" },
    { id: "2025-002", applicant: "Maria Santos", type: "Renew", date: "2025-10-14", status: "Approved" },
    { id: "2025-003", applicant: "Pedro Reyes", type: "Cancelled", date: "2025-10-13", status: "Rejected" },
    { id: "2025-004", applicant: "Ana Lopez", type: "New", date: "2025-10-12", status: "Pending" },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setPermitApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleView = (app) => {
    setActiveApp(app);
    setShowModal(true);
  };

  const filteredApplications =
    activeTab === "All"
      ? permitApplications
      : permitApplications.filter(app => app.type === activeTab);

  return (
    <div className="bg-[#f5f7fb] min-h-screen flex flex-col">
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Permit Requests</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-4">
            {["All", "New", "Renew", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permit Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{t.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.applicant}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        t.status === "Approved" ? "bg-green-100 text-green-700" :
                        t.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleView(t)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && activeApp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Barangay Clearance Details</h3>

              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                <p><strong>Full Name of Applicant:</strong> Juan Dela Cruz</p>
                <p><strong>Alias/Nickname:</strong> JD</p>
                <p><strong>Date of Birth:</strong> 1990-05-15</p>
                <p><strong>Place of Birth:</strong> Manila, Philippines</p>
                <p><strong>Age:</strong> 35</p>
                <p><strong>Gender:</strong> Male</p>
                <p><strong>Civil Status:</strong> Single</p>
                <p><strong>Nationality:</strong> Filipino</p>
                <p><strong>Height:</strong> 170 cm</p>
                <p><strong>Weight:</strong> 68 kg</p>
                <p><strong>Blood Type:</strong> O+</p>
                <p><strong>Address/Residency:</strong> 123 Sampaguita St, Barangay 1, Manila</p>
                <p><strong>Length of Residency in Barangay:</strong> 10 years</p>
                <p><strong>Purpose of Clearance:</strong> Employment</p>
                <p><strong>Occupation:</strong> Office Clerk</p>

                {/* ID Reference */}
                <p><strong>ID Reference:</strong> 1234567890</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="flex-1">sample-id.pdf</span>
                  <button
                    onClick={() => window.open("/sample-id.pdf", "_blank")}
                    className="bg-[#4A90E2] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Preview
                  </button>
                </div>

                <p><strong>Character Declaration:</strong> Of good moral character</p>
                <p><strong>Criminal Record Statement:</strong> None</p>
                <p><strong>Date of Issuance:</strong> 2025-10-16</p>

                {/* Barangay Official */}
                <p><strong>Barangay Official’s Name & Signature:</strong> Hon. Jose Perez</p>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="flex-1">signature.png</span>
                  <button
                    onClick={() => window.open("/sample-signature.png", "_blank")}
                    className="bg-[#4A90E2] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleStatusChange(activeApp.id, "Approved");
                    setActiveApp({ ...activeApp, status: "Approved" });
                  }}
                  className="bg-[#4CAF50] text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(activeApp.id, "Rejected");
                    setActiveApp({ ...activeApp, status: "Rejected" });
                  }}
                  className="bg-[#FDA811] text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-orange-600"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(activeApp.id, "Pending");
                    setActiveApp({ ...activeApp, status: "Pending" });
                  }}
                  className="bg-[#4A90E2] text-white px-4 py-2 rounded-md text-sm flex items-center gap-1 hover:bg-blue-600"
                >
                  <Clock className="w-4 h-4" /> Pending
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
