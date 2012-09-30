<?php
require_once('Cache.class.php');

$cache = new Cache();

$c = $cache->get($_GET["channel"]);
if (!$c) {
    $c = array();
}

header('Content-Type: application/json');

if (isset($_GET["update"]))
{
    $c[$_SERVER['REMOTE_ADDR']] = time();

    $cache->set($_GET["channel"], $c);

}

$count = 0;
foreach($c as $address => $lastVisit) 
{
    if ($lastVisit < time() - 60)
    {
        unset($c[$address]);

    }
    else {
        $count++;
    }
}
$cache->set($_GET["channel"], $c);

echo '{"channel": "'.$_GET["channel"].'", "count":'.$count.'}';
?>
