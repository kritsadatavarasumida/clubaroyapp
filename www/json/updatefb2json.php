<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="update users set firstname='".$_POST['name']."' where facebook_id='".$_POST[facebook_id]."'";
$result=mysql_query($sql) or die(mysql_error());
echo $result;

?>

