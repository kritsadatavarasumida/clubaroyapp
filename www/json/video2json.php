<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql='select * from videos where active=1';
if ($_POST['video_type'] != "" || $_POST['video_type'] != null) {
	if ($_POST['video_type'] == 0) {
		$sql .= ' and dara=0';
	} else {
		$sql .= ' and dara=1';
	}
}
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


