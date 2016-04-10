<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="update recipes set counter = counter + 1 where id='".$_POST['id']."'" ;
$result=mysql_query($sql) or die(mysql_error());
echo $result;
?>


