<?php 
include('connect.php');
header('Access-Control-Allow-Origin: *');
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$comment = $_POST['comment'];
$userid = $_POST['userid'];
$rid = $_POST['rid'];
$filename = $_POST['filename'];
$rating = $_POST['rating'];
if ($_POST['filename'] != "") {
$extension =  substr($filename,strpos($filename,".")+1);
$prefix = date("D M j G:i:s T Y");
$tempfile = md5($prefix);
$tempfile = $tempfile.generateRandomString();


$imgData = str_replace(' ','+',$_POST['imageData']);
$imgData =  substr($imgData,strpos($imgData,",")+1);
$imgData = base64_decode($imgData);
// Path where the image is going to be saved
$filePath = $_SERVER['DOCUMENT_ROOT']. '/home/uploads/jbimages/'.$tempfile.".".$extension;
// Write $imgData into the image file
$file = fopen($filePath, 'w');
fwrite($file, $imgData);
fclose($file);
$html = "<img src=uploads/jbimages/".$tempfile.".".$extension.">";
$comment = $comment."<br>".$html;
}

$sql="insert into restaurant_comments value ('','".$_POST['userid']."','".$_POST['rid']."','".$comment."','".$rating."','".date("Y-m-d H:i:s")."','open','0')";
$result=mysql_query($sql) or die(mysql_error());
echo $result;


?>