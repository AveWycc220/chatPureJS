<html>
<head>
    <meta charset="utf-8" />
</head>
<body>
<?php
include_once "websocketchatserver.php";
include_once "db.php";

error_reporting(E_ALL);
set_time_limit(0);
ob_implicit_flush();

$server=new WebSocketChatServer();
$server->init("tcp://127.0.0.1:5025");
$server->run();
?>
</body>
</html>