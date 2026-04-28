<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$apiKey = $input['apiKey'] ?? null;
$secretKey = $input['secretKey'] ?? null;
$endpoint = $input['endpoint'] ?? null;
$payload = $input['payload'] ?? null;

if (!$apiKey || !$secretKey) {
    http_response_code(400);
    echo json_encode(['error' => 'Steadfast API key and secret key are required.']);
    exit;
}

$allowedEndpoints = ['/create_order', '/get_balance'];
if (!in_array($endpoint, $allowedEndpoints)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported Steadfast endpoint.']);
    exit;
}

$baseUrl = 'https://portal.packzy.com/api/v1';
$url = $baseUrl . $endpoint;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Api-Key: ' . $apiKey,
    'Secret-Key: ' . $secretKey,
    'Content-Type: application/json'
]);

if ($endpoint === '/get_balance') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
} else {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload ?: []));
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
