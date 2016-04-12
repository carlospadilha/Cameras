<?php
$host = "tcp://" . $_POST['ip'] . ':' . $_POST['port'];
$aux1 = $_POST['data1']; if ($aux1) $msg1 = hex2bin($aux1);	// login
$aux2 = $_POST['data2']; if ($aux2) $msg2 = hex2bin($aux2);	// senha
$aux3 = $_POST['data3']; if ($aux3) $msg3 = hex2bin($aux3);	// cmd 1
$aux4 = $_POST['data4']; if ($aux4) $msg4 = hex2bin($aux4);	// cmd 2
$aux5 = $_POST['data5'];			// comando duplo ?

//set_time_limit(0);	// if 0, turn-off execution timeout

$socket = stream_socket_client($host, $errorno, $errorstr, 5);

if (!$socket) {
	echo /*"$errorstr ($errorno)<br />\n";*/ null;
}else{
	if ($aux1) fwrite($socket, $msg1);	// login
	if ($aux2) fwrite($socket, $msg2);	// senha
	if ($aux3) fwrite($socket, $msg3);	// 1º comando
	if ($aux4) fwrite($socket, $msg4);	// 2º comando

	$input = fread($socket, 79);// fgets stops at a newline. fread stops after a specified (or default) number of bytes
	echo bin2hex($input);		// resposta do 1º comando de leitura
	
	if ($aux5){					// dupla leitura?
		$input = fread($socket, 79);
		echo bin2hex($input);	// resposta do 2º comando de leitura
	}

	fclose($socket);
}
?>