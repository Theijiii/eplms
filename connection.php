<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');

// ✅ Database credentials
$host = "localhost";
$password = "EPLMS";

// Map database names to users
$databases = [
    'eplms_applicants_db'           => 'eplms_than',
    'eplms_barangay_clearance_db'   => 'eplms_kim',
    'eplms_building_permit_system'  => 'eplms_thei',
    'eplms_franchise_applications'  => 'eplms_kobe',
    'eplms_business_permit_system'  => 'eplms_thea',
];

// ✅ Determine target database (use ?db= parameter or default)
$targetDb = $_GET['db'] ?? 'eplms_applicants_db';
$targetDb = $_GET['db'] ?? 'eplms_barangay_clearance_db';
$targetDb = $_GET['db'] ?? 'eplms_building_permit_system';
$targetDb = $_GET['db'] ?? 'eplms_franchise_applications';
$targetDb = $_GET['db'] ?? 'eplms_business_permit_system';


if (!isset($databases[$targetDb])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Unknown database: $targetDb"]);
    exit;
}

// ✅ Create connection
$dbUser = $databases[$targetDb];
$conn = mysqli_connect($host, $dbUser, $password, $targetDb);

if (!$conn) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => mysqli_connect_error()]);
    exit;
}

// ✅ Set charset
mysqli_set_charset($conn, "utf8mb4");

// ✅ Handle preflight OPTIONS request (optional, only needed if you ever serve cross-origin requests)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Connection is ready to be used
// Example: $result = mysqli_query($conn, "SELECT * FROM some_table");
?>
