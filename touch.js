window.touched = false;
window.released = false;
var TouchControls = function()
{
	this.x = 0;
	this.y = 0;
	this.vecx = 0;
	this.vecy = 0;
	this.segment = new Segment(0,0,0,0);
	
	var that = this;
	
	this.Initialize = function(element) {
		var E = $(element)[0];
		E.addEventListener('touchstart', function(e) {
            if (!e) var e = event;
            e.preventDefault();
			that.x = e.touches[0].pageX - $(element).offset().left;
			that.y = e.touches[0].pageY - $(element).offset().top;
			window.touched = true;
		});
		E.addEventListener('touchmove', function(e) {
            if (!e) var e = event;
            e.preventDefault();
//			that.x = e.touches[0].pageX - $(element).offset().left;
//			that.y = e.touches[0].pageY - $(element).offset().top;
		});
		E.addEventListener('touchend', function(e) {
            if (!e) var e = event;
            e.preventDefault();
//			var newx = e.touches.pageX - $(element).offset().left;
//			var newy = e.touches.pageY - $(element).offset().top;
			var touchobj = e.changedTouches[0];
			that.vecx = touchobj.clientX - that.x;
			that.vecy = touchobj.clientY - that.y;
			that.segment = new Segment(that.x, that.y, touchobj.clientX-that.x, touchobj.clientY-that.y);
			that.segment.draw(2, "blue");
//			that.segment.x = that.x;
//			that.segment.y = that.y;
//			that.segment.vecx = that.vecx;
//			that.segment.vecy = that.vecy;
			window.released = true;
		});
	}
}

var Touch = new TouchControls();