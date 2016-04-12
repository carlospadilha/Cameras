<?php
$request = "";
$url = $_GET['url'];
$url = str_replace('ziZ', '&', $url);
$url = str_replace('zuZ', '?', $url);
$url = str_replace('zuZ', '?', $url);

//$url = $_POST['url'];
//$url = "http://admin:solrac@192.168.1.36/snapshot?strm=0";
//$url = "http://admin:admin@192.168.1.37/access.xml?user=admin&usr=admin&password=admin&pwd=admin";
//$url = "http://admin:admin@192.168.1.35/videostream.cgi";

//$timeOut=intval('500');
//set_time_limit(0);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
//curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($curl, CURLOPT_HEADER, 0);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_BINARYTRANSFER, true);

//curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 0); 
//curl_setopt($curl, CURLOPT_TIMEOUT_MS, 500);

//curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY | CURLAUTH_ANYSAFE );
//curl_setopt($curl, CURLOPT_USERPWD, 'admin:admin');

if($request){
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $request);
}

//curl_setopt($curl, CURLOPT_BUFFERSIZE, 128); // more progress info
//curl_setopt($curl, CURLOPT_NOPROGRESS, false);
//curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, function( $curl, $DownloadSize, $Downloaded, $UploadSize, $Uploaded ){
//    return ($Downloaded > (100 * 1024)) ? 1 : 0;	// 1 breaks the connection
//});

$data = curl_exec($curl);	// execute the curl command
if($data === false) $data = curl_error($curl); //	$data = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);	// close the connection

//header('Content-type: image/jpeg');
echo $data;



/*$handler = file_get_contents($url);
echo $handler;*/
?>