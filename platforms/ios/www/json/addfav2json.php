<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="insert into favourites value ('','".$_POST['userid']."','".$_POST['restaurant_id']."','0000-00-00 00:00:00')" ;
$result=mysql_query($sql) or die(mysql_error());
echo $result;
?>


