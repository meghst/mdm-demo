<?
	$filenames =array();
	foreach(glob('./domain/*.json') as $filename){
     array_push($filenames,$filename);
 	}	
 	echo json_encode($filenames);

?>