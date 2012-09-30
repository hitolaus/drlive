<?php
// Set your return content type
header('Content-type: application/json');

// Website url to open
$daurl = 'http://www.dr.dk/nu/api/videos/newest';

// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>
