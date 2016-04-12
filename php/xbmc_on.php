<?php


//$output = shell_exec('C:\Program Files (x86)\XBMC\XBMC.exe');
//$output = shell_exec('sh /sdcard/htdocs/xbmc_on.sh');	// xbmc_on.sh foi copiado manualmente para /data/app/ (adb push .....)
$output = shell_exec('chmod +x /system/bin/xbmc_on.sh');
echo $output;
$output = shell_exec('ls -l /system/bin/xbmc_on.sh');
echo $output;
$output = shell_exec('sh ./system/bin/xbmc_on.sh');
echo $output;


//exec('sh /sdcard/htdocs/xbmc_on.sh', $output);
//exec('am start org.xbmc.xbmc/.Splash', $output);
//exec('source /sdcard/htdocs/xbmc_on.sh', $output);
//exec('/system/bin/chmod +x bash /system/bin/xbmc_on.sh', $output);
//echo $output;
$output = exec('chmod +x /system/bin/xbmc_on.sh');
echo $output;
$output = exec('ls -l /system/bin/xbmc_on.sh');
echo $output;
$output = exec('sh ./system/bin/xbmc_on.sh');
echo $output;


//system('am start org.xbmc.xbmc/.Splash', $output);
//$output2 = system('/sdcard/htdocs/xbmc_on.sh', $output);


//echo $output;
//echo $output2

//$output2 = system('/system/bin/chmod +x bash /system/bin/xbmc_on.sh', $output);
//echo $output;


?>