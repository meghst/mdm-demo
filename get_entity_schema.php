<?

extract($_GET);

	switch ($entityType) {
		case 'location':
			echo file_get_contents("domain/location.json");
			break;
		case 'location-type':
			echo file_get_contents("domain/location-type.json");
			break;
		default:
			echo "Entity not found";
			break;
	}

?>