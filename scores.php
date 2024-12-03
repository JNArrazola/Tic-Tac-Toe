<?php
header('Content-Type: application/json');

$game = filter_input(INPUT_GET, 'game', FILTER_SANITIZE_STRING);
$orderAsc = filter_input(INPUT_GET, 'orderAsc', FILTER_VALIDATE_INT);

if (!$game || ($orderAsc !== 0 && $orderAsc !== 1)) {
    echo json_encode(["error" => "Parámetros inválidos."]);
    exit();
}

$url = "http://primosoft.com.mx/games/api/getscores.php?game=$game&orderAsc=$orderAsc";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(["error" => "Error al obtener los puntajes."]);
    exit();
}

echo $response;
?>
