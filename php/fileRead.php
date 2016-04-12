<?php
$file = utf8_decode($_POST['file']);
$file = str_replace('ziZ', '&', $file);
$file = str_replace('zuZ', '?', $file);
$type = pathinfo($file, PATHINFO_EXTENSION);
$mode = $_POST['mode'];

if (file_exists($file)){
	if ($mode == "delete"){
		unlink($file);
		if (file_exists($file)) echo 'erro';
		else 					echo 'deleted';
	}else{
		if (($handler = fopen($file, 'r')) !== false){
			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream');
		//	header('Content-Type: video/mp4');
		//	header('Content-type: image/png');
			header('Content-Disposition: attachment; filename='.basename($file));
		//	header('Content-Transfer-Encoding: chunked'); //changed to chunked
		//	header("Content-Transfer-Encoding:­ binary");
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header('Pragma: public');
		//	header('Content-Length: ' . filesize($file));	// corta a imagem
	
			$fh = null;
			if ($type == 'mp4' || $type == 'avi' || $type == 'mkv')
				$fh = fopen("../buffer/video." . $type, 'w')/* or die("can't open file")*/;
			if ($type == 'jpg' || $type == 'png')
				$fh = fopen("../buffer/img." . $type, 'w');
			if ($type == 'mp3' || $type == 'wma')
				$fh = fopen("../buffer/audio." . $type, 'w');
			if ($type == 'nfo' || $type == 'txt')
				$fh = fopen("../buffer/texto." . $type, 'w');
	
			if ($fh){
				if(filesize($file)>60000) $filesize = 4096;
				else					  $filesize = filesize($file);
				while(!feof($handler)){
					fwrite($fh, fread($handler, $filesize));
				}
				fclose($fh);
			}
	
			echo $type;
		}else echo 'nop';
		fclose($handler);
	}
}else echo 'nex';
?>