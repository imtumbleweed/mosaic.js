// ASCII codes
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_W = 87;
var KEY_S = 83;
var KEY_A = 65;
var KEY_D = 68;

var DIR_E = 1;
var DIR_NE = 2;
var DIR_N = 4;
var DIR_NW = 8;
var DIR_W = 16;
var DIR_SW = 32;
var DIR_S = 64;
var DIR_SE = 128;

var isShift = false; // var key = [false, false, false, false];
var isCtrl = false;
window.key = null;
window.onscreen_kb = null;	// onscreen keyboard

var Keyboard = function() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
};

var OnscreenKeyboard = function() { // Assumes key1.png, key2.png, key3.png and key4.png are loaded
	console.log("OnscreenKeyboard Constructor();");

	this.x = 0;
	this.y = 150;
	this.text = '';
	
	this.row1_digits = ["1","2","3","4","5","6","7","8","9","0"];	// Digits
	this.row2_keys = ["Q","W","E","R","T","Y","U","I","O","P"];		// Q-P
	this.row3_keys = ["A","S","D","F","G","H","J","K","L"];			// A-L
	this.row4_keys = ["Z","X","C","V","B","N","M"];					// Z-M
	
	// states
	this.row1_digits_s = [0,0,0,0,0,0,0,0,0,0];		// Digits
	this.row2_keys_s = [0,0,0,0,0,0,0,0,0,0];		// Q-P
	this.row3_keys_s = [0,0,0,0,0,0,0,0,0];			// A-L
	this.row4_keys_s = [0,0,0,0,0,0,0];				// Z-M
	
	// fade fx
	this.row1_digits_f = [0,0,0,0,0,0,0,0,0,0];		// Digits
	this.row2_keys_f = [0,0,0,0,0,0,0,0,0,0];		// Q-P
	this.row3_keys_f = [0,0,0,0,0,0,0,0,0];			// A-L
	this.row4_keys_f = [0,0,0,0,0,0,0];				// Z-M
	
	this.draw = function(  ) {
	
		this.x = mobileWidth / 2 - 330 / 2;
		this.y = mobileHeight - 250;
	
//		if (window.key1==undefined||key2==undefined||key3==undefined||key4==undefined)
//			return;

		// row 1 highlighters
		for (var i = 0; i < this.row1_digits.length; i++) {
			if (this.row1_digits_s[i] == 1) {
				if (this.row1_digits_f[i] <= 0.5) this.row1_digits_f[i] += 0.04; else this.row1_digits_s[i] = 0;
			} else if (this.row1_digits_f[i] > 0) this.row1_digits_f[i] -= 0.04;
		}

		// row 2 highlighters
		for (var i = 0; i < this.row2_keys.length; i++) {
			if (this.row2_keys_s[i] == 1) {
				if (this.row2_keys_f[i] <= 0.5) this.row2_keys_f[i] += 0.04; else this.row2_keys_s[i] = 0;
			} else if (this.row2_keys_f[i] > 0) this.row2_keys_f[i] -= 0.04;
		}

		// row 3 highlighters
		for (var i = 0; i < this.row3_keys.length; i++) {
			if (this.row3_keys_s[i] == 1) {
				if (this.row3_keys_f[i] <= 0.5) this.row3_keys_f[i] += 0.04; else this.row3_keys_s[i] = 0;
			} else if (this.row3_keys_f[i] > 0) this.row3_keys_f[i] -= 0.04;
		}
		
		// row 4 highlighters
		for (var i = 0; i < this.row4_keys.length; i++) {
			if (this.row4_keys_s[i] == 1) {
				if (this.row4_keys_f[i] <= 0.5) this.row4_keys_f[i] += 0.04; else this.row4_keys_s[i] = 0;
			} else if (this.row4_keys_f[i] > 0) this.row4_keys_f[i] -= 0.04;
		}


		for (var i = 0; i < this.row1_digits.length; i++)
		{
			gfx.globalAlpha = 0.5 + this.row1_digits_f[i];
			key1.draw(this.x + i * 32, this.y);
			gfx.font = "16px Arial";
			gfx.fillStyle = "white";
		    gfx.fillText(this.row1_digits[i], this.x + (i * 32) + 11, this.y + 25);
			if (Press.ed && key1.pressed()) {
				this.row1_digits_s[i] = 1;
				console.log(this.row1_digits[i] + " is pressed!");
				this.text += this.row1_digits[i];
				Sound.play(16);
			}
		}
		for (var i = 0; i < this.row2_keys.length; i++)
		{
			gfx.globalAlpha = 0.5 + this.row2_keys_f[i];
			key1.draw(this.x + i * 32, this.y + 40);
			gfx.font = "16px Arial";
			gfx.fillStyle = "white";
			var adj_x = 0;
			if (i>=5 && i<=6) adj_x = 1;
			if (i==7) adj_x = 4;
			if (i==2) adj_x = 1;
		    gfx.fillText(this.row2_keys[i], this.x + (i * 32) + 9 + adj_x, this.y + 40 + 25);
			if (Press.ed && key1.pressed()) {
				this.row2_keys_s[i] = 1;
				console.log(this.row2_keys[i] + " is pressed!");
				this.text += this.row2_keys[i];
				Sound.play(16);
			}
		}
		for (var i = 0; i < this.row3_keys.length; i++)
		{
			gfx.globalAlpha = 0.5 + this.row3_keys_f[i];
			key1.draw(this.x + i * 32 + 16, this.y + 80);
//			key1.draw(this.x + i * 32, this.y);
		//	gfx.globalAlpha = 0.5;
			gfx.font = "16px Arial";
			gfx.fillStyle = "white";
			var adj_x = 0;
			if (i==5 || i==7) adj_x = -1;
			if (i==4) adj_x = -2;
		    gfx.fillText(this.row3_keys[i], this.x + (i * 32) + 27 + adj_x, this.y + 80 + 25);
			if (Press.ed && key1.pressed()) {
				this.row3_keys_s[i] = 1;
				console.log(this.row3_keys[i] + " is pressed!");
				this.text += this.row3_keys[i];
				Sound.play(16);
			}
		}
		//gfx.globalAlpha = 1;
		for (var i = 0; i < this.row4_keys.length; i++)
		{
			gfx.globalAlpha = 0.5 + this.row4_keys_f[i];
			key1.draw(this.x + i * 32 + 44, this.y + 120);
			gfx.font = "16px Arial";
			gfx.fillStyle = "white";
			var adj_x = 0;
			if (i==6) adj_x = -2;
		    gfx.fillText(this.row4_keys[i], this.x + (i * 32) + 44 + 10 + adj_x, this.y + 120 + 25);
			if (Press.ed && key1.pressed()) {
				this.row4_keys_s[i] = 1;
				console.log(this.row4_keys[i] + " is pressed!");
				this.text += this.row4_keys[i];
				Sound.play(16);
			}
		}
		
	    gfx.globalAlpha = 1;
				
		key2.draw(this.x, this.y + 120); 					// Shift
		if (Press.ed && key2.pressed()) {
			console.log("Shift pressed!");
		}
		
		key2.draw(this.x + 274, this.y + 120); 	// Backspace
		backspace.draw(this.x + 274 + 8, this.y + 120 + 8);
		if (Press.ed && key2.pressed()) {
			console.log("Backspace pressed!");
			if (this.text.length > 0)
			{
				this.text = this.text.slice(0, -1);
				Sound.play(16);
			}
		}
		
		key2.draw(this.x, this.y + 160); 					// ABC
		key2.draw(this.x + 44, this.y + 160); 				// World (?)
		key3.draw(this.x + 86, this.y + 160); 				// Space

		key4.draw(this.x + 244, this.y + 160); 	// Enter
		gfx.font = "16px Arial";
		gfx.fillStyle = "white";
	    gfx.fillText("Okay", this.x + 266, this.y + 185);
		if (Press.ed && key4.pressed()) {
			console.log("Okay pressed!");
			Sound.play(16);
			return true;
		}		
		
	};
	
}

function InitializeKeyboard()
{
    window.key = new Keyboard();

    $(document).keydown(function(e) {

		if (e.keyCode == 16) isShift = true;
		if (e.keyCode == 17) isCtrl = true;
        if (e.keyCode == KEY_LEFT) { key.left = true; }
        if (e.keyCode == KEY_RIGHT) { key.right = true; }
        if (e.keyCode == KEY_UP) { key.up = true; }
        if (e.keyCode == KEY_DOWN) { key.down = true; }
        if (e.keyCode == KEY_W) { key.w = true; }
        if (e.keyCode == KEY_S) { key.s = true; }
        if (e.keyCode == KEY_A) { key.a = true; }
        if (e.keyCode == KEY_D) { key.d = true; }
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 16) isShift = false;
		if (e.keyCode == 17) isCtrl = false;
        if (e.keyCode == KEY_LEFT) { key.left = false; }
        if (e.keyCode == KEY_RIGHT) { key.right = false; }
        if (e.keyCode == KEY_UP) { key.up = false; }
        if (e.keyCode == KEY_DOWN) { key.down = false; }
        if (e.keyCode == KEY_W) { key.w = false; }
        if (e.keyCode == KEY_S) { key.s = false; }
        if (e.keyCode == KEY_A) { key.a = false; }
        if (e.keyCode == KEY_D) { key.d = false; }
    });
}

function InitializeOnscreenKeyboard() {
	window.onscreen_kb = new OnscreenKeyboard();
}
