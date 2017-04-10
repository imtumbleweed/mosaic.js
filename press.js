var PressedControls = function()
{
	this.x = -10000;
	this.y = -10000;
	this.ed = false;
	var that = this;
	this.capture = function(mouse, touch) {
		if (window.clicked) { that.x = mouse.x; that.y = mouse.y; that.ed = true; return; }
		if (window.touched) { that.x = touch.x; that.y = touch.y; that.ed = true; }
	}
}

var Press = new PressedControls();