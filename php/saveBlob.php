<?php
foreach (array('video'/*, 'audio'*/) as $type){
	if (isset($_FILES["${type}_blob"])) {

		$path	  = $_POST ["path"];
		$fileName = $path . $_POST ["${type}_filename"];
		$tmp_name = $_FILES["${type}_blob"]['tmp_name'];

		echo filesize($tmp_name);

		if (!move_uploaded_file($tmp_name, $fileName)) {
			echo("problem moving uploaded file");
		}

		$erro = $_FILES["${type}_blob"]['error'];
		if ($erro) echo $erro;
	} else
		echo ' no files in FILES';
}
?>