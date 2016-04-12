<?php
/*echo $_SERVER['REMOTE_ADDR'];*/


/*  if (!empty($_SERVER['HTTP_CLIENT_IP']))
  //check ip from share internet
  {
    $ip=$_SERVER['HTTP_CLIENT_IP'];
  }
  elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
  //to check ip is pass from proxy
  {
    $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
  }
  else
  {
    $ip=$_SERVER['REMOTE_ADDR'];
  }
  echo $ip;*/
  
  
  
 $ipaddress = '';
 if (getenv('HTTP_CLIENT_IP'))
	 $ipaddress = getenv('HTTP_CLIENT_IP');
 else if(getenv('HTTP_X_FORWARDED_FOR'))
	 $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
 else if(getenv('HTTP_X_FORWARDED'))
	 $ipaddress = getenv('HTTP_X_FORWARDED');
 else if(getenv('HTTP_FORWARDED_FOR'))
	 $ipaddress = getenv('HTTP_FORWARDED_FOR');
 else if(getenv('HTTP_FORWARDED'))
	$ipaddress = getenv('HTTP_FORWARDED');
 else if(getenv('REMOTE_ADDR'))
	 $ipaddress = getenv('REMOTE_ADDR');
 else
	 $ipaddress = 'UNKNOWN';
 echo $ipaddress; 
 
 
/*foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
	if (array_key_exists($key, $_SERVER) === true){
		foreach (explode(',', $_SERVER[$key]) as $ip){
			$ip = trim($ip); // just to be safe

			if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
				echo $ip;
			}
		}
	}
}*/

?>