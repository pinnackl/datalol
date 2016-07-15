<?php

$apikey = "RGAPI-867226E0-C67A-4686-88B0-9F027A3D4CA8";
$summonerId = $_GET["summonerId"];
$url = "https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/" . $summonerId . "?api_key=" . $apikey;

if(isset($_GET["method"]) && $_GET["method"] == "getCurrentGame") {
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$data = curl_exec($ch);
	$info = curl_getinfo($ch);
	echo $data;die;
}

?>