<?php
use Icewind\SMB\Server;

require('vendor/autoload.php');

$path = "\\\\192.168.1.102\\WD3\\Pub\MP3-All\\3T\\folder.jpg";
$url = "\\\\192.168.1.102\\WD3";
$server = new Server($url, 'test', 'test');
$shares = $server->listShares();

foreach ($shares as $share) {
    echo $share->getName() . "\n";
}
?>