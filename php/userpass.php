<?php
$idx = $_POST["i"];
if ($idx == 1) echo "user=admin&pwd=admin";
if ($idx == 2) echo "user=admin&usr=admin&password=admin&pwd=admin";
if ($idx == 3) echo "user=admin&password=solrac";
//if ($idx == 4) echo "admin:123456";
if ($idx == 4) echo "loginuse=admin&loginpas=";
if ($idx == 5) echo "user=admin&pwd=";
?>