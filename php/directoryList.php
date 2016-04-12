<?php
$path = utf8_decode($_POST['dir']);
/*$mode = $_POST['mode'];*/
set_time_limit(90);	// se 0, turn-off execution timeout


/* rotina #1 */
/*function dirToArray($dir){
    $contents=array();
    foreach(scandir($dir) as $node){
        if($node == '.' || $node == '..') continue;
        if(is_dir($dir . '/' . $node)){
            $contents[utf8_encode($node)]=dirToArray($dir . '/' . $node);
        }else{
            $contents[]=utf8_encode($node);
        }
    }
    return $contents;
}
echo "dir" . json_encode(dirToArray($path));*/



/* rotina #2 */
/*function dirToArray(DirectoryIterator $dir){
	$data=array();
	foreach($dir as $node){
		if($node->isDir() && !$node->isDot()){
			$data[utf8_encode($node->getFilename())] = dirToArray( new DirectoryIterator( $node->getPathname() ) );
		}else if($node->isFile()){
			$data[]=utf8_encode($node->getFilename());
		}
	}
	return $data;
}
echo "dir" . json_encode(dirToArray(new DirectoryIterator($path)));*/



/* rotina #3 */
/*function getDirectory($path){
	$files = array();
	$ignore = array( 'cgi-bin', '.', '..' );
	$dir = @opendir($path);	
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
echo "dir" . json_encode(getDirectory($path))*/



/* rotina #3b */
function getDirectory($path){
	$files = array();
	$ignore = array( 'cgi-bin', '.', '..' );
	$dir = @opendir($path);
	if ($dir == ""){ echo "* diretório inexistente *"; exit; }
	// phpReturn setup:
	$dirCount = 0;
	$dirSize = sizeof(scandir($path));

	while (($file = readdir($dir)) !== false){
		wFile(++$dirCount / $dirSize);	// phpReturn refresh
		if (!in_array($file, $ignore)){
			if (is_dir("$path/$file"))	$files[] = "f:" . utf8_encode($file);
			else						$files[] = utf8_encode($file) . " (" . formatSize("$path/$file") . ")";
		}
	}
	return $files;
	closedir($dir);
}
echo "dir" . json_encode(getDirectory($path));

function formatSize($x){
	$precision	= 2;
	$size		= @filesize($x);	// @ in front of filesize supress errors
	if ($size && $size > 0){
		$base		= log($size, 1024);	// era 1011.93
		$suffixes	= array(' B', ' kB', ' MB', ' GB', ' TB');
		return round(pow(1024, $base - floor($base)), $precision) . $suffixes[floor($base)];
	} else return "--";
}





/* rotina #3c */
/*function getDirectory($path, $modo){
	$files = array();
	$ignore = array( 'cgi-bin', '.', '..' );
	$dir = @opendir($path);
	if ($dir == ""){
		echo "* diretório inexistente *";
		exit;
	}
	if ($modo == "opendir"){
		echo $dir;	
		exit;
	}
	while (($file = readdir($dir)) !== false){
		if (!in_array($file, $ignore)){
			if (is_dir("$path/$file")){
				$files[] = $aux = "f:" . utf8_encode($file);
			}else{
				$files[] = $aux = utf8_encode($file);
			}
			if ($modo == "readdir"){
				echo $aux;	
				exit;
			}	
		}
	}
	if ($modo == "readdir"){
		echo "enddir";	
		closedir($dir);
		exit;
	}
}
echo "dir" . json_encode(getDirectory($path, $mode))*/



/* rotina #4 */
/*function getDirectory($path, $clrBuf){
	$files = array();
//	$saida = '';
//	$item1 = false;
	$ignore = array( 'cgi-bin', '.', '..' );
	$dir = @opendir($path);	
	while(false !== ($file = readdir($dir))){
		if(!in_array($file, $ignore)){
			if(is_dir("$path/$file")){
				$files[$file] = getDirectory("$path/$file", false);
			
			//	echo $file;
			//	getDirectory("$path/$file", false);
			
			//	if($item1) $saida .= ',';
			//	$saida .= '"'.$file.'":['.getDirectory("$path/$file", false).']';
			//	$item1 = true;
			}else{
				$files[] = $file;
			
			//	echo $file;
			
			//	if($item1) $saida .= ',';
			//	$saida .= '"'.$file.'"';
			//	$item1 = true;
			}
		}
	}
//	$saida .= '}';
	return $files;
//	return $saida;
	closedir($dir);
}

function leia(){
	$file = '../buffer/dir.txt';
	$fh = fopen($file, 'r') or die("can't open file");
	if($fh){
		$tamanho = filesize($file);
		if($tamanho < 4096) $bloco = $tamanho;
		else $bloco = 4096;
		while($tamanho>$bloco){
			echo fread($fh, $bloco);
			$tamanho = $tamanho - $bloco;
		}
		echo fread($fh, $tamanho);
	}
	fclose($fh);
}

function grave($out){
	$arquivo = "../buffer/dir.txt";
	$fh = fopen($arquivo, 'w') or die("can't open file");
	fwrite($fh, $out);
	fclose($fh);
}

//leia(grave('{'.getDirectory($path, true).'}'));
leia(grave(json_encode(getDirectory($path, true))));*/

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