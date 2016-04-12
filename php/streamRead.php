<?php
$aux  = $_GET['file'];
$file = mb_detect_encoding($aux, 'UTF-8', true) ? utf8_decode($aux) : $aux;	// atende firefox e chrome
$file = str_replace('ziZ', '&', $file);
$file = str_replace('zuZ', '?', $file);
$file = str_replace('zoZ', '%', $file);
//$posi = utf8_decode($_GET['posi']);
//$file = '../buffer/video.mkv'; //$file = 'L:/Lady Gaga - judas.mp4';
$size   = showsize($file); // File size [era $size=filesize($file);]
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

//	header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT', true, 304);	// dá erro
//	echo $type; exit;
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
//	if($type=='TXT') header('Content-type: txt/plain');
//	if($type=='PNG') header('Content-type: image/png');
	header("Accept-Ranges: 0-$length");
//	header('Accept-Ranges: bytes');

	if(isset($_SERVER['HTTP_RANGE'])){
		$c_start = $start;
		$c_end   = $end;
		list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2); // Extract the range string
		if(strpos($range, ',') !== false){ // Make sure the client hasn't sent us a multibyte range
			header('HTTP/1.1 416 Requested Range Not Satisfiable');
			header("Content-Range: bytes $start-$end/$size");
			exit;
		}
		// If the range starts with an '-' we start from the beginning
		if($range == '-'){
			$c_start = $size - substr($range, 1);
		}else{ // If not, we forward the file pointer
			$range	= explode('-', $range);
			$c_start  = $range[0];
			$c_end	= (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
		}
		// End bytes can not be larger than $end.
		$c_end = ($c_end > $end) ? $end : $c_end;
		// Validate the requested range and return an error if it's not correct.
		if($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size){
			header('HTTP/1.1 416 Requested Range Not Satisfiable');
			header("Content-Range: bytes $start-$end/$size");
			exit;
		}
		$start  = $c_start;
		$end	= $c_end;
		$length = $end - $start + 1;
	//	fseek($fp, $start);
		my_fseek($fp, $start, 1);
		header('HTTP/1.1 206 Partial Content');
	}

	header("Content-Range: bytes $start-$end/$size");
//	$length = 5000000;
	header("Content-Length: " . $length);

	if($size > (1024 * 1024)) $buffer = 1024 * 64;
	else $buffer = $size;

//	$mm = $start;
	while(!feof($fp) && ($p = ftell($fp)) <= $end){
//	while(!feof($fp) && $p = $end){
//		if($mm != $p){
//			$dummy = 1; 
//		}	
		if($p + $buffer > $end) $buffer = $end - $p + 1; // In case we're only output in a chunk, make sure we don't read past the length
		set_time_limit(0);
		echo fread($fp, $buffer);
//		$mm = $mm + $buffer;
//		$p = $mm;
		ob_flush(); flush();
	}
}else{
	header ("HTTP/1.0 404 Not Found");
	die();
}
fclose($fp);
exit;

// baseado em: http://stackoverflow.com/questions/5924061/using-php-to-output-an-mp4-video
function filesize64($file){
	static $iswin;
	if(!isset($iswin)) $iswin = (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN');

	static $exec_works;
	if(!isset($exec_works)) $exec_works = (function_exists('exec') && !ini_get('safe_mode') && @exec('echo EXEC') == 'EXEC');
	// try a shell command
	if($exec_works){
		$cmd = ($iswin) ? "for %F in (\"$file\") do @echo %~zF" : "stat -c%s \"$file\"";
		@exec($cmd, $output);
		if(is_array($output) && ctype_digit($size = trim(implode("\n", $output)))) return $size;
	}
	// try the Windows COM interface
	if($iswin && class_exists("COM")){
		try{
			$fsobj = new COM('Scripting.FileSystemObject');
			$f = $fsobj->GetFile( realpath($file) );
			$size = $f->Size;
		}catch (Exception $e){
			$size = null;
		}
		if(ctype_digit($size)) return $size;
	}
	// if all else fails
	return filesize($file);
}

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
// baseado em: idem

function my_fseek($fp, $pos, $first=0){
	// set to 0 pos initially, one-time
	if($first) fseek($fp, 0, SEEK_SET);
	// get pos float value
	$pos = floatval($pos);
	// within limits, use normal fseek
	if($pos <= PHP_INT_MAX) fseek($fp, $pos, SEEK_CUR);
	// out of limits, use recursive fseek
	else{
		fseek($fp, PHP_INT_MAX, SEEK_CUR);
		$pos -= PHP_INT_MAX;
		my_fseek($fp, $pos);
	}
}
// baseado em: http://php.net/manual/en/function.fseek.php
?>