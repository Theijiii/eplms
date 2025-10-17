import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Download, Calendar, FileText, X, CheckCircle, Clock, Upload, Check } from "lucide-react";

export default function PermitTracker() {
  const [tracking, setTracking] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({});
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [downloadedPermitId, setDownloadedPermitId] = useState("");
  const [uploadedPermitId, setUploadedPermitId] = useState("");
  const [isConfirmBackOpen, setIsConfirmBackOpen] = useState(false); // Back confirmation
  const navigate = useNavigate();

  // Single applicant with different types of permits
  const applicantData = [
    {
      id: "BUS-2024-001",
      permitType: "Business Permit",
      application_type: "New",
      status: "Approved",
      applicantName: "John Smith",
      businessName: "Smith Coffee Shop",
      submittedDate: "2024-01-15",
      approvedDate: "2024-01-25",
      rejectedDate: null,
      expirationDate: "2025-01-24",
      address: "123 Main Street, Cityville",
      contactNumber: "+1-555-0101",
      fees: "$150.00",
      requirements: ["Business Registration", "Tax Identification", "Location Sketch"]
    },
    {
      id: "BLD-2024-002",
      permitType: "Building Permit",
      application_type: "Renewal",
      status: "For Compliance",
      applicantName: "John Smith",
      businessName: "Smith Coffee Shop",
      submittedDate: "2024-02-01",
      approvedDate: null,
      rejectedDate: null,
      expirationDate: "2025-02-01",
      address: "123 Main Street, Cityville",
      contactNumber: "+1-555-0101",
      fees: "$300.00",
      requirements: ["Building Plans", "Structural Calculations", "Site Development Plan"],
      complianceNotes: "Missing structural engineer's stamp on building plans. Please upload revised documents."
    },
    {
      id: "FRN-2024-003",
      permitType: "Franchise Permit",
      application_type: "Special",
      status: "Rejected",
      applicantName: "John Smith",
      businessName: "Smith Coffee Shop",
      submittedDate: "2024-01-20",
      approvedDate: null,
      rejectedDate: "2024-02-05",
      expirationDate: null,
      address: "123 Main Street, Cityville",
      contactNumber: "+1-555-0101",
      fees: "$500.00",
      requirements: ["Franchise Agreement", "Financial Statements", "Business Plan"],
      rejectionReason: "Incomplete financial documentation"
    },
    {
      id: "BRG-2024-004",
      permitType: "Barangay Permit",
      application_type: "New",
      status: "Approved",
      applicantName: "John Smith",
      businessName: "Smith Coffee Shop",
      submittedDate: "2024-02-10",
      approvedDate: "2024-02-12",
      rejectedDate: null,
      expirationDate: "2024-12-31",
      address: "123 Main Street, Cityville",
      contactNumber: "+1-555-0101",
      fees: "$75.00",
      requirements: ["Barangay Clearance", "Community Tax Certificate"]
    },
    {
      id: "ENV-2024-005",
      permitType: "Environmental Permit",
      application_type: "New",
      status: "For Compliance",
      applicantName: "John Smith",
      businessName: "Smith Coffee Shop",
      submittedDate: "2024-02-15",
      approvedDate: null,
      rejectedDate: null,
      expirationDate: "2025-02-14",
      address: "123 Main Street, Cityville",
      contactNumber: "+1-555-0101",
      fees: "$180.00",
      requirements: ["Environmental Impact Assessment", "Waste Management Plan"],
      complianceNotes: "Environmental Impact Assessment requires additional water quality testing data."
    }
  ];

  useEffect(() => {
    // Simulate API call with applicant data
    setTracking(applicantData);
  }, []);

  const filteredTracking = tracking.filter((t) =>
    `${t.permitType} ${t.status} ${t.application_type} ${t.applicantName} ${t.businessName} ${t.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const viewDetails = (permit) => {
    setSelectedPermit(permit);
    setShowModal(true);
  };

  const downloadPermit = (permit) => {
    if (permit.status !== "Approved") {
      alert("Permit can only be downloaded when approved.");
      return;
    }

    // Simulate download process
    const permitContent = `
      OFFICIAL PERMIT DOCUMENT
      ========================
      
      Permit ID: ${permit.id}
      Permit Type: ${permit.permitType}
      Application Type: ${permit.application_type}
      Status: ${permit.status}
      
      Applicant: ${permit.applicantName}
      Business: ${permit.businessName}
      Address: ${permit.address}
      
      Submitted: ${permit.submittedDate}
      Approved: ${permit.approvedDate}
      Expires: ${permit.expirationDate}
      
      Fees Paid: ${permit.fees}
      
      This document serves as official proof of permit approval.
      
      Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([permitContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permit-${permit.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success modal
    setDownloadedPermitId(permit.id);
    setShowDownloadSuccess(true);
  };

  const handleFileUpload = (permitId, event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setUploadFiles(prev => ({
        ...prev,
        [permitId]: Array.from(files)
      }));
      
      // Show upload success modal
      setUploadedPermitId(permitId);
      setShowUploadSuccess(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Rejected":
        return <X className="w-4 h-4 text-red-500" />;
      case "For Compliance":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg min-h-screen flex flex-col">
      <h1 className="text-xl md:text-3xl font-bold mb-2 text-center">
        E-Permit Tracker
      </h1>
      <p className="mb-6 text-center text-sm">
        Track the status of all your permit applications in one place. <br />
        Search by permit type, status, or permit ID.
      </p>

      {/* Applicant Info */}
      <div className="w-full max-w-2xl mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-center">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Applicant Information</h3>
          <p className="text-sm"><strong>Name:</strong> John Smith</p>
          <p className="text-sm"><strong>Applicant ID:</strong> PA20251001</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by permit type, status, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-sm"
        />
      </div>

      {tracking.length === 0 ? (
        <p className="text-gray-500 italic text-center flex-grow text-sm">
          No permit applications submitted
        </p>
      ) : (
        <div className="overflow-x-auto flex-grow">
          <table className="w-full bg-white dark:bg-slate-800 shadow rounded-lg">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permit ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Application Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiration Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTracking.length > 0 ? (
                filteredTracking.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{t.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t.permitType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        t.application_type === 'New' ? 'bg-blue-100 text-blue-800' :
                        t.application_type === 'Renewal' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {t.application_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(t.status)}
                        <span className={`font-medium ${
                          t.status === 'Approved' ? 'text-green-600' :
                          t.status === 'Rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(t.submittedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(t.expirationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewDetails(t)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadPermit(t)}
                          className={`p-2 rounded-lg transition-colors ${
                            t.status === 'Approved' 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title={t.status === 'Approved' ? 'Download Permit' : 'Available when approved'}
                          disabled={t.status !== 'Approved'}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {t.status === "For Compliance" && (
                          <label className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer" title="Upload Compliance Documents">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(t.id, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4 text-sm">
                    No matching permits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedPermit && (
<  div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Permit Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Permit ID:</strong> {selectedPermit.id}</p>
                    <p><strong>Permit Type:</strong> {selectedPermit.permitType}</p>
                    <p><strong>Application Type:</strong> {selectedPermit.application_type}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 ${
                        selectedPermit.status === 'Approved' ? 'text-green-600' :
                        selectedPermit.status === 'Rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {selectedPermit.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Applicant Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Applicant Name:</strong> {selectedPermit.applicantName}</p>
                    <p><strong>Business Name:</strong> {selectedPermit.businessName}</p>
                    <p><strong>Address:</strong> {selectedPermit.address}</p>
                    <p><strong>Contact:</strong> {selectedPermit.contactNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Submitted</p>
                  <p className="font-semibold text-sm">{formatDate(selectedPermit.submittedDate)}</p>
                </div>
                
                {selectedPermit.approvedDate && (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 mx-auto mb-2 text-green-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
                    <p className="font-semibold text-sm">{formatDate(selectedPermit.approvedDate)}</p>
                  </div>
                )}

                {selectedPermit.rejectedDate && (
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <X className="w-5 h-5 mx-auto mb-2 text-red-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
                    <p className="font-semibold text-sm">{formatDate(selectedPermit.rejectedDate)}</p>
                  </div>
                )}

                {selectedPermit.expirationDate && (
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Expires</p>
                    <p className="font-semibold text-sm">{formatDate(selectedPermit.expirationDate)}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedPermit.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {selectedPermit.complianceNotes && (
                <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1 text-sm">Compliance Requirements</h3>
                  <p className="text-sm">{selectedPermit.complianceNotes}</p>
                  <div className="mt-3">
                    <label className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Compliance Documents
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(selectedPermit.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {selectedPermit.rejectionReason && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1 text-sm">Rejection Reason</h3>
                  <p className="text-sm">{selectedPermit.rejectionReason}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-sm"><strong>Fees:</strong> {selectedPermit.fees}</p>
                <button
                  onClick={() => downloadPermit(selectedPermit)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    selectedPermit.status === 'Approved'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={selectedPermit.status !== 'Approved'}
                >
                  <Download className="w-4 h-4" />
                  Download Permit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Success Modal */}
      {showDownloadSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Download Complete!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Permit <strong>{downloadedPermitId}</strong> has been successfully downloaded to your device.
              </p>
              <button
                onClick={() => setShowDownloadSuccess(false)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success Modal */}
      {showUploadSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Files Submitted!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Your compliance documents for permit <strong>{uploadedPermitId}</strong> have been successfully submitted for review.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                You will be notified once your documents have been reviewed.
              </div>
              <button
                onClick={() => setShowUploadSuccess(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsConfirmBackOpen(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>

      {/* Confirm Back Modal */}
      {isConfirmBackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full p-8 text-center">
            <h3 className="text-2xl font-semibold mb-6">Are you sure you want to go back?</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setIsConfirmBackOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/user/dashboard')}
                className="bg-green-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}