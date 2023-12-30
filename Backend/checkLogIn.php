<?php
header('Content-Type: application/json');

if (isset($_COOKIE['user'])) {
    $userData = json_decode($_COOKIE['user'], true);
    // Optionally, add additional checks here if needed
    echo json_encode(["loggedIn" => true, "userData" => $userData]);
} else {
    echo json_encode(["loggedIn" => false]);
}
