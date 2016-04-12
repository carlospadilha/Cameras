<?php
$request = $_POST['postData'];
$url = $_POST['url'];

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => 'Content-Type: application/json',
        'method'  => 'POST',
        'content' => $request,
    ),
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo $result;
?>