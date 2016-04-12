<?php
$file = utf8_decode($_GET['file']);
$file = str_replace('ziZ', '&', $file);
$file = str_replace('zuZ', '?', $file);
$file = str_replace('zoZ', '%', $file);
//$posi = utf8_decode($_GET['posi']);
//$file = '../buffer/video.mkv'; //$file = 'L:/Lady Gaga - judas.mp4';
$filesize   = showsize($file); // File size [era $filesize=filesize($file);]
//$filesize	= 1024;
//echo $filesize; exit;
$length = $filesize;		// Content length
$start  = 0;				// Start byte
$end    = $filesize - 1;	// End byte
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

//	header("Accept-Ranges: 0-$length");
//	header("Content-Range: bytes $start-$end/$filesize");
//	header("Content-Length: " . $length);

	$buffer = $filesize;
	$txt = fread($fp, $buffer);
	set_time_limit(0);

	$GLOBALS['id3ver'] = findFrame($txt, "ID3");
	$GLOBALS['picType'] = "";
	if ($GLOBALS['id3ver'] == 2){
	// ID3v2.2:
		$image = findFrame($txt, "PIC");
		$result =	// info em http://id3.org/id3v2-00
		  '{"title":"'   . findFrame($txt, "TT2") . '",' .
			'"artist":"' . findFrame($txt, "TP1") . '",' .
			'"band":"'   . findFrame($txt, "TP2") . '",' .
			'"track":"'  . findFrame($txt, "TRK") . '",' .
			'"year":"'   . findFrame($txt, "TYE") . '",' .
			'"album":"'  . findFrame($txt, "TAL") . '",' .
			'"genre":"'  . findFrame($txt, "TCO") . '",' .
			'"disco":"'  . findFrame($txt, "TPA") . '",' .
			'"comm":"'   . findFrame($txt, "COM") . '",' .
			'"picType":"'. $GLOBALS['picType']    . '"}';
		$resultsize = strlen($result);
		$imagesize = strlen($image);
		echo chr($resultsize / 256) . chr($resultsize % 256) . $result . chr($imagesize / 65536) . chr($imagesize / 256) . chr($imagesize % 256) . $image;
	}
	if ($GLOBALS['id3ver'] == 3 || $GLOBALS['id3ver'] == 4){
	// ID3v2.3 e ID3v2.4:
		$image = findFrame($txt, "APIC");
		$result =	// info em http://id3.org/id3v2.4.0-frames
		  '{"title":"'   . findFrame($txt, "TIT2") . '",' .
			'"artist":"' . findFrame($txt, "TPE1") . '",' .
			'"band":"'   . findFrame($txt, "TPE2") . '",' .
			'"track":"'  . findFrame($txt, "TRCK") . '",' .
			'"year":"'   . findFrame($txt, "TYER") . '",' .
			'"album":"'  . findFrame($txt, "TALB") . '",' .
			'"genre":"'  . findFrame($txt, "TCON") . '",' .
			'"comm":"'   . findFrame($txt, "TIT1") . '",' .
			'"ID3ver":"' . $GLOBALS['id3ver']	   . '",' .
			'"picType":"'. $GLOBALS['picType']     . '"}';
		$resultsize = strlen($result);
		$imagesize = strlen($image);
		echo chr($resultsize / 256) . chr($resultsize % 256) . $result . chr($imagesize / 65536) . chr($imagesize / 256) . chr($imagesize % 256) . $image;
	}
}else{
	header ("HTTP/1.0 404 Not Found");
	die();
}
fclose($fp);
exit;


function findFrame($txt, $frame){
	$idx = strpos($txt, $frame);
	if ($idx !== false){
		if ($frame == "ID3") return $idx < 10 ? ord($txt[$idx + 3]) : false;	// se "ID3" se encontra dentro dos 10 primeiros bytes, 2 (ID3v2.2)	ou	3 (ID3v2.3/ID3v2.4)
		if ($GLOBALS['id3ver'] == 2) $size =								  ord($txt[$idx + 3]) * 65536 + ord($txt[$idx + 4]) * 256 + ord($txt[$idx + 5]) - 1;
		else						 $size = ord($txt[$idx + 4]) * 16777216 + ord($txt[$idx + 5]) * 65536 + ord($txt[$idx + 6]) * 256 + ord($txt[$idx + 7]) - 1;
		if ($frame == "APIC"){	// picture frame ID3v2.3: "APIC" (frame) + $xx xx xx xx (frame size) + "image/jpeg" $00 (image format) + $xx (picture type) + <string> $00 + <binary data>
		//	if ($size > 500000)
			$GLOBALS['picType'] = str_replace(chr(0), '', substr($txt, $idx += 11, 10));	// picture type: "image/png",	"image/jpg"	ou	"image/jpeg"
			for ($i = $idx + strlen($GLOBALS['picType']) + 1; $i < $idx + 100; $i++) if (ord($txt[$i]) == 255) break;	// detecta $FF 1º byte da imagem
			$length = $size - $i + $idx;
			return substr($txt, $i, $length);	// image binary data
		};
		if ($frame == "PIC"){	// picture frame ID3v2.2: "PIC" (frame) + $xx xx xx (frame size) + "PNG" (image format) + $xx (picture type) + <string> $00 + 	<binary data>
			$GLOBALS['picType'] = "image/" . substr($txt, $idx += 7, 3);	// picture type: "image/png",	"image/jpg"	ou	"image/jpeg"
			for ($i = $idx + 3 + 1; $i < $idx + 100; $i++) if (ord($txt[$i]) == 255) break;	// detecta $FF 1º byte da imagem
			return substr($txt, $i, $size - $i + $idx);	// image binary data
		};
		if (substr($txt, $idx + 11, 2) == "\xFF\xFE") { $idx += 2; $size -= 2; };
		return str_replace(chr(0), '', substr($txt, $idx + ($GLOBALS['id3ver'] == 2 ? 7 : 11), $size));	// id3v2.2: $xx xx xx    (frame) + $xx xx xx    (string size) + $xx       (text encoding) + <string> $00
	}else return "";									// id3v2.3: $xx xx xx xx (frame) + $xx xx xx xx (string size) + $xx xx xx (text encoding) + <string> $00
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
	}elseif((PHP_OS == 'Linux') || (PHP_OS == 'FreeBSD') || (PHP_OS == 'Unix') || (PHP_OS == 'SunOS'))
		$file = trim(shell_exec("stat -c%s " . escapeshellarg($file)));
	else
		$file = filesize($file);
	return $file;
}
?>