<?php

// Website url to open
$proxy_url = 'http://www.dr.dk/nu/api/' . $_SERVER["PATH_INFO"];

if (preg_match("/\.jp(e){0,1}g$/i", $proxy_url)) {
	header('Content-type: image/jpeg');
}
else if (preg_match("/\.png$/i", $proxy_url)) {
	header('Content-type: image/png');
}

// Get that website's content
$handle = fopen($proxy_url, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>
