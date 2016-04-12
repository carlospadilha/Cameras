<?php
$url = $_POST["ipport"];
$idx = $_POST["i"];
if ($idx == 1){
	$userpass1 = 'user=admin&pwd=admin';
	echo "$url/videostream.cgi?$userpass1";
}
if ($idx == 5){
	$userpass5 = 'user=admin&pwd=';
	echo "$url/videostream.cgi?$userpass5";
}
?>