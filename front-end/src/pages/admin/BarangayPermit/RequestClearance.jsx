import { useEffect, useState } from "react";
import { logTx } from '../../../lib/txLogger';

export default function BarangayPermit() {
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [permits, setPermits] = useState([]);
  const [actionComment, setActionComment] = useState('');
  const [assignedOfficerInput, setAssignedOfficerInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // load mock data
    fetch('/src/lib/mock/barangayAdmin.mock.json')
      .then((r) => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then((data) => {
        setPermits(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load mock permits', err);
        setError('Failed to load mock permits');
        setLoading(false);
      });
  }, []);

  const updatePermitStatus = (id, status, comment = '') => {
    const now = new Date().toISOString();
    const updated = permits.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status,
          review_comments: comment || p.review_comments,
          last_updated: now,
          assigned_officer: assignedOfficerInput || p.assigned_officer,
        };
      }
      return p;
    });
    setPermits(updated);
    const newSelected = updated.find((p) => p.id === id);
    setSelectedPermit(newSelected);
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, 'Approved', actionComment);
    // record transaction
    try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'approve', comment: actionComment }); } catch (e) {}
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, 'Rejected', actionComment);
    try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'reject', comment: actionComment }); } catch (e) {}
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    // update assigned officer only
    const updated = permits.map((p) => p.id === selectedPermit.id ? { ...p, assigned_officer: assignedOfficerInput || p.assigned_officer, last_updated: new Date().toISOString() } : p);
    setPermits(updated);
    setSelectedPermit(updated.find((p) => p.id === selectedPermit.id));
    try { logTx({ service: 'barangay', permitId: selectedPermit.id, action: 'assign', comment: `assigned:${assignedOfficerInput}` }); } catch (e) {}
  };

  // KPI counters
  const total = permits.length;
  const approved = permits.filter((p) => p.status === "Approved").length;
  const rejected = permits.filter((p) => p.status === "Rejected").length;
  const pending = permits.filter((p) => p.status === "Pending").length;

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
    setShowModal(true);
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setShowModal(false);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Barangay Permits Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of submitted barangay permits (mock)</p>
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

      {/* Loading/Error/Table */}
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading permits...</p>}
      {error && <div className="mb-4 text-red-600 dark:text-red-400 font-semibold">{error}</div>}
      {!loading && permits.length === 0 && <p className="text-gray-500 dark:text-gray-400">No permits available.</p>}

      {/* Table */}
      {!loading && permits.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permit No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Barangay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {permits.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{p.permit_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.applicant.first_name} {p.applicant.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.address.barangay}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.purpose}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.assigned_officer}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600"
                      onClick={() => openModal(p)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
      {/* Modal for viewing permit details */}
      {showModal && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permit Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPermit.permit_number} • {selectedPermit.purpose}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Applicant</h4>
                <p>{selectedPermit.applicant.first_name} {selectedPermit.applicant.middle_initial} {selectedPermit.applicant.last_name}</p>
                <p>{selectedPermit.applicant.contact_number}</p>
                <p>{selectedPermit.applicant.email}</p>
                <p>{selectedPermit.applicant.nationality}</p>
              </div>
              <div>
                <h4 className="font-semibold">Address</h4>
                <p>{selectedPermit.address.house_no} {selectedPermit.address.street}</p>
                <p>{selectedPermit.address.barangay}, {selectedPermit.address.city_municipality}</p>
                <p>{selectedPermit.address.province} {selectedPermit.address.zip_code}</p>
              </div>
              <div>
                <h4 className="font-semibold">Permit</h4>
                <p><strong>Number:</strong> {selectedPermit.permit_number}</p>
                <p><strong>Type:</strong> {selectedPermit.permit_type}</p>
                <p><strong>Purpose:</strong> {selectedPermit.purpose}</p>
                <p><strong>Status:</strong> <span className={getStatusColor(selectedPermit.status)}>{selectedPermit.status}</span></p>
                <p><strong>Assigned:</strong> {selectedPermit.assigned_officer}</p>
              </div>
              <div>
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
                <div className="md:col-span-2 mt-4">
                  <h4 className="font-semibold">Attachment Preview</h4>
                  <div className="border rounded">
                    <iframe src={previewUrl} title="attachment-preview" className="w-full h-96" />
                  </div>
                </div>
              )}
              <div className="md:col-span-2">
                <h4 className="font-semibold">Internal Notes / Review</h4>
                <p>{selectedPermit.internal_notes || selectedPermit.review_comments || '—'}</p>
              </div>
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium mb-1">Assign Officer</label>
                <div className="flex gap-2">
                  <input type="text" value={assignedOfficerInput} onChange={(e) => setAssignedOfficerInput(e.target.value)} placeholder={selectedPermit.assigned_officer || 'Officer name'} className="p-2 border rounded w-full" />
                  <button onClick={handleSaveAssignment} className="px-3 py-2 rounded bg-indigo-600 text-white font-semibold">Save</button>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium mb-1">Review Comment</label>
                <textarea value={actionComment} onChange={(e) => setActionComment(e.target.value)} className="w-full p-2 border rounded" rows={3} placeholder="Add comment for approval/rejection" />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button onClick={handleReject} className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">Reject</button>
                <button onClick={handleApprove} className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700">Approve</button>
                <button
                  className="px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
