<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json'); // Ensure the response is of type JSON

function createResponse($name, $email, $password) {
    // Create a response array
    $responseArray = [
        "message" => "hey " . $name . "! you are connected!",
        "user" => $name,
        "email" => $email,
        "password" => $password,
        "success" => true
    ];

    // Return the JSON-encoded response
    return json_encode($responseArray);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    //dtatbase connection
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "projectmap";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    // Get the email and password from the request body
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];

    // Prepare a statement to check if the email exists in the database
    $stmt = $conn->prepare("SELECT * FROM user WHERE mail = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // If the email exists, return an error
    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Email already exists"]);
        exit();
    }

    // Prepare a statement to insert the user into the database
    $stmt = $conn->prepare("INSERT INTO user (Name, mail, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password);
    $stmt->execute();

    echo json_encode([
        "message" => "User created successfully",
        "user" => $name,
        "success" => true
    ]);

    // Close the connection and statement
    $stmt->close();
    $conn->close();

    // Call the function and echo its return value
    //echo createResponse($name,$email, $password);
}
?>
