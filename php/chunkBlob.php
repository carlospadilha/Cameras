<?php
foreach (array('video'/*, 'audio'*/) as $type){
	if (isset($_FILES["${type}_blob"])) {

		$path	  = $_POST ["path"];
		$fileName = $path . $_POST ["${type}_filename"];
		$tmp_name = $_FILES["${type}_blob"]['tmp_name'];

		echo filesize($tmp_name);

		if (!is_dir($path)) mkdir($path, 0777, true);

		if (is_dir($path)) {

			$out = fopen($fileName, "ab");
			$in  = fopen($tmp_name, "rb");
			if ( $in )
				while ( $buff = fread( $in, 1048576 ) ) fwrite($out, $buff);
			fclose($in);
			fclose($out);
	
			$erro = $_FILES["${type}_blob"]['error'];
			if ($erro) echo " blob erro: " . $erro;

		}

	} else echo ' no files in FILES';
}
?>