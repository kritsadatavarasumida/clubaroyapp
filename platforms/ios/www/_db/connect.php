<?
// Database Engine
// for mysql

define(DBTYPE,"mysql");

function DBTableName($result) {
	return mysql_field_table($result,0);
}

function ErrMsg($sql,$errmsg) {
	echo $sql,"<br>",$errmsg;
}

function ConnectDB($host="localhost",$user="clubaroy",$password="JbUZYZVkqd",$dbname="clubaroydb")
{
     $link = mysql_Connect($host, $user, $password);
     $dbs = mysql_select_db($dbname,$link);
     return $dbs;
}

function DBexec($Dbs,$SQL)
{
  $result = mysql_query($SQL);
//  $result = mysql_query($SQL,$Dbs);
  if (!$result)
	ErrMsg($sql,mysql_error());
  return $result; 
}

function DBfetch_array($result,$row)
{
  mysql_data_seek($result,$row);
  $array = mysql_fetch_array($result);
  return $array;
}

function DBfetch_row($result,$row)
{
  mysql_data_seek($result,$row);
  $array = mysql_fetch_row($result);
  return $array;
}

function DBfieldname($result,$fldnum)
{
  $str = mysql_fieldname($result,$fldnum);
  return $str;
}

function DBfieldtype($result,$fldnum)
{
  $type = mysql_fieldtype($result,$fldnum);
  return $type;
}

function DBfetch_object($result,$row)
{
  mysql_data_seek($result,$row);
  $obj = mysql_fetch_object($result);
  return $obj;
}

function DBNumRows($result)
{
  $rows = mysql_numrows($result);
  return $rows; 
}

function DBNumFields($result)
{
  $fld = mysql_numfields($result);
  return $fld;
}

// mysql specific (like DBGetLastOid)
function DB_insert_id($result)
{
  //$lastid = mysql_insert_id($result);
  $lastid = mysql_insert_id();
  return $lastid;
}

// Log Function Here
function AddLog($Descrp,$threadno="",$emailid="NULL")
{
	global $username;
	$Dbs = connectDB();
	$sql = "insert into tbllog (username,descrp,threadno,emailid) ";
	$sql.= "values ('$username','$Descrp','$threadno','$emailid')";
	dbexec($Dbs,$sql);
}
function formatprice ($pricestring1,$pricestring2) {
$price = number_format($pricestring1);
if($pricestring2 == "THB"){
$currency = "B";
}else{
$currency = "US";
}
$newPrice = "$currency$price";
  return($newPrice);
}
function formatdatefull ($datestring) {
	$year  = substr($datestring, 0, 4);
  	$month = substr($datestring, 5, 2);
  	$day   = substr($datestring, 8, 2);

  	switch($month) {
     case "01":
              $newMonth = "January";
              break;
      case "02":
              $newMonth = "February";
              break;
      case "03":
              $newMonth = "March";
              break;
      case "04":
              $newMonth = "April";
              break;
      case "05":
              $newMonth = "May";
              break;
      case "06":
              $newMonth = "June";
              break;
      case "07":
              $newMonth = "July";
              break;
      case "08":
              $newMonth = "August";
              break;
      case "09":
              $newMonth = "September";
              break;
      case "10":
              $newMonth = "October";
              break;
      case "11":
              $newMonth = "November";
              break;
	case "12":
              $newMonth = "December";
              break;
      default:
              $newMonth = "-";
  }

  $newyear  = $year;
  $newDate = "$day  $newMonth $newyear";
  return($newDate);
}
function formatdateshow ($datestring1,$datestring2) {
	$datestart   = substr($datestring1, 8, 2);
	$year  = substr($datestring2, 0, 4);
  	$month = substr($datestring2, 5, 2);
  	$day   = substr($datestring2, 8, 2);

  	switch($month) {
      case "01":
              $newMonth = "January";
              break;
      case "02":
              $newMonth = "February";
              break;
      case "03":
              $newMonth = "March";
              break;
      case "04":
              $newMonth = "April";
              break;
      case "05":
              $newMonth = "May";
              break;
      case "06":
              $newMonth = "June";
              break;
      case "07":
              $newMonth = "July";
              break;
      case "08":
              $newMonth = "August";
              break;
      case "09":
              $newMonth = "September";
              break;
      case "10":
              $newMonth = "October";
              break;
      case "11":
              $newMonth = "November";
              break;
	case "12":
              $newMonth = "December";
              break;
      default:
              $newMonth = "ธ.ค.";
  }
  $year = $year+543;
  $newyear  = substr($year, 2, 2);
  $newDate = "$datestart - $day  $newMonth";
  return($newDate);
}
function formatdatemonth($datestring) {
  	switch($datestring) {
      case "01":
              $newMonth = "January";
              break;
      case "02":
              $newMonth = "February";
              break;
      case "03":
              $newMonth = "March";
              break;
      case "04":
              $newMonth = "April";
              break;
      case "05":
              $newMonth = "May";
              break;
      case "06":
              $newMonth = "June";
              break;
      case "07":
              $newMonth = "July";
              break;
      case "08":
              $newMonth = "August";
              break;
      case "09":
              $newMonth = "September";
              break;
      case "10":
              $newMonth = "October";
              break;
      case "11":
              $newMonth = "November";
              break;
	case "12":
              $newMonth = "December";
              break;
      default:
              $newMonth = "December";
  }
  $newDate = "$newMonth";
  return($newDate);
  }
  
  if($l=="th"){
  $thome="หน้าแรก";
  $tnews="ข่าวสารและกิจกรรม";
  $tser="สิ่งอำนวยความสะดวก";
  $tphoto="แกลลอรี่";
  $tabout="เกี่ยวกับเรา";
  $tcont="ติดต่อเรา";
  $tboard="เว็บบอร์ด";
  $tdetails="รายละเอียด";
  $tcon="มีต่อ";
  $ttype="ประเภทห้อง";
  $tprice="ราคา";
  $tcurrency="บาท / เดือน";
  $tsize="ขนาดห้อง";
  }else{
  $thome="Home";
  $tnews="News";
  $tser="Facilities";
  $tphoto="Photo Gallery";
  $tabout="About Us";
  $tcont="Contacts";
  $tboard="Webboard";
  $tdetails="More details";
  $tcon="More";
  $ttype="Room Type";
  $tcurrency="THB/mo";
  $tprice="Price";
  $tsize="Size";
  }
  function filter($data)
{
	global $config;
	$repchar = '*';
	
	for($i=0;$i<sizeof($config[badwords]);$i++)
	{
		$rep = '';
		$ltrs = strlen($config[badwords][$i])-1;
		for ($n=0;$n<$ltrs;$n++)
		{
			$rep .= $repchar;
		}
		$replacement = substr($config[badwords][$i],0,1).$rep;
		
		$data = eregi_replace($config[badwords][$i],$replacement,$data);
	
	}

	return $data;
}
function autolink($message)
{
    $text = " " . $message;
    $text = preg_replace("#([\n ])([a-z]+?)://([a-z0-9\-\.,\?!%\*_\#:;~\\&$@\/=\+]+)#i", "\\1<a class='LinklightPink' href=\"\\2://\\3\" target=\"_blank\">\\2://\\3</a>", $text);
    $text = preg_replace("#([\n ])www\.([a-z0-9\-]+)\.([a-z0-9\-.\~]+)((?:/[a-z0-9\-\.,\?!%\*_\#:;~\\&$@\/=\+]*)?)#i", "\\1<a class='LinklightPink' href=\"http://www.\\2.\\3\\4\" target=\"_blank\">www.\\2.\\3\\4</a>", $text);
    $text = preg_replace("#([\n ])([a-z0-9\-_.]+?)@([\w\-]+\.([\w\-\.]+\.)?[\w]+)#i", "\\1<a href=\"mailto:\\2@\\3\">\\2@\\3</a>", $text);
    $text = substr($text, 1);
    return($text);
}
  function process($data)
{
		$data = nl2br($data);
			$data = filter($data);
			$data = autolink($data);
		$data = str_replace("\n","",$data);
	 $data = str_replace("\r","",$data);
    $data = str_replace("[---]","&nbsp;&nbsp;",$data);
  $data = str_replace("[b]","<b>",$data);
 $data = str_replace("[/b]","</b>",$data);
 $data = str_replace("[i]","<i>",$data);
$data = str_replace("[/i]","</i>",$data);
 $data = str_replace("[u]","<u>",$data);
 $data = str_replace("[/u]","</u>",$data);
 $data = str_replace("[color=green]","<font color=green>",$data);
 $data = str_replace("[color=blue]","<font color=blue>",$data);
 $data = str_replace("[color=orange]","<font color=orange>",$data);
 $data = str_replace("[color=pink]","<font color=pink>",$data);
 $data = str_replace("[color=gray]","<font color=gray>",$data);
 $data = str_replace("[color=red]","<font color=red>",$data);
 $data = str_replace("[/color]","</font>",$data);
	 		$data = str_replace(":b1:","<IMG src=\"img_board/b1.gif\">",$data);
			$data = str_replace(":b2:","<IMG src=\"img_board/b2.gif\">",$data);
			$data = str_replace(":b3:","<IMG src=\"img_board/b3.gif\">",$data);
			$data = str_replace(":b4:","<IMG src=\"img_board/b4.gif\">",$data);
			$data = str_replace(":b5:","<IMG src=\"img_board/b5.gif\">",$data);
			$data = str_replace(":b6:","<IMG src=\"img_board/b6.gif\">",$data);
			$data = str_replace(":b7:","<IMG src=\"img_board/b7.gif\">",$data);
			$data = str_replace(":b8:","<IMG src=\"img_board/b8.gif\">",$data);
			$data = str_replace(":b9:","<IMG src=\"img_board/b9.gif\">",$data);
			$data = str_replace(":b10:","<IMG src=\"img_board/b10.gif\">",$data);
			$data = str_replace(":b11:","<IMG src=\"img_board/b11.gif\">",$data);
			return $data;
}
?>
