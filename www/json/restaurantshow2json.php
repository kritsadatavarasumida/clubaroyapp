<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
if ($_POST['rand'] != "" || $_POST['rand'] != null ) {
	if ($_POST['rand'] == 1) {
		$sql='select * from restaurants r left join (restaurant_categories rc, (select id, name_th rname_th from restaurant_types) rt) on (rt.id=r.type_id and rc.id=r.category_id) left join (select distinct * from galleries group by restaurant_id) g on g.restaurant_id=r.id order by RAND() limit 10 offset '.$_POST['offset'];	
	} else {
		$sql="select * from restaurants r left join (restaurant_categories rc, (select id, name_th rname_th from restaurant_types) rt) on (rt.id=r.type_id and rc.id=r.category_id) left join (select distinct * from galleries group by restaurant_id) g on g.restaurant_id=r.id where r.title_th like '%".$_POST["xstring"]."%' or rt.rname_th like '%".$_POST["xstring"]."%'";	
	}
} else {
$sql='select * from restaurants r left join (restaurant_categories rc, (select id, name_th rname_th from restaurant_types) rt) on (rt.id=r.type_id and rc.id=r.category_id) left join (select distinct * from galleries group by restaurant_id) g on g.restaurant_id=r.id order by r.id desc limit 10 offset '.$_POST['offset'];
}
$result=mysql_query($sql) or die(mysql_error());
$num=mysql_affected_rows();
$objJSON=new mysql2json();
print(trim($objJSON->getJSON($result,$num)));
?>


