<?php
// Set your return content type
header('Content-type: application/json');

// Website url to open
$url = 'http://www.dr.dk/NU/api/videos/' . $_GET["id"];

$json = json_decode(file_get_contents($url));

$video_meta_data = array(
	'url' => file_get_contents($json->{'videoManifestUrl'}),
	'title' => $json->{'title'},
	'description' => $json->{'description'},
	'duration' => $json->{'duration'});

echo json_encode($video_meta_data);
?>
