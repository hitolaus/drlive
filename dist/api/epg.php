<?php
header('Content-Type: application/json');
/*
Slugs:
dr1
dr2
dr-ramasjang
dr3
dr-k
dr-update-2

http://www.dr.dk/TV/live/info/<slug>/json
*/
if (isset($_GET["channel"])) {
    $data = info($_GET["channel"]);
    
    //var_dump($data);
    
    $nownext = array('channels' => array(
        channel($data)
    ));
    
    echo json_encode($nownext);
}
else {
    $nownext = array('channels' => array(
        channel(info("dr1")),
        channel(info("dr2")),
        channel(info("dr-ramasjang")),
        channel(info("dr3")),
        channel(info("dr-k")),
        channel(info("dr-update-2")),
    ));
    
    echo json_encode($nownext);
    
}

function info($channel) {
    $json = file_get_contents("http://www.dr.dk/TV/api/live/info/".$channel."/json");
    return json_decode($json);
}

function channel($data) {
    return array(
            'channel' => $data->{'Name'}, 
            'current' => array(
                'programTitle' => $data->{'Now'}->{'Title'}, 
                'startTS' => $data->{'Now'}->{'StartTimestamp'}, 
                'currentServerTimeTS' => $data->{'CurrentServerTimestamp'}, 
                'description' => $data->{'Now'}->{'Description'},
                'start' => $data->{'Now'}->{'Start'},
                'end' => $data->{'Now'}->{'End'}
            ), 
            'next' => array(
                'programTitle' => $data->{'Next'}->{'Title'}, 
                'startTS' => $data->{'Next'}->{'StartTimestamp'}, 
                'currentServerTimeTS' => $data->{'CurrentServerTimestamp'}, 
                'description' => $data->{'Next'}->{'Description'},
                'start' => $data->{'Next'}->{'Start'},
                'end' => $data->{'Next'}->{'End'}
            ),
        );
}
?>