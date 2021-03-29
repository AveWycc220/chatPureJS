<?
class db{ // Обьект база данных



function db_class($name="db"){
$this->name=$name;
$this->host="";
$this->name="";
$this->name_type=0; //0 - mysql, 1 - postgres, 2 - oracle
$this->name_types[0]["name"]="MYSQL";
$this->name_types[1]["name"]="Postgres";
$this->name_types[2]["name"]="Oracle";
$this->sql="";//Последняя выполненная команда
$this->res="";//Результат выполнения команды
$this->user="";
$this->password="";
$this->type="db";
$this->connect=0; // 0 - нет соединения 1 - есть соединение
$this->tables=array();//таблицы базы данных
}


function connect(){
if (@mysql_pconnect($this->host, $this->user, $this->password)){
echo "Соединение с СУБД  установленно<br>";
if (@mysql_select_db($this->name)){
echo "Выбор базы данных <b>".$this->name." </b> произведен успешно<br>"; $this->connect=1;
mysql_query("SET NAMES utf8");
$tab=mysql_query("show tables");
for ($i=0;$i<mysql_num_rows($tab);$i++) $this->tables[mysql_result($tab,$i,0)]="1";
} else {echo "<font class='db_list_red'>Выбор базы данных <b>".$this->name."</b> произведен c ошибкой. Возможно нет БД</font><br>";}
} else {echo "<font class='db_list_red'>Ошибка установления соединения</font><br>";}
}





//Выполнение команды SQL
function query(){
if (func_num_args()>0) {$this->sql=func_get_arg(0);}
if (func_num_args()>1) {$this->descript=func_get_arg(1);}
if (func_num_args()>2) {$mode=func_get_arg(2);}
$this->res=@mysql_query($this->sql);
if (@$this->res){
	echo "Команда - <b>".$this->sql."</b> - выполненна<br>";
} else { 
	echo "<font class='db_list_red'>Ошибка выполнения <b>$this->sql</b></font><br>";
}
return $this->res;
}


//возвращает количество записей в результате
function num_rows($res){
$out=@mysql_num_rows($res);
echo "Количество записей в результате [ $res ] - ".$out."<br>";
return $out;
}


function result_to_array($res,$mode=1){//mode = 1 - удалять цифровые индексы, 0 - не удалять
$out=array(); 
for ($i=0;$i<@mysql_num_rows($res);$i++){
$out[$i]=@mysql_fetch_array($res,$mode);
}
echo "Преобразование в массив <i>[result_to_array($res)]</i><br>";
return $out;
}

//возвращает последний добавленный элемент
function insert_id(){
$out=@mysql_insert_id();
echo "Последняя запись  - ".$out."<br>";
return $out;
}

//Функция создания записи в таблице
function record_create($table,$fld){
if ($fld===null) $fld=array();
$fields=array();
$n=0;
for (reset($fld); list($k,$v)=each($fld);){
$fields[$n]["name"]=$k;
$fields[$n]["value"]=$v;
$n++;
}
$sql_fields="";
$sql_values="";
$i_count=count($fields);
for ($i=0;$i<$i_count;$i++){
$sql_fields=$sql_fields.$fields[$i]["name"]; 	
$sql_values=$sql_values."'".$fields[$i]["value"]."'";
if ($i<(count($fields)-1)) {$sql_fields=$sql_fields.", "; $sql_values=$sql_values.", ";}	
}
$sql="insert into ".$table." (".$sql_fields.") values (".$sql_values.")";
$this->query($sql,"db_class() create_record(Добавление записи)");
//echo $sql."<br>";
$cnt=(count($fields));
$fields[$cnt]["name"]="id";
$fields[$cnt]["value"]=$this->insert_id();
$out=array();
$i_count=count($fields);
for ($i=0;$i<$i_count;$i++){$out[$fields[$i]["name"]]=$fields[$i]["value"];}
return $out;
}


//функция возвращает пустой массив в случае отсутствия записи и массив данныз в случае найденной записи
function record_exist($table,$where){
$buf=array();
$sql="select * from ".$table." where ".$where;
$res=$this->query($sql,"db_class() create_record(Проверка на наличие записи)");
if ($this->num_rows($res)>0){
$buf=$this->result_to_array($res);
}
return $buf;
}

//обновление 
function record_update($table,$fld,$where){
$fields=array();
$n=0;
for (reset($fld); list($k,$v)=each($fld);){
$fields[$n]["name"]=$k;
$fields[$n]["value"]=$v;
$n++;
}

$set="";
$i_count=count($fields);
for ($i=0;$i<$i_count;$i++){
$set=$set.$fields[$i]["name"]."='".$fields[$i]["value"]."'"; 	
if ($i<($i_count-1)) {$set=$set.", ";}	
}

$sql="update ".$table." set ".$set." where ".$where;
//writeln($sql);
$res=$this->query($sql,"db_class() create_update(Обновление записи)");
return $res;
}


} //Конец описания БД
?>
