<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
ob_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Database ---
$targetDb = 'eplms_business_permit_system';
include '../../connection.php';

if (!isset($databases[$targetDb])) {
    echo json_encode(["success" => false, "message" => "Database config not found for $targetDb"]);
    exit;
}

$host = "localhost";
$user = $databases[$targetDb];
$password = "mypassword";
$dbname = $targetDb;

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB Connection failed: " . $conn->connect_error]);
    exit;
}

// --- Helper Functions ---
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function handleFileUpload($fileField, $uploadDir) {
    if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        $fileTmp = $_FILES[$fileField]['tmp_name'];
        $fileName = time() . "_" . basename($_FILES[$fileField]['name']);
        if (move_uploaded_file($fileTmp, $uploadDir . $fileName)) {
            return $fileName;
        }
    }
    return null;
}

// --- Upload folder ---
$uploadDir = __DIR__ . "/uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// --- File upload handling ---
$fileFields = [
    // Owner Information
    'owner_valid_id', 'id_picture', 'owner_scanned_id',
    
    // Business Attachments
    'barangay_clearance', 'registration_doc', 'bir_certificate',
    'lease_or_title', 'fsic', 'sanitary_permit', 'zoning_clearance',
    'occupancy_permit', 'official_receipt_file'
];

$uploadedFiles = [];
foreach ($fileFields as $field) {
    $uploadedFile = handleFileUpload($field, $uploadDir);
    if ($uploadedFile) {
        $uploadedFiles[$field] = $uploadedFile;
    }
}

// --- Process form fields ---
$formData = [];

// Process POST data
foreach ($_POST as $key => $val) {
    // Handle checkbox/boolean values
    if ($val === 'true' || $val === 'false') {
        $formData[$key] = $val === 'true' ? 1 : 0;
    } 
    // Handle numeric values
    elseif (is_numeric($val) && in_array($key, [
        'corp_filipino_percent', 'corp_foreign_percent', 'capital_investment',
        'number_of_employees', 'total_floor_area', 'total_employees',
        'male_employees', 'female_employees', 'lgu_resident_employees',
        'delivery_van_truck', 'delivery_motorcycle'
    ])) {
        $formData[$key] = floatval($val);
    }
    // Handle empty strings for optional fields
    elseif ($val === '') {
        $formData[$key] = null;
    }
    // Regular string fields
    else {
        $formData[$key] = sanitize($val);
    }
}

// Handle time fields with AM/PM
if (!empty($formData['operation_from_time']) && !empty($formData['operation_from_ampm'])) {
    $formData['operation_from_time'] = $formData['operation_from_time'] . ' ' . $formData['operation_from_ampm'];
}

if (!empty($formData['operation_to_time']) && !empty($formData['operation_to_ampm'])) {
    $formData['operation_to_time'] = $formData['operation_to_time'] . ' ' . $formData['operation_to_ampm'];
}

// Set default application date if not provided
if (empty($formData['application_date'])) {
    $formData['application_date'] = date('Y-m-d');
}

if (empty($formData['date_submitted'])) {
    $formData['date_submitted'] = date('Y-m-d');
}

// Combine file attachments into JSON
$formData['file_attachments'] = json_encode($uploadedFiles);

// Add timestamp
$formData['created_at'] = date('Y-m-d H:i:s');
$formData['updated_at'] = date('Y-m-d H:i:s');

// --- Insert into Database ---
$table = "permit_applications";

// Prepare columns and values
$columns = [];
$placeholders = [];
$values = [];

foreach ($formData as $column => $value) {
    $columns[] = $column;
    $placeholders[] = '?';
    
    if ($value === null) {
        $values[] = null;
    } else {
        $values[] = $value;
    }
}

$columnsStr = implode(", ", $columns);
$placeholdersStr = implode(", ", $placeholders);

$sql = "INSERT INTO $table ($columnsStr) VALUES ($placeholdersStr)";

try {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $types = '';
    $params = [];
    
    foreach ($values as $value) {
        if ($value === null) {
            $types .= 's'; // Use string for NULL
            $params[] = null;
        } elseif (is_int($value)) {
            $types .= 'i';
            $params[] = $value;
        } elseif (is_float($value)) {
            $types .= 'd';
            $params[] = $value;
        } else {
            $types .= 's';
            $params[] = $value;
        }
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        $applicationId = $conn->insert_id;
        echo json_encode([
            "success" => true, 
            "message" => "Business permit application submitted successfully.",
            "application_id" => $applicationId
        ]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Business Permit Submission Error: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Submission failed: " . $e->getMessage()
    ]);
}

$conn->close();
ob_end_flush();
exit;
?>