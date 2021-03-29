<?
//*******************************************
class WebSocketChatServer{

function WebSocketChatServer(){
$this->msgs=array();
$this->db=new db();
$this->db->host="127.0.0.1";
$this->db->name="chat";
$this->db->user="root";
$this->db->password="";
$this->db->connect();
$this->create_tables();
}

function init($address){
$this->address=$address;
$this->socket = stream_socket_server($this->address, $this->errno, $this->errstr);
echo "PHP Веб-сокет чат сервер $this->address<br>";
if (!$this->socket) {
    die("$this->errstr ($this->errno)\n");
}
}//func


function run(){
echo "Обработка сообщений запущена<br>";
$this->connects = array();
while (true) {
    //формируем массив прослушиваемых сокетов:
    $read = $this->connects;
    $read []= $this->socket;
    $write = $except = null;

    if (!stream_select($read, $write, $except, null)) {//ожидаем сокеты доступные для чтения (без таймаута)
        break;
    }

    if (in_array($this->socket, $read)) {//есть новое соединение
        //принимаем новое соединение и производим рукопожатие:
        if (($connect = stream_socket_accept($this->socket, -1)) && $info = $this->handshake($connect)) {
            $this->connects[] = $connect;//добавляем его в список необходимых для обработки
            $this->onOpen($connect, $info);//вызываем пользовательский сценарий
        }
        
        unset($read[ array_search($this->socket, $read) ]);
    }

    //print_r($read);
    //print_r($connects);

    foreach($read as $connect) {//обрабатываем все соединения
        $data = fread($connect, 100000);
        if ($data) {
            //echo $data."<br>";
           
   
        $this->onMessage($connect, $data);//вызываем пользовательский сценарий

    } else {
            fclose($connect);
            unset($this->connects[array_search($connect, $this->connects) ]);
            $this->onClose($connect);//вызываем пользовательский сценарий
    }//if

    }

    foreach($this->connects as $con) $this->broadcast($con);
    $this->msgs=array();
}

fclose($this->socket);
echo "Сервер выключен";
//*******************************************

}






//пользовательские сценарии:
function onOpen($connect, $info) {
echo "Отрыто соединение $connect<br>";
$command=array();
$command["command"]="connection_open";
$command["id"]=$connect."";
$json= json_encode((object) $command);
fwrite($connect, $this->encode($json));
}

function onClose($connect) {
echo "Соединение закрыто $connect<br>";
}

function onMessage($connect, $data){
$data=$this->decode($data);
$str=$data["payload"];
$str=preg_replace('/[\x00-\x1F\x7F]/u', '', $str);
$str=trim($str);
echo "$connect:>".$str."<br>";
$command=(array) json_decode($str);
if (count($command)>0) $this->commandHandler($connect, $command);
}//func


function broadcast($connect) {
if (count($this->msgs)>0){
foreach($this->msgs as $key=>$value)
if ($key<>$connect."") {
    echo $key." to ".$connect." = ".$value["command"]."<br>";
    unset($value["user_key"]);
    $value["source"]=$key;
    $value["distination"]=$connect."";
    $json= json_encode((object) $value);
    fwrite($connect, $this->encode($json));
}
}//if
}//func






function commandHandler($connect, $command){
//echo "command:><br>";
//print_r($command);echo "<br>";


//*****************************************************************
if ($command["command"]=="user_create"){
   echo "Создание пользователя<br>";
   $error="";

   if ($command["name"]=="") {if ($error<>"") $error.=", "; $error.="Не задано имя";}
   if ($command["email"]=="") {if ($error<>"") $error.=", ";$error.="Не задана почта";}
   if ($command["password"]=="") {if ($error<>"") $error.=", ";$error.="Не задан пароль";}

   if ($error==""){
   $record=$this->db->record_exist("users","email='".$command["email"]."'");
   if (count($record)>0) $error="Пользователь с такой почтой есть";
    }

    if ($error==""){
   $record=$this->db->record_exist("users","name='".$command["name"]."'");
   if (count($record)>0) $error="Пользователь с таким именем есть";
    }

    if ($error==""){

   $fld=array();
   $fld["name"]=$command["name"];
   $fld["email"]=$command["email"];
   $fld["password"]=$command["password"];
   $record=$this->db->record_create("users",$fld);
   if ($record["id"]>0){
   $command["status"]=1;
   $command["answer"]="Пользователь создан";
   $command["id"]=$record["id"];
   echo "Пользователь создан<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
   } else {$error="Ошибка БД!";}

    } 

    if ($error<>"") {
   $command["status"]=0;
   $command["answer"]=$error;
   echo "Ошибка создания пользователя! ".$error."<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    }
 
}

//*****************************************************************
if ($command["command"]=="user_login"){
   echo "Авторизация пользователя<br>";

    $error="";
   if ($command["email"]=="") {if ($error<>"") $error.=", "; $error.="Не задана почта";}
   if ($command["password"]=="") {if ($error<>"") $error.=", "; $error.="Не задан пароль";}

   if ($error==""){
   $record=$this->db->record_exist("users","email='".$command["email"]."' and password='".$command["password"]."'");
   if (count($record)>0) {
   $command["status"]=1;
   $command["answer"]="Пользователь авторизован";
   $command["id"]=$record[0]["id"];
   $command["name"]=$record[0]["name"];
   $command["user_key"]=uniqid();
   $fld=array();
   $fld["user_key"]=$command["user_key"];
   $this->db->record_update("users",$fld,"id='".$command["id"]."'");
   echo "Пользователь авторизован<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    } else {
        $error="Пользователь с такой комбинацией почты и пароля не найден";
    }

    }//if


    if ($error<>"") {
   $command["status"]=0;
   $command["answer"]=$error;
   echo "Ошибка авторизации пользователя! ".$error."<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    }


    
}
//*****************************************************************
if ($command["command"]=="user_exit"){
   echo "Пользователь вышел<br>";
   $command["answer"]="Список сформирован";
   $command["status"]=1;
   $fld=array();
   $fld["user_key"]="";
   $this->db->record_update("users",$fld,"user_key='".$command["user_key"]."'");
   echo "Пользователь вышел<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
}

//*****************************************************************
if ($command["command"]=="message_create"){
   echo "Создание сообщения<br>";
   
   $error="";
    if ($command["message"]=="") {if ($error<>"") $error.=", "; $error.="Пустое сообщение";}
    if ($command["user_key"]=="") {if ($error<>"") $error.=", "; $error.="Не задан ключ авторизации пользователя";}

   if ($error==""){
   $user=$this->db->record_exist("users","user_key='".$command["user_key"]."'");
   if (count($user)==0) $error="Сообщение не создано. Ключ авторизации уже не действителен.";
    }

    if ($error==""){

   $fld=array();
   $fld["message"]=$command["message"];
   $fld["user"]=$user[0]["id"];
   $fld["time"]=$command["time"];
   $record=$this->db->record_create("messages",$fld);
   if ($record["id"]>0){
   $command["status"]=1;
   $command["answer"]="Сообщение создано";
   $command["id"]=$record["id"];
   $command["user"]=$user[0]["id"];
   $command["name"]=$user[0]["name"];
   $command["email"]=$user[0]["email"];
   echo "Сообщение создано<br>";

   //Сообщение для отправки другим пользователям
   $this->msgs[$connect.""]=$command;


   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
   } else {$error="Ошибка БД!";}

    } 

    if ($error<>"") {
   $command["status"]=0;
   $command["answer"]=$error;
   echo "Ошибка создания сообщения! ".$error."<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    }

}

//*****************************************************************
if ($command["command"]=="message_edit"){
   echo "Редактирование сообщения<br>";

   $error="";

    if ($command["message"]=="") {if ($error<>"") $error.=", "; $error.="Пустое сообщение";}
    if ($command["user_key"]=="") {if ($error<>"") $error.=", "; $error.="Не задан ключ авторизации пользователя";}
    if ($command["id"]=="") {if ($error<>"") $error.=", "; $error.="Не указан ИД сообщения";}

   if ($error==""){
   $user=$this->db->record_exist("users","user_key='".$command["user_key"]."'");
   if (count($user)==0) $error="Сообщение не отредактировано. Ключ авторизации уже не действителен.";
   }

   if ($error==""){
   $message=$this->db->record_exist("messages","id='".$command["id"]."'");
   if (count($message)==0) $error="Сообщение не отредактировано. Такого сообщения нет";
   }

   if ($error==""){
   $message=$this->db->record_exist("messages","id='".$command["id"]."' and user='".$user[0]["id"]."'");
   if (count($message)==0) $error="Сообщение не отредактировано. Редактирование чужого сообщения.";
   }

   if ($error==""){
   $fld=array();
   $fld["message"]=$command["message"];
   $record=$this->db->record_update("messages",$fld,"id='".$command["id"]."' and user='".$user[0]["id"]."'");
   if ($record){
   $command["status"]=1;
     $command["user"]=$user[0]["id"];
   $command["name"]=$user[0]["name"];
   $command["email"]=$user[0]["email"];
   echo "Сообщение отредактировано<br>";


    //Сообщение для отправки другим пользователям
   $this->msgs[$connect.""]=$command;


   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
   } else {$error="Ошибка БД!";}
   } 

    if ($error<>"") {
   $command["status"]=0;
   $command["answer"]=$error;
   echo "Ошибка редактирования сообщения! ".$error."<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    }


}

//*****************************************************************
if ($command["command"]=="message_del"){
   echo "Удаление сообщения<br>";

      $error="";

    if ($command["user_key"]=="") {if ($error<>"") $error.=", "; $error.="Не задан ключ авторизации пользователя";}
    if ($command["id"]=="") {if ($error<>"") $error.=", "; $error.="Не указан ИД сообщения";}



   if ($error==""){
   $user=$this->db->record_exist("users","user_key='".$command["user_key"]."'");
   if (count($user)==0) $error="Сообщение не удалено. Пользователь не авторизован.";
   }

   if ($error==""){
   $message=$this->db->record_exist("messages","id='".$command["id"]."'");
   if (count($message)==0) $error="Сообщение не удалено. Такого сообщения нет";
   }

   if ($error==""){
   $message=$this->db->record_exist("messages","id='".$command["id"]."' and user='".$user[0]["id"]."'");
   if (count($message)==0) $error="Сообщение не удалено. Удаление чужого сообщения.";
   }

   if ($error==""){
   $record=$this->db->query("delete from messages where id='".$command["id"]."' and user='".$user[0]["id"]."'");
   if ($record){
   $command["status"]=1;
   $command["user"]=$user[0]["id"];
   $command["name"]=$user[0]["name"];
   $command["email"]=$user[0]["email"];
   echo "Сообщение удалено<br>";
   
   //Сообщение для отправки другим пользователям
   $this->msgs[$connect.""]=$command;

   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
   } else {$error="Ошибка БД!";}
   } 

    if ($error<>"") {
   $command["status"]=0;
   $command["answer"]=$error;
   echo "Ошибка удаления сообщения! ".$error."<br>";
   $json= json_encode((object) $command);
   fwrite($connect, $this->encode($json));
    }
    
     
}
//*****************************************************************
if ($command["command"]=="messages_read"){

//print_r($command);
if (!isset($command["start"])) $command["start"]=0;
if (!isset($command["end"])) $command["end"]=100;
echo "Чтение списка сообщений<br>";
$messages=$this->db->query("
select 
messages.id as id,
messages.message as message, 
messages.user as user,
messages.time as time,
users.name as name,   
users.email as email
from messages 
left join users on (messages.user=users.id)
order by time desc
limit ".$command["start"].",".$command["end"]);
$messages=$this->db->result_to_array($messages);
$command["messages"]=$messages;
$command["status"]=1;
$command["answer"]="Список прочитан";
$json= json_encode((object) $command);
fwrite($connect, $this->encode($json));
}
//*****************************************************************
}















//функции обслуживающие протокол веб-сокета
function handshake($connect) {
    $info = array();

    $line = fgets($connect);
    $header = explode(' ', $line);
    $info['method'] = $header[0];
    $info['uri'] = $header[1];

    //считываем заголовки из соединения
    while ($line = rtrim(fgets($connect))) {
        if (preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
            $info[$matches[1]] = $matches[2];
        } else {
            break;
        }
    }

    $address = explode(':', stream_socket_get_name($connect, true)); //получаем адрес клиента
    $info['ip'] = $address[0];
    $info['port'] = $address[1];

    if (empty($info['Sec-WebSocket-Key'])) {
        return false;
    }

    //отправляем заголовок согласно протоколу вебсокета
    $SecWebSocketAccept = base64_encode(pack('H*', sha1($info['Sec-WebSocket-Key'] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    $upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
        "Upgrade: websocket\r\n" .
        "Connection: Upgrade\r\n" .
        "Sec-WebSocket-Accept:$SecWebSocketAccept\r\n\r\n";
    fwrite($connect, $upgrade);

    return $info;
}

function encode($payload, $type = 'text', $masked = false)
{
    $frameHead = array();
    $payloadLength = strlen($payload);

    switch ($type) {
        case 'text':
            // first byte indicates FIN, Text-Frame (10000001):
            $frameHead[0] = 129;
            break;

        case 'close':
            // first byte indicates FIN, Close Frame(10001000):
            $frameHead[0] = 136;
            break;

        case 'ping':
            // first byte indicates FIN, Ping frame (10001001):
            $frameHead[0] = 137;
            break;

        case 'pong':
            // first byte indicates FIN, Pong frame (10001010):
            $frameHead[0] = 138;
            break;
    }

    // set mask and payload length (using 1, 3 or 9 bytes)
    if ($payloadLength > 65535) {
        $payloadLengthBin = str_split(sprintf('%064b', $payloadLength), 8);
        $frameHead[1] = ($masked === true) ? 255 : 127;
        for ($i = 0; $i < 8; $i++) {
            $frameHead[$i + 2] = bindec($payloadLengthBin[$i]);
        }
        // most significant bit MUST be 0
        if ($frameHead[2] > 127) {
            return array('type' => '', 'payload' => '', 'error' => 'frame too large (1004)');
        }
    } elseif ($payloadLength > 125) {
        $payloadLengthBin = str_split(sprintf('%016b', $payloadLength), 8);
        $frameHead[1] = ($masked === true) ? 254 : 126;
        $frameHead[2] = bindec($payloadLengthBin[0]);
        $frameHead[3] = bindec($payloadLengthBin[1]);
    } else {
        $frameHead[1] = ($masked === true) ? $payloadLength + 128 : $payloadLength;
    }

    // convert frame-head to string:
    foreach (array_keys($frameHead) as $i) {
        $frameHead[$i] = chr($frameHead[$i]);
    }
    if ($masked === true) {
        // generate a random mask:
        $mask = array();
        for ($i = 0; $i < 4; $i++) {
            $mask[$i] = chr(rand(0, 255));
        }

        $frameHead = array_merge($frameHead, $mask);
    }
    $frame = implode('', $frameHead);

    // append payload to frame:
    for ($i = 0; $i < $payloadLength; $i++) {
        $frame .= ($masked === true) ? $payload[$i] ^ $mask[$i % 4] : $payload[$i];
    }

    return $frame;
}

function decode($data)
{
    $unmaskedPayload = '';
    $decodedData = array();


    $firstByteBinary = sprintf('%08b', ord($data[0]));
    $secondByteBinary = sprintf('%08b', ord($data[1]));
    $opcode = bindec(substr($firstByteBinary, 4, 4));
    $isMasked = ($secondByteBinary[0] == '1') ? true : false;
    $payloadLength = ord($data[1]) & 127;

  
    if (!$isMasked) {
        return array('type' => '', 'payload' => '', 'error' => 'protocol error (1002)');
    }

    switch ($opcode) {
        // text frame:
        case 1:
            $decodedData['type'] = 'text';
            break;

        case 2:
            $decodedData['type'] = 'binary';
            break;

        // connection close frame:
        case 8:
            $decodedData['type'] = 'close';
            break;

        // ping frame:
        case 9:
            $decodedData['type'] = 'ping';
            break;

        // pong frame:
        case 10:
            $decodedData['type'] = 'pong';
            break;

        default:
            return array('type' => '', 'payload' => '', 'error' => 'unknown opcode (1003)');
    }

    if ($payloadLength === 126) {
        $mask = substr($data, 4, 4);
        $payloadOffset = 8;
        $dataLength = bindec(sprintf('%08b', ord($data[2])) . sprintf('%08b', ord($data[3]))) + $payloadOffset;
    } elseif ($payloadLength === 127) {
        $mask = substr($data, 10, 4);
        $payloadOffset = 14;
        $tmp = '';
        for ($i = 0; $i < 8; $i++) {
            $tmp .= sprintf('%08b', ord($data[$i + 2]));
        }
        $dataLength = bindec($tmp) + $payloadOffset;
        unset($tmp);
    } else {
        $mask = substr($data, 2, 4);
        $payloadOffset = 6;
        $dataLength = $payloadLength + $payloadOffset;
    }


    if (strlen($data) < $dataLength) {
        return false;
    }

    if ($isMasked) {
        for ($i = $payloadOffset; $i < $dataLength; $i++) {
            $j = $i - $payloadOffset;
            if (isset($data[$i])) {
                $unmaskedPayload .= $data[$i] ^ $mask[$j % 4];
            }
        }
        $decodedData['payload'] = $unmaskedPayload;
    } else {
        $payloadOffset = $payloadOffset - 4;
        $decodedData['payload'] = substr($data, $payloadOffset);
    }

    return $decodedData;
}

function create_tables(){
if (!isset($this->db->tables["messages"])){
  $this->db->query("CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `user` int(11) NOT NULL,
  `time` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8");
}

if (!isset($this->db->tables["users"])){
  $this->db->query("
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `extra` text NOT NULL,
  `user_key` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3");
}
}
}//class

?>