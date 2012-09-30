<?php

header('Content-type: application/json');

if (!isset($_COOKIE["boxee_dr_live_tv_favorites"])) {
	echo '[]';
	return;
	
}

$favorties = explode(',', $_COOKIE["boxee_dr_live_tv_favorites"]);

echo '[';
$first = true;
while (list(, $f) = each($favorties)) {
	$e = explode(':::', $f);

	$title = $e[0];
	$slug = $e[1];

	if ($title == "" || $slug == "") {
		continue;
	}

	if ($first === false) {
		echo ',';
	}
	
	echo '{';
	echo '"title":"'.$title.'",';
	echo '"slug":"'.$slug.'"';
	echo '}';
	
	$first = false;
}
echo ']';

unset($f);
?>
