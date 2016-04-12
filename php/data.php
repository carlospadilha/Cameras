<?php
$file = $_POST['file'];
$data = $_POST['data'];
$type = $_POST['type'];

if ($type=='w'){
	$fh = fopen($file, 'w') or die("can't open file");
	fwrite($fh, $data);
	echo "true";
}else{
	$fh = fopen($file, 'r') or die("can't open file");
	if ($fh) {
		while (!feof($fh)) {
			$data = fgets($fh, 4096);
			echo $data;
		}
	}
};
fclose($fh);
?>