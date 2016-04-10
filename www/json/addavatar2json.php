<?php 
include('connect.php');
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


$userid = $_POST['userid'];
$filename = $_POST['filename'];
//$title = $_POST['title'];
//$detail = $_POST['detail'];
$tempfile = "";
if ($_POST['filename']) {

$extension =  substr($filename,strpos($filename,".")+1);
$prefix = date("D M j G:i:s T Y");
$tempfile = md5($prefix);
$tempfile = $tempfile.generateRandomString();


$imgData = str_replace(' ','+',$_POST['imageData']);
$imgData =  substr($imgData,strpos($imgData,",")+1);
$imgData = base64_decode($imgData);
// Path where the image is going to be saved
$filePath = $_SERVER['DOCUMENT_ROOT']. '/home/uploads/users/usr-'.$tempfile.".".$extension;
// Write $imgData into the image file
$file = fopen($filePath, 'w');
fwrite($file, $imgData);
fclose($file);
$tempfile = "usr-".$tempfile.".".$extension;
}

$sql="update users set avatar='".$tempfile."' where id=".$userid;
$result=mysql_query($sql) or die(mysql_error());
echo $result;


?>