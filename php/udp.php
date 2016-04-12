<?php
$ip_send = $_POST['ip'];
//$ip_recv = $_POST['iplocal'];
$port	 = $_POST['port'];
$msg	 = hex2bin($_POST['data']);
$mode	 = $_POST['mode'];		// snd: somente envia	rcv: envia e recebe		brd: broadcast

$timeout = 4;

// send packet
$socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO/*SO_BROADCAST*/, array('sec' => $timeout, 'usec' => 0));
socket_connect($socket, $ip_send, $port);
$s = socket_send($socket, $msg, strLen($msg), 0);

// Port to listen
if ($mode == "brd"){
	socket_close($socket);
	$ip_recv = getenv('SERVER_ADDR');	// broadcasting: resposta vem para o ip onde está udp.php (servidor apache)
	$mysock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
	socket_bind($mysock, $ip_recv, $port) or die('#erro ip recv: ' . $ip_recv); 
	$r = socket_recv($mysock, $buf, 512, 0);
	echo bin2hex($buf);
	socket_close($mysock);
}
if ($mode == "rcv"){
	$r = socket_recv($socket, $buf, 512, 0);
	echo bin2hex($buf);
	socket_close($socket);
}
if ($mode == "snd"){
	echo bin2hex("");
	socket_close($socket);
}
?>