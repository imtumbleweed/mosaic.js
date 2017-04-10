class Grid {
    constructor(width, height) {
        const GlobalSize = 50;
        const LineLenght = 2000;
        const LineColor = "#191919";
        const LineSubColor = "#0a0a0a";
        this.x = 0;
        this.y = 0;
        // Load previous workspace coordinates
        if (localStorage.getItem("worldx") != undefined && localStorage.getItem("worldy") != undefined) { this.x = parseInt(localStorage.getItem("worldx")); this.y = parseInt(localStorage.getItem("worldy")); }
        this.current_x = 0; // this should be this.drag_x/y from toolbox.js
        this.current_y = 0;
        this.width = width;
        this.height = height;
        this.halffWidth = this.width/2;
        this.halfHeight = this.height/2;
        this.verticalSegments = new Array();
        this.horizontalSegments = new Array();
        this.verticalSubSegments = new Array();
        this.horizontalSubSegments = new Array();

        var orig_x = 0; // Mouse.velocityx; // this.x + i * this.width;
        var orig_y = 0;   // this.y + i * this.width;

        // Initialize segments
        for (var i = 0; i < GlobalSize; i++) this.verticalSegments[i] = new Segment(orig_x + i * this.width, 0,     0, LineLenght);
        for (var i = 0; i < GlobalSize; i++) this.horizontalSegments[i] = new Segment(0, orig_y + i * this.width,     LineLenght, 0);
        for (var i = 0; i < GlobalSize; i++) this.verticalSubSegments[i] = new Segment(orig_x + i * this.width/2, 0,     0, LineLenght);
        for (var i = 0; i < GlobalSize; i++) this.horizontalSubSegments[i] = new Segment(0, orig_y + i * this.width/2,     LineLenght, 0);

        this.process = () => { // Move grid by the amount
            if (toolbox.pressed) { // If mouse button is pressed down
                //this.x = this.current_x + toolbox.line.vecx;
                //this.y = this.current_y + toolbox.line.vecy;
            }
        }

        this.drawSubgrid = () => {
            for (var i = 0; i < GlobalSize; i++) {
                this.verticalSubSegments[i].x = (i * this.halffWidth) + this.x;
                this.verticalSubSegments[i].y =  this.y;
                this.horizontalSubSegments[i].x =  this.x;
                this.horizontalSubSegments[i].y = (i * this.halfHeight) + this.y;
                this.verticalSubSegments[i].draw(1, LineSubColor);
                this.horizontalSubSegments[i].draw(1, LineSubColor);
            }
        }

        this.draw = () => {

            this.drawSubgrid();
            for (var i = 0; i < GlobalSize; i++) {
                this.verticalSegments[i].x = (i * this.width) + this.x;
                this.verticalSegments[i].y =  this.y;
                this.horizontalSegments[i].x =  this.x;
                this.horizontalSegments[i].y = (i * this.height) + this.y;
                this.verticalSegments[i].draw(1, LineColor);
                this.horizontalSegments[i].draw(1, LineColor);
            }

            // todo: check if resources finished loading

            // Draw objects
            //if (window.hovercraft != undefined)
               //window.hovercraft.draw(this.x + 500, this.y + 200);
        }
    }
}