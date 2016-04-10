<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="select count(*) as total from users where email='".$_POST['email']."'";
$result=mysql_query($sql) or die(mysql_error());
$data=mysql_fetch_assoc($result);
if ($data['total'] == 0) {
	$sql="insert into users (id, firstname, lastname, email, gender, password) values ('','".$_POST['name']."','".$_POST['lastname']."','".$_POST['email']."','".$_POST['gender']."','".$_POST['userpassword']."')" ;
	$result=mysql_query($sql) or die(mysql_error());
	echo $result;
} else {
	echo 0;
}
?>


