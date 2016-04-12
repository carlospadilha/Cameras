<?php
$post = $_POST['postData'];
$url  = $_POST['url'];
//$timeOut=intval('500');

$curl = curl_init();
/*
$referers = array("google.com", "yahoo.com", "msn.com", "ask.com", "live.com");
$choice = array_rand($referers);
$referer = "http://" . $referers[$choice] . "";
curl_setopt($curl, CURLOPT_REFERER, $referer);
curl_setopt($curl, CURLOPT_AUTOREFERER, true);

$browsers = array("Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:10.0.2) Gecko/20100101 Ubuntu/8.04 (hardy) Firefox/3.0.3", "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1) Gecko/20060918 Firefox/2.0", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.3) Gecko/2008092417 Firefox/3.0.3", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)");
$choice2 = array_rand($browsers);
$browser = $browsers[$choice2];
curl_setopt($curl, CURLOPT_USERAGENT, $browser);
*/
curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:10.0.2) Gecko/20100101 Firefox/10.0.2');
 
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_TIMEOUT, $timeOut);
//curl_setopt($curl, CURLOPT_MAXREDIRS, 7);
//curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

if ($post){	// post mode
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
}
 
$data = curl_exec($curl);
if ($data === false) $data = curl_error($curl); //	$data = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);	// close the connection
 
echo $data;		// return $html

/*
ini_set('upload_max_filesize', '60M');     
ini_set('max_execution_time', '999');
ini_set('memory_limit', '128M');
ini_set('post_max_size', '60M');
*/
?>
