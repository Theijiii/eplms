import { useEffect, useState } from "react";
import { logTx } from '../../../lib/txLogger';

export default function BusinessPermit() {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal / admin actions state
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

 useEffect(() => {
  fetch("http://e-plms.goserveph.com/front-end/src/pages/admin/BusinessPermit/businessAdminMock.php") // point to your PHP API
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      setBusiness(data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error("Business Permit Service error:", err);
      setError("Failed to load business permits.");
      setLoading(false);
    });
}, []);

  // KPI counters
  const total = business.length;
  const approved = business.filter((p) => p.status === "Approved").length;
  const rejected = business.filter((p) => p.status === "Rejected").length;
  const pending = business.filter((p) => p.status === "Pending").length;

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
    setPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setPreviewUrl(null);
    setShowModal(false);
  };

  const updatePermitStatus = (id, status, comment = "") => {
    const now = new Date().toISOString();
    setBusiness((prev) => prev.map((p) => (p.id === id ? { ...p, status, review_status: status, review_comments: comment || p.review_comments, last_updated: now } : p)));
    setSelectedPermit((prev) => (prev && prev.id === id ? { ...prev, status, review_comments: comment || prev.review_comments } : prev));
  };

  const handleApprove = () => { if (!selectedPermit) return; updatePermitStatus(selectedPermit.id, "Approved", actionComment); try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'approve', comment: actionComment }); } catch(e) {} };
  const handleReject = () => { if (!selectedPermit) return; updatePermitStatus(selectedPermit.id, "Rejected", actionComment); try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'reject', comment: actionComment }); } catch(e) {} };
  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    const now = new Date().toISOString();
    setBusiness((prev) => prev.map((p) => (p.id === selectedPermit.id ? { ...p, assigned_officer: assignedOfficerInput || p.assigned_officer, last_updated: now } : p)));
    setSelectedPermit((prev) => (prev ? { ...prev, assigned_officer: assignedOfficerInput || prev.assigned_officer } : prev));
    try { logTx({ service: 'business', permitId: selectedPermit.id, action: 'assign', comment: `assigned:${assignedOfficerInput}` }); } catch(e) {}
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Business Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of issued business permits
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

      {/* Loading/Error States */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading permits...</p>
      )}
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}
      {!loading && business.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No permits available.</p>
      )}

      {/* Table */}
      {!loading && business.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permit No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {business.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{p.business_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.applicant?.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{`${p.business_address?.street || ''} ${p.business_address?.barangay || ''}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.permit_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.submitted_at}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.assigned_officer}</td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => openModal(p)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (simple) */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permit Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPermit.permit_number} • {selectedPermit.business_name}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Applicant</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPermit.applicant?.full_name}</p>
                <p className="text-sm text-gray-500 mt-2">Contact: {selectedPermit.applicant?.contact_number}</p>
                <p className="text-sm text-gray-500">Email: {selectedPermit.applicant?.email_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">{`${selectedPermit.business_address?.street || ''} ${selectedPermit.business_address?.barangay || ''}, ${selectedPermit.business_address?.city_municipality || ''}`}</p>
                <p className="text-sm text-gray-500 mt-2">Total Amount: ₱{selectedPermit.total_amount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Assign Officer</label>
              <input value={assignedOfficerInput} onChange={(e) => setAssignedOfficerInput(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white" placeholder="Enter officer name" />
              <div className="mt-2 flex gap-2">
                <button onClick={handleSaveAssignment} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Save</button>
                <button onClick={() => { setAssignedOfficerInput(selectedPermit.assigned_officer || ""); }} className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-sm rounded">Reset</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Review Comment</label>
              <textarea value={actionComment} onChange={(e) => setActionComment(e.target.value)} className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white" rows={3} placeholder="Add a comment for approval or rejection" />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Attachments</h4>
              <ul>
                {selectedPermit.attachments?.map((a, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <a className="text-blue-600 underline" href={a.url} target="_blank" rel="noreferrer">{a.name}</a>
                    <button onClick={() => setPreviewUrl(a.url)} className="px-2 py-1 text-xs bg-gray-100 rounded">Preview</button>
                  </li>
                ))}
              </ul>
            </div>

            {previewUrl && (
              <div className="mb-4">
                <h4 className="font-semibold">Attachment Preview</h4>
                <div className="border rounded">
                  <iframe src={previewUrl} title="attachment-preview" className="w-full h-96" />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
              <button onClick={handleApprove} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
