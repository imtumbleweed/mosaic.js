var Circle = function(x, y, radius)
{
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = 'gray';
	this.RadiusLine = new Segment(this.x, this.y, this.radius, 0);
	this.status = false;
	this.alpha = 1.0;
	
	this.pointInside = function(px, py)
	{
		var seg = new Segment(this.x, this.y, px - this.x, py - this.y);
		
		if (seg.length() <= this.RadiusLine.length())
        		return true;
        	else
        		return false;
	}
	
	this.draw = function(color)
	{
		gfx.beginPath();
		gfx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
//		gfx.fillStyle = color;
//		gfx.fill();
		gfx.strokeStyle = color;
		gfx.stroke();		
		
		//this.RadiusLine.draw(2, "blue");
	}
}