function proceed_toAccountForm() {
	$("#registration").hide();
	$("#enter_code").hide();
	$("#code_success").hide();
	$("#player_details").show(); // <----------
	$("#registration").hide();
}

function go_back_to_PlayerList() {
	$("#enter_code").hide();
	$("#code_success").hide();
	$("#player_details").hide();
	$("#play_as").show(); // <----------
	$("#registration").hide();
}

function go_to_RegisterNewAccount() {
	$("#enter_code").hide();
	$("#code_success").hide();
	$("#player_details").hide();
	$("#play_as").hide();
	$("#registration").show(); // <----------
}

function registerPlayer(emailaddress, outputDivID) { /* register account */

	console.log("registerPlayer("+emailaddress+","+outputDivID+")");

	if (/\S+@\S+\.\S+/.test(emailaddress)) {
		$.ajax( {
			  "url" : "http://www.tigrisgames.com/player/REGISTER_account.php",
	    	 "type" : "POST",
			 "data" : { "email" : emailaddress },
			success : function(msg) {
			
				$(outputDivID).text(msg);
				
				if (msg == "+") { // Email was sent
					
					$("#registration").hide();
					$("#enter_code").show();
					
					$(outputDivID).text("Activation code was emailed.");
					
				}
				
			}});
	} else {
		$(outputDivID).text("Please enter correct email address.");
	}
}

function confirmPlayer(emailaddress, code, outputDivID) { /* activate account */

	console.log("confirmPlayer("+emailaddress+","+code+")");

	if (/\S+@\S+\.\S+/.test(emailaddress)) {
		$.ajax( {
		  "url" : "http://www.tigrisgames.com/player/ACTIVATE_account.php",
    	 "type" : "POST",
		 "data" : { "email" : emailaddress,
		 			"conf_Code" : code },
		success : function(msg) {
		
			if (msg == "+") { // Email was sent
				$("#registration").hide();
				$("#enter_code").hide();
				$("#code_success").show();
				$(outputDivID).text("Your account has been verified.");
				$("#player_emailAddress").val( emailaddress );
			} else {
				$(outputDivID).text(msg);//"Incorrect code. Try again.");
			}
		}});
	} else {
		$(outputDivID).text("Invalid email address.");
	}
}