<?php
$file = utf8_decode($_POST['file']);
$newContent = $_POST['newContent'];

$texto = readWrite($file, "", "r");
$texto = changePlotContent($texto, $newContent);
if ($newContent == $texto->textoPlot)
	echo "igual";								// conteúdo <plot> igual, não grave
else
	echo readWrite($file, $texto->texto, "w");	// conteúdo diferente, grave arquivo

function readWrite($file, $data, $type){
	if ($type=='w'){
		$fh = fopen($file, 'w') or die("can't open file");
		fwrite($fh, $data);
		return "true";
	}else{
		if(($fh = fopen($file, 'r')) !== false){
			$tamanho = filesize($file);
			if ($tamanho < 4096) $bloco = $tamanho;
			else $bloco = 4096;
			$buffer = "";
			while ($tamanho > $bloco) {
				$buffer = $buffer . fread($fh, $bloco);
				$tamanho = $tamanho - $bloco;
			}
			$buffer = $buffer . fread($fh, $tamanho);
			return $buffer;
		}else{
			die("Arquivo/diretório inexistente");
		}
	};
	fclose($fh);
}

function changePlotContent($texto, $newContent){
	$re = '/<plot/';
	if ($re.exec($texto)){
		$idxIni = strpos($texto, "<plot");
		$idxFin = strpos($texto, "</plot");
		$texIni = substr($texto, 0, $idxIni);
		$texMei = substr($texto, $idxIni + 6, $idxFin - $idxIni - 6);
		$texFin = substr($texto, $idxFin);
	//	return $texIni . "<plot>" . $newContent . $texFin;
		$textoNfo = $texIni . "<plot>" . $newContent . $texFin;
		return (object)array("texto" => $textoNfo, "textoPlot" => $texMei);
	}else
		return $texto;
}
?>