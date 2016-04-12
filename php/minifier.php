<?php
	// setup the URL, the JS and the form data
	$url = 'http://javascript-minifier.com/raw';
	$file = utf8_decode($_POST['file']);
	$js = file_get_contents($file);
//	$js = file_get_contents('./public/ready.js');
	$data = array(
		'input' => $js
	);
    
	// init the request, set some info, send it and finally close it
	$ch = curl_init($url);

	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$minified = curl_exec($ch);

	curl_close($ch);

    // output the $minified
    echo $minified;
?>