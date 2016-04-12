<?php
$path = utf8_decode($_POST['dir']);
set_time_limit(90);	// 90 sec execution timeout

function getDirectory($path){
	$files = array();
	$ignore = array( 'cgi-bin', '.', '..' );
	$dir = @opendir($path);
	if ($dir == ""){
		echo "* diretório inexistente *";
		exit;
	}
	while (($file = readdir($dir)) !== false){
		if (!in_array($file, $ignore)){
			if (is_dir("$path/$file")){
				$files[utf8_encode($file)] = getDirectory("$path/$file");
			}else{
				$files[] = utf8_encode($file);
			}
		}
	}
	return $files;
	closedir($dir);
}
echo "dir" . json_encode(getDirectory($path))

?>