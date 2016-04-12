<?php
$host = $_POST['ip'];;
$port = $_POST['port'];
$msg  = hex2bin($_POST['data']); //#$msg =hex_decode($_POST['data']); //$msg =utf8_decode($_POST['data']);
$mode = $_POST['modo'];

$timeout = 3;

$socket  = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array('sec' => $timeout, 'usec' => 0));
//Set up to send to port 8000, change to any port
socket_connect($socket, $host, $port);

socket_send($socket, $msg, strLen($msg), 0);

if ($mode == "d") exit;

$buf = "";
$from = "";
//$port = 0;

$bytes = 32;

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

@socket_recvfrom($socket , $buf , $bytes , 0 , $from , $port );
echo bin2hex($buf); //#echo utf8_encode($buf);

socket_close($socket);


function hex_decode($string)  { 
	$decoded="";
	for ($i=0; $i < strlen($string); $i)  { 
		$decoded .= chr(hexdec(substr($string,$i,2))); 
		$i = (float)($i)+2; 
	} 
	return $decoded; 
} 
?>
