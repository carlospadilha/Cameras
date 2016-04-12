<?php
$aux  = $_GET['file'];
$file = mb_detect_encoding($aux, 'UTF-8', true) ? utf8_decode($aux) : $aux;	// atende firefox e chrome
$file = str_replace('ziZ', '&', $file);
$file = str_replace('zuZ', '?', $file);
$file = str_replace('zoZ', '%', $file);
//$posi = utf8_decode($_GET['posi']);
//$file = '../buffer/video.mkv'; //$file = 'L:/Lady Gaga - judas.mp4';
$size   = showsize($file); // File size [era $size=filesize($file);]
//$size	= 1024 * 400;
//echo $size; exit;
$length = $size;			// Content length
$start  = 0;				// Start byte
$end    = $size - 1;		// End byte
$type	= strtoupper(pathinfo($file, PATHINFO_EXTENSION));

//$arr = get_headers($file);
//foreach ($arr as &$value) {if((strpos($value,'Content-Type')!== false)){header($value);}}

// resolveu o problema de npsxxxx.tmp files (AppData/Local/Temp):
if($type == 'MP4' || $type == 'MKV' || $type == 'AVI'){
	header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
	header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT', true);
};

//header('Cache-Control: no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0'); // HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate'); // HTTP/1.1
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache'); // HTTP/1.0

//header('Content-Disposition: attachment; filename='.basename($file));	// download file
//echo $type; exit;
if(($fp = fopen($file, 'r')) !== false){

	if($type=='MP3') header('Content-type: audio/mp3');
	if($type=='MP4') header('Content-type: video/mp4');
	if($type=='MKV') header('Content-type: video/x-matroska');
	if($type=='AVI') header('Content-type: video/mp4');
	if($type=='JPG') header('Content-type: image/jpeg');

	header("Accept-Ranges: 0-$length");
	header("Content-Range: bytes $start-$end/$size");
	header("Content-Length: " . $length);

	$buffer = $size;

	echo fread($fp, $buffer);
}else{
	header ("HTTP/1.0 404 Not Found");
	die();
}
fclose($fp);
exit;

// baseado em: http://stackoverflow.com/questions/5501451/php-x86-how-to-get-filesize-of-2gb-file-without-external-program
function showsize($file){
	if(strtoupper(substr(PHP_OS, 0, 3)) == 'WIN'){
		if(class_exists("COM")){
			$fsobj = new COM('Scripting.FileSystemObject');
			$f = $fsobj->GetFile(realpath($file));
			$file = $f->Size;
		}else{
			$file = trim(exec("for %F in (\"" . $file . "\") do @echo %~zF"));
		}
	}elseif(PHP_OS == 'Darwin'){
		$file = trim(shell_exec("stat -f %z " . escapeshellarg($file)));
	}elseif((PHP_OS == 'Linux') || (PHP_OS == 'FreeBSD') || (PHP_OS == 'Unix') || (PHP_OS == 'SunOS')){
		$file = trim(shell_exec("stat -c%s " . escapeshellarg($file)));
	}else{
		$file = filesize($file);
	}
	return $file;
}
?>