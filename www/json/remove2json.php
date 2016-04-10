<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="delete from favourites where user_id=".$_POST['userid']." and restaurant_id=".$_POST['restaurant_id'];
$result=mysql_query($sql) or die(mysql_error());
print $result;
?>


