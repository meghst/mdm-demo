<?
	if(isset($_GET))//get request: fetch All
	{
		echo file_get_contents("data/locations.json");
	}

?>