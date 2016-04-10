<?php
include('mysql2json.class.php');
include('connect.php');
?>

<?php
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$num=0;
$sql="select * from favourites f left join restaurants r on f.restaurant_id = r.id left join (select  id,image,user_id as uid,restaurant_id from galleries group by restaurant_id) g on g.restaurant_id = r.id left join (select id, name_th rc_name_th from restaurant_types) rc on rc.id = r.type_id where f.user_id='".$_POST['id']."'";
$result=mysql_query($sql) or die(mysql_error());
$num=mysql_affected_rows();
$objJSON=new mysql2json();
print(trim($objJSON->getJSON($result,$num)));
?>


