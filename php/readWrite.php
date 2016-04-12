<?php
$data = $_POST['data'];
$type = $_POST['type'];
$file = utf8_decode($_POST['file']);
if ($type=='w'){
	$fh = fopen($file, 'w') or die("can't open file");
//	set_file_buffer($fh, 500000);
	fwrite($fh, $data);
	echo "true";
}else{
	if(($fh = fopen($file, 'r')) !== false){
	//	echo fread($fh, filesize($file));	// filesize máx.: 66103
/*		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);
		echo fread($fh, 66103);*/

		$tamanho = filesize($file);
		if ($tamanho < 4096) $bloco = $tamanho;
		else $bloco = 4096;

		while ($tamanho > $bloco) {
			echo fread($fh, $bloco);
			$tamanho = $tamanho - $bloco;
		}
		echo fread($fh, $tamanho);

/*		while (!feof($fh)) {
			$data = fgets($fh, 4096);
			echo $data;
		}*/
	}else{
		die("Arquivo/diretório inexistente");
	}
};
fclose($fh);
?>