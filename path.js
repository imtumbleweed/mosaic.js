var PATH_MAX_LENGTH = 5000;

var Path = function() {

	this.x = 0;
	this.y = 0;
	this.point = new Array(PATH_MAX_LENGTH);
	for (var i = 0; i < PATH_MAX_LENGTH; i++) {
		this.point[i] = new Point(0, 0);
	}

};