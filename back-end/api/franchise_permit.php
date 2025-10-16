<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
ob_start();

// ✅ Show errors for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ --- Database ---
$targetDb = 'eplms_franchise_applications';
include '../../connection.php';

// ✅ --- Helper ---
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// ✅ --- File Upload Setup ---
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

$fileFields = [
    'proof_of_residency', 'barangay_clearance', 'toda_endorsement', 'lto_or_cr',
    'insurance_certificate', 'drivers_license', 'emission_test', 'id_picture',
    'official_receipt', 'affidavit_of_ownership', 'police_clearance',
    'tricycle_body_number_picture', 'toda_president_cert',
    'franchise_fee_receipt', 'sticker_id_fee_receipt', 'inspection_fee_receipt'
];

$uploadedFiles = [];
foreach ($fileFields as $f) {
    if (!empty($_FILES[$f]['tmp_name']) && $_FILES[$f]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$f]['tmp_name'];
        $fileName = time() . "_" . basename($_FILES[$f]['name']);
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            $uploadedFiles[$f] = $fileName;
        }
    }
}

// ✅ --- Collect Fields ---
$formData = [];
foreach ($_POST as $key => $val) {
    $formData[$key] = sanitize($val);
}

// ✅ --- Required Fields ---
$requiredFields = [
    'full_name', 'home_address', 'contact_number', 'email',
    'citizenship', 'birth_date', 'id_type', 'id_number',
    'make_brand', 'model', 'engine_number', 'chassis_number',
    'plate_number', 'year_acquired', 'color', 'vehicle_type',
    'lto_or_number', 'lto_cr_number', 'lto_expiration_date', 'mv_file_number',
    'toda_name', 'route_zone', 'barangay_of_operation', 'district',
    'applicant_signature', 'barangay_captain_signature', 'date_submitted'
];

foreach ($requiredFields as $f) {
    if (!isset($formData[$f])) {
        $formData[$f] = '';
    }
}

// ✅ --- Handle Dates ---
$dateFields = ['birth_date', 'lto_expiration_date', 'date_submitted'];
foreach ($dateFields as $d) {
    if (empty($formData[$d]) || $formData[$d] === '0000-00-00') {
        $formData[$d] = date('Y-m-d');
    }
}

// ✅ --- Handle Integers ---
$intFields = ['year_acquired'];
foreach ($intFields as $i) {
    if (empty($formData[$i]) || !is_numeric($formData[$i])) {
        $formData[$i] = 0;
    } else {
        $formData[$i] = intval($formData[$i]);
    }
}

// ✅ Include uploaded files
$formData['file_attachments'] = json_encode($uploadedFiles, JSON_UNESCAPED_SLASHES);

// ✅ Default submission timestamp
if (empty($formData['date_submitted'])) {
    $formData['date_submitted'] = date("Y-m-d H:i:s");
}

// ✅ Remove unused frontend fields
unset($formData['attachments']);

// ✅ --- Build SQL ---
$table = "franchise_applications";
$columns = implode(", ", array_keys($formData));

$values = implode(", ", array_map(function($v) use ($conn) {
    if (is_null($v)) return "NULL";
    return "'" . $conn->real_escape_string($v) . "'";
}, array_values($formData)));

$sql = "INSERT INTO `$table` ($columns) VALUES ($values)";

// ✅ --- Execute ---
if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Application submitted successfully."]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $conn->error,
        "sql" => $sql
    ]);
}

$conn->close();
ob_end_flush();
exit;
?>
