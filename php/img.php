<?php
$url = '192.168.1.35';
$userpass = 'user=admin&pwd=admin';

//$cam = "http://$url/videostream.cgi?$userpass";
$cam = "http://192.168.1.35/videostream.cgi?user=admin&pwd=admin";
$image = file_get_contents($cam); // Or use CURL 
$type = 'jpeg';

//$image_src = 'data:image/' . $type . ';base64,' . base64_encode($image);
//echo $image_src;
echo $cam;
?>