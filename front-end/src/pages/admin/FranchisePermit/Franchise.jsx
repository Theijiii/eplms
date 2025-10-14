import { useEffect, useState, useMemo } from "react";
import { logTx } from '../../../lib/txLogger';

export default function FranchisePermit() {
  const [franchise, setFranchise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI: visible toggle to switch between TODA (Caloocan) and All
  const [showOnlyTODA, setShowOnlyTODA] = useState(true);

  // persisted overrides for TODA detection: { [id]: boolean }
  const [todaOverrides, setTodaOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('franchise_toda_overrides') || '{}');
    } catch (e) { return {}; }
  });

  // modal / admin actions state
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedOfficerInput, setAssignedOfficerInput] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Expanded TODA heuristics
  const caloocanKeywords = [
    'caloocan', 'bagong barrio', 'bagumbong', 'deparo', 'camarin', 'tala', 'monumento', 'bagumbong', 'marilao'
  ];

  const looksLikeTODAWithReasons = (entry) => {
    const reasons = [];
    try {
      const name = (entry.name || '').toString().toLowerCase();
      const opToda = ((entry.operation && entry.operation.toda_name) || entry.toda_name || '').toString().toLowerCase();
      const app = ((entry.applicant && (entry.applicant.contact_person || entry.applicant.full_name || entry.applicant.first_name)) || '').toString().toLowerCase();
      const location = ((entry.location || entry.applicant && (entry.applicant.home_address || entry.applicant.address) || entry.operation && entry.operation.barangay_of_operation) || '').toString().toLowerCase();
      const route = (entry.operation && entry.operation.route_zone || '').toString().toLowerCase();

      // direct indicators
      if (opToda && opToda.includes('toda')) reasons.push(`operation.toda_name contains "${opToda.split('toda')[0].trim()}"`);
      if (name && name.includes('toda')) reasons.push(`name contains "${name}"`);
      if (app && app.includes('toda')) reasons.push(`applicant contains "${app}"`);

      // vehicle/keywords hints
      const vehicleType = (entry.vehicle && (entry.vehicle.vehicle_type || entry.vehicle.make_brand) || '').toString().toLowerCase();
      if (vehicleType && (vehicleType.includes('tricycle') || vehicleType.includes('trike') || vehicleType.includes('trike'))) reasons.push('vehicle indicates tricycle/trike');
      if (route && route.includes('terminal')) reasons.push('route contains "terminal"');

      // fallback: route or location containing keyword 'toda' or common tricycle keywords
      const combined = [opToda, name, app, location, route].join(' ');
      if (combined.includes('toda')) reasons.push('combined fields include "toda"');
      if (combined.includes('tricycle') || combined.includes('trike')) reasons.push('combined fields include tricycle/trike');

      return { isTODA: reasons.length > 0, reasons };
    } catch (e) {
      return { isTODA: false, reasons: [] };
    }
  };

  // improved Caloocan detection using keywords
  const locatedInCaloocan = (entry) => {
    try {
      const fields = [
        entry.location,
        entry.applicant && (entry.applicant.home_address || entry.applicant.contact_address || entry.applicant.address),
        entry.operation && (entry.operation.barangay_of_operation || entry.operation.route_zone),
        entry.internal_notes,
        entry.submitted_at,
        entry.permit && (entry.permit.issued || entry.permit.permitNo),
      ].filter(Boolean).map(String).join(' ').toLowerCase();

      // check for explicit 'caloocan'
      if (fields.includes('caloocan')) return true;

      // check known barangays / keywords
      return caloocanKeywords.some((k) => fields.includes(k));
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // load the mock JSON directly (dev-only)
    Promise.all([
      fetch("/src/lib/mock/franchiseAdmin.mock.json").then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }).catch(() => []),
      // load localStorage submissions saved by the form (if any)
      new Promise((resolve) => {
        try {
          const store = JSON.parse(localStorage.getItem('mock_franchise_submissions') || '[]');
          // normalize stored entries into admin-like shape
          const normalized = (store || []).map((s) => ({
            id: s.id || `LOCAL-${s.created_at}`,
            name: s.form.full_name || 'Local Submission',
            location: s.form.home_address || '',
            permit: { permitNo: s.id || `LOCAL-${s.created_at}`, issued: s.form.date_submitted || '', expiry: '', status: 'Pending' },
            submitted_at: s.created_at,
            last_updated: s.created_at,
            assigned_officer: '',
            review_status: 'Not Reviewed',
            review_comments: '',
            applicant: {
              contact_person: s.form.full_name,
              contact_number: s.form.contact_number,
              email: s.form.email
            },
            attachments: Array.isArray(s.form.attachments) ? s.form.attachments : [] ,
            internal_notes: 'Saved locally from Franchise form',
            // include any operation/toda info if present on the saved form so we can detect TODA
            operation: s.form.operation || s.form,
            vehicle: s.form.vehicle || null,
          }));
          resolve(normalized);
        } catch (e) { resolve([]); }
      })
    ]).then(([remoteList, localList]) => {
      try {
        // For initial load we will still merge local and remote, but keep everything; the visible toggle controls filtering.
        const remote = Array.isArray(remoteList) ? remoteList : [];
        const local = Array.isArray(localList) ? localList : [];
        // merge: local submissions first so admins see recent local entries
        setFranchise([...(local || []), ...(remote || [])]);
      } catch (e) {
        console.error('Error merging franchise lists:', e);
        setFranchise([]);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Franchise Permit Service error:", err);
      setError("Failed to load franchise permits.");
      setLoading(false);
    });
  }, []);

  // toggle override and persist
  const setOverride = (id, value) => {
    setTodaOverrides((prev) => {
      const next = { ...(prev || {}), [id]: !!value };
      try { localStorage.setItem('franchise_toda_overrides', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // decide per-entry final TODA status
  const isFinalTODA = (entry) => {
    if (!entry) return false;
    const override = todaOverrides && Object.prototype.hasOwnProperty.call(todaOverrides, entry.id) ? !!todaOverrides[entry.id] : undefined;
    if (override !== undefined) return override;
    const detected = looksLikeTODAWithReasons(entry);
    return detected.isTODA && locatedInCaloocan(entry);
  };

  // compute the visible list depending on the toggle
  const filteredFranchise = useMemo(() => {
    if (!franchise || franchise.length === 0) return [];
    if (!showOnlyTODA) return franchise;
    return franchise.filter((r) => isFinalTODA(r));
  }, [franchise, showOnlyTODA, todaOverrides]);

  // KPI counters (based on visible list)
  const total = filteredFranchise.length;
  const approved = filteredFranchise.filter((p) => p.permit.status === "Approved").length;
  const rejected = filteredFranchise.filter((p) => p.permit.status === "Rejected").length;
  const pending = filteredFranchise.filter((p) => p.permit.status === "Pending").length;

  const detectedTODAcount = useMemo(() => {
    return (franchise || []).reduce((acc, f) => acc + (isFinalTODA(f) ? 1 : 0), 0);
  }, [franchise, todaOverrides]);

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
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPermit(null);
    setAssignedOfficerInput("");
    setActionComment("");
    setPreviewUrl("");
    setIsModalOpen(false);
  };

  const updatePermitStatus = (id, status, comment) => {
    setFranchise((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              permit: { ...p.permit, status },
              review_status: status === "Approved" ? "Approved" : status === "Rejected" ? "Rejected" : p.review_status,
              review_comments: comment || p.review_comments,
              last_updated: new Date().toISOString(),
            }
          : p
      )
    );

    setSelectedPermit((prev) => (prev && prev.id === id ? { ...prev, permit: { ...prev.permit, status }, review_comments: comment || prev.review_comments } : prev));
  };

  const handleApprove = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Approved", actionComment);
    try { logTx({ service: 'franchise', permitId: selectedPermit.id, action: 'approve', comment: actionComment }); } catch(e) {}
  };

  const handleReject = () => {
    if (!selectedPermit) return;
    updatePermitStatus(selectedPermit.id, "Rejected", actionComment);
    try { logTx({ service: 'franchise', permitId: selectedPermit.id, action: 'reject', comment: actionComment }); } catch(e) {}
  };

  const handleSaveAssignment = () => {
    if (!selectedPermit) return;
    setFranchise((prev) => prev.map((p) => (p.id === selectedPermit.id ? { ...p, assigned_officer: assignedOfficerInput, last_updated: new Date().toISOString() } : p)));
    setSelectedPermit((prev) => (prev ? { ...prev, assigned_officer: assignedOfficerInput } : prev));
    try { logTx({ service: 'franchise', permitId: selectedPermit.id, action: 'assign', comment: `assigned:${assignedOfficerInput}` }); } catch(e) {}
  };

  const handlePreview = (url) => {
    setPreviewUrl(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Franchise Permits Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Overview of submitted franchise permits (mock)</p>
          <p className="text-sm text-gray-500 mt-1">Detected TODA (Caloocan): <strong>{detectedTODAcount}</strong></p>
        </div>

        {/* Visible toggle */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">Show only TODA (Caloocan)</label>
            <input type="checkbox" checked={showOnlyTODA} onChange={(e) => setShowOnlyTODA(e.target.checked)} className="w-5 h-5" />
          </div>
          <div className="text-xs text-gray-500">Toggle to view only TODA entries. You may override detection per row.</div>
        </div>
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
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading permits...</p>}
      {error && <div className="mb-4 text-red-600 dark:text-red-400 font-semibold">{error}</div>}
      {!loading && franchise.length === 0 && <p className="text-gray-500 dark:text-gray-400">No permits available.</p>}

      {/* Table */}
      {!loading && filteredFranchise.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Franchise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TODA?</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permit No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFranchise.map((p) => {
                const detected = looksLikeTODAWithReasons(p);
                const finalTODA = isFinalTODA(p);
                return (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${finalTODA ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{finalTODA ? 'TODA' : '—'}</span>
                      <button onClick={() => setOverride(p.id, !finalTODA)} className="text-xs px-2 py-0.5 border rounded">{finalTODA ? 'Mark not TODA' : 'Mark TODA'}</button>
                    </div>
                    {detected.reasons && detected.reasons.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">{detected.reasons.slice(0,2).join('; ')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.permit.permitNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.permit.issued}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.permit.expiry}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.permit.status)}`}>{p.permit.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => openModal(p)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">View</button>
                  </td>
                </tr>
                )})}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (simple) */}
      {isModalOpen && selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Permit Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPermit.permit.permitNo} • {selectedPermit.name}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPermit.applicant.contact_person}</p>
                <p className="text-sm text-gray-500 mt-2">Contact: {selectedPermit.applicant.contact_number}</p>
                <p className="text-sm text-gray-500">Email: {selectedPermit.applicant.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPermit.location}</p>
                <p className="text-sm text-gray-500 mt-2">Assigned: {selectedPermit.assigned_officer || '—'}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Assign Officer</label>
              <input
                value={assignedOfficerInput}
                onChange={(e) => setAssignedOfficerInput(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white"
                placeholder="Enter officer name"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={handleSaveAssignment} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Save</button>
                <button onClick={() => { setAssignedOfficerInput(selectedPermit.assigned_officer || ""); }} className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-sm rounded">Reset</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Review Comment</label>
              <textarea
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white"
                rows={3}
                placeholder="Add a comment for approval or rejection"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Attachments</p>
              <ul className="space-y-2">
                {selectedPermit.attachments?.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-200">{a.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handlePreview(a.url)} className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 rounded">Preview</button>
                    </div>
                  </li>
                ))}
              </ul>
              {previewUrl && (
                <div className="mt-3 h-64">
                  <iframe src={previewUrl} title="preview" className="w-full h-full border rounded" />
                </div>
              )}
            </div>

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
