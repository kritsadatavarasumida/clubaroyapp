<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql='select * from contents where category_id = 7';
if ($_POST['id'] != "" || $_POST['id'] != null) {
	$sql .= ' and id='.$_POST['id'];
} else {
	$sql .=' order by id desc limit 10 offset '.$_POST['offset'];
}
$result=mysql_query($sql) or die(mysql_error());
$num=mysql_affected_rows();
$objJSON=new mysql2json();
print(trim($objJSON->getJSON($result,$num)));
?>


