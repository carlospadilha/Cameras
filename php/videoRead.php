<?php
$file = utf8_decode($_GET['file']);
//$file = '../buffer/video.mkv';
//$file = 'L:/Lady Gaga - judas.mp4';
$size   = filesize($file); // File size
$length = $size;           // Content length
$start  = 0;               // Start byte
$end    = $size - 1;       // End byte
$type = pathinfo($file, PATHINFO_EXTENSION);

if(($handler = fopen($file, 'r')) !== false){

//	header('Content-Disposition: attachment; filename='.basename($file));	// download file
//	header('Content-type: video/mp4');
//	header('Content-type: image/jpeg');
	header("Accept-Ranges: 0-$length");

	if (isset($_SERVER['HTTP_RANGE'])) {
		$c_start = $start;
		$c_end   = $end;
		list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
		if (strpos($range, ',') !== false) {
			header('HTTP/1.1 416 Requested Range Not Satisfiable');
			header("Content-Range: bytes $start-$end/$size");
			exit;
		}
		if ($range == '-') {
			$c_start = $size - substr($range, 1);
		}else{
			$range  = explode('-', $range);
			$c_start = $range[0];
			$c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
		}
		$c_end = ($c_end > $end) ? $end : $c_end;
		if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
			header('HTTP/1.1 416 Requested Range Not Satisfiable');
			header("Content-Range: bytes $start-$end/$size");
			exit;
		}
		$start  = $c_start;
		$end    = $c_end;
		$length = $end - $start + 1;
		fseek($handler, $start);
		header('HTTP/1.1 206 Partial Content');
	}

	header("Content-Range: bytes $start-$end/$size");
	header("Content-Length: ".$length);

	if(filesize($file)>60000) $buffer = 1024 * 8;
	else					  $buffer = filesize($file);
	$buffer = 1024 * 8;
	while (!feof($handler) && ($p = ftell($handler)) <= $end){
		set_time_limit(0);
		if ($p + $buffer > $end) {
			$buffer = $end - $p + 1;
		}
		echo fread($handler, $buffer);
	//	flush();
	}
}
fclose($handler);
exit;
// baseado em: http://stackoverflow.com/questions/5924061/using-php-to-output-an-mp4-video
?>