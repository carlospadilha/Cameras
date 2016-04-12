<?php
$file = $_FILES['videofile'];
if($_FILES['videofile']){
	$my_file = $_FILES['videofile'];
	$my_blob = file_get_contents($my_file['tmp_name']);
	file_put_contents('cam.webm', $my_blob);
}
?>