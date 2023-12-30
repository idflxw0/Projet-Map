<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "projectmap";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$userPassword = $data['password'];

$stmt = $conn->prepare("SELECT * FROM user WHERE mail = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($user['password'] === $userPassword) {
        unset($user['password']); // Remove password from response for security

        // Set a cookie with user data
        setcookie("user", json_encode($user), time() + 3600); // Expires in 1 hour

        $resultArray = [
            "user" => $user['Name'],
            "message" => "Login successful",
            "success" => true
        ];
        echo json_encode($resultArray);
    } else {
        echo json_encode(["error" => "Invalid password"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
