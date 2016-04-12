<?php
$host = "tcp://" . $_POST['ip'] . ':' . $_POST['port'];
$aux1 = $_POST['data'];
if ($aux1) $msg1 = hex2bin($aux1);

set_time_limit(0);	// if 0, turn-off execution timeout

$socket = stream_socket_client($host, $errorno, $errorstr, 30);

if (!$socket){
	echo /*"$errorstr ($errorno)<br />\n";*/ null;
}else{

	if ($aux1){
		fwrite($socket, $msg1);
		usleep(200000);					// 200ms delay (espera projetor responder)
		$input = fread($socket, 35);	// fgets stops at a newline. fread stops after a specified (or default) number of bytes
		echo bin2hex($input);			// resposta
	}

	fclose($socket);
}
?>