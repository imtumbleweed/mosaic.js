<?php
	include("../../Migration/Composition.php");
    include("../../plugins/list/track/Browser.php");
    include("../../plugins/list/track/get_browser.php");
    
    $b = get__browser($_SERVER['HTTP_USER_AGENT']);

	$db = new db();
	
	$IP = $_SERVER["REMOTE_ADDR"];
	$width = $_POST["width"];
	$height = $_POST["height"];
	
	if ($width=="") exit;
	if ($height=="") exit;
	
	if ($db->isReady())
	{
		$data = $db->get("aud_TigEngine", "*", "ip='" . $IP. "' AND width = '" . $width . "' AND height = '" . $height . "'", "", "1");

		if (empty($data)) {
			$db->insert("aud_TigEngine", array("date", "ip", "width", "height", "platform", "browser", "http_user_agent"),
			                             array(date("M D Y h:m:sa", time()), $IP, $width, $height, $b[0], $b[1], $_SERVER["HTTP_USER_AGENT"]));
		}
		else
		{
			//print "already included!";
		}
	}
	
?>