<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
if ($_POST['id'] != "") {
$sql="select * from recipes r left join (select id as uid,facebook_id,username,firstname,avatar from users) u on u.uid = r.user_id where r.id ='".$_POST['id']."' order by r.created desc";
} else if ($_POST['uid'] != "") {
	$sql="select * from recipes r left join (select id as uid,facebook_id,username,firstname,avatar from users) u on u.uid = r.user_id where r.user_id ='".$_POST['uid']."' order by r.created desc";
} else {
$sql="select * from recipes r left join (select id uid,facebook_id,username,firstname,avatar from users) u on u.uid = r.user_id order by r.created desc";
}
$result=mysql_query($sql) or die(mysql_error());
$num=mysql_affected_rows();
$objJSON=new mysql2json();
print(trim($objJSON->getJSON($result,$num)));
?>


