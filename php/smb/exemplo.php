<?php
require_once ('smbclient.php');
 
$smbc = new smbclient ('//192.168.1.102/WD3', 'admin', 'solrac');

if (!$smbc->get ('Pub/MP3-All/3T/folder.jpg', '/txt/localfile.jpg'))
{
	print "Failed to retrieve file:\n";
	print join ("\n", $smbc->get_last_cmd_stdout());
}
else
{
	print "Transferred file successfully.";
}
?>