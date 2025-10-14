<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ob_start();

// ✅ Show errors for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ --- CORS Configuration ---
// --- CORS FIX ---
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If it's a preflight request (OPTIONS), stop here
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ✅ --- Database ---
$targetDb = 'eplms_franchise_applications';
include '../../connection.php';

// ✅ --- Helper Function ---
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// ✅ --- Upload folder ---
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// ✅ --- File Upload Handling ---
$fileFields = [
    'proof_of_residency', 'barangay_clearance', 'toda_endorsement', 'lto_or_cr',
    'insurance_certificate', 'drivers_license', 'emission_test', 'id_picture',
    'official_receipt', 'affidavit_of_ownership', 'police_clearance',
    'tricycle_body_number_picture', 'toda_president_cert',
    'franchise_fee_receipt', 'sticker_id_fee_receipt', 'inspection_fee_receipt'
];

$uploadedFiles = [];
foreach ($fileFields as $f) {
    if (isset($_FILES[$f]) && $_FILES[$f]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$f]['tmp_name'];
        $fileName = time() . "_" . basename($_FILES[$f]['name']);
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            $uploadedFiles[$f] = $fileName;
        }
    }
}

// ✅ --- Process Form Fields ---
$formData = [];
foreach ($_POST as $key => $val) {
    $formData[$key] = ($val === '1' || $val === '0') ? intval($val) : sanitize($val);
}

// ✅ Map uploaded files to JSON column
$formData['file_attachments'] = json_encode($uploadedFiles, JSON_UNESCAPED_SLASHES);

// ✅ Add submission date if missing
if (empty($formData['date_submitted'])) {
    $formData['date_submitted'] = date("Y-m-d H:i:s");
}

// ✅ Remove unnecessary fields
unset($formData['attachments']);

// ✅ --- Insert into DB ---
$table = "franchise_applications";

$columns = implode(", ", array_keys($formData));
$values  = implode(", ", array_map(fn($v) => "'" . $conn->real_escape_string($v) . "'", array_values($formData)));

$sql = "INSERT INTO $table ($columns) VALUES ($values)";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Application submitted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to submit: " . $conn->error]);
}

$conn->close();
ob_end_flush();
exit;
?>
