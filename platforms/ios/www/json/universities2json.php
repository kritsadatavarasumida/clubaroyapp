<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
if ($_POST['qtype'] != '' || $_POST['qtype'] != null ) {
	if ($_POST['qtype'] == 'q') {
		$sql='select * from universities';
		if ($_POST['id'] != "" || $_POST['id'] != null) {
			$sql .= ' and id='.$_POST['id'];
		} else {
			$sql .=' order by id ASC';
		}
	} else if ($_POST['qtype'] == 'c') {
		$sql = 'select count(*) res_num from restaurants where university_id='.$_POST['cat'];
	} else {
		$sql='select * from restaurants r left join (restaurant_categories rc, (select id, name_th rname_th from restaurant_types) rt) on (rt.id=r.type_id and rc.id=r.category_id) left join (select distinct * from galleries group by restaurant_id) g on g.restaurant_id=r.id left join (select * from average_prices) ap on ap.value=r.average_price where r.university_id ='.$_POST['cat'].' order by r.id ASC';
	} 
} else {
		$sql='select * from restaurants r left join (restaurant_categories rc, (select id, name_th rname_th from restaurant_types) rt) on (rt.id=r.type_id and rc.id=r.category_id) left join (select distinct * from galleries group by restaurant_id) g on g.restaurant_id=r.id left join (select * from average_prices) ap on ap.value=r.average_price where r.university_id ='.$_POST['cat'].' order by r.id ASC';

}
$result=mysql_query($sql) or die(mysql_error());
$num=mysql_affected_rows();
$objJSON=new mysql2json();
print(trim($objJSON->getJSON($result,$num)));
?>


