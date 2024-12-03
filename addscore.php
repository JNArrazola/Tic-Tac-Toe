<?php
header('Content-Type: application/json');

$score = filter_input(INPUT_POST, 'score', FILTER_VALIDATE_INT);
$player = filter_input(INPUT_POST, 'player', FILTER_SANITIZE_STRING);
$game = filter_input(INPUT_POST, 'game', FILTER_SANITIZE_STRING);

if (!$score || !$player || !$game) {
    echo json_encode(["error" => "Datos inválidos."]);
    exit();
}

$player = urlencode($player);

$url = "http://primosoft.com.mx/games/api/addscore.php";

$postData = http_build_query([
    'score' => $score,
    'player' => $player,
    'game' => $game,
]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(["error" => "Error al guardar el puntaje."]);
    exit();
}

echo $response;
?>
