<?php
$tmpFile = $_POST['tempFile'];
$file	 = $_POST['file'];
$path	 = $_POST['path'];

$size = filesize($path . $tmpFile);
echo $size . " ";

$partialSize = 0;
$out = fopen($path . $file,		"ab");
$in  = fopen($path . $tmpFile,	"rb");
if ($in){
	while ($buff = fread($in, 1048576)){
		$partialSize += strlen($buff);
		wFile($partialSize / $size);	// phpReturn refresh
		fwrite($out, $buff);
	}
}
fclose($in);
fclose($out);

$time;
function wFile($data){		// grave percentual em intervalos de 195 ms
	global $time;
	if ((microtime(true) - $time < 0.195) && ($data != 1)) return;
	$time = microtime(true);

	$fh = fopen('../txt/phpReturn.txt', 'w') or die("can't open file");
	fwrite($fh, $data);
	fclose($fh);
};
?>