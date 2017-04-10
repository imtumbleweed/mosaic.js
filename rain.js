class Raindrop {
    constructor(x,y,velx,vely) {
        this.x = this.originalx = x;
        this.y = this.originaly = y;
        this.velx = velx;
        this.vely = vely;
        this.grab_x = 0; // Mouse grabbed this rain at...
        this.grab_y = 0;

        this.color = "#777";
        this.segment = new Segment(x, y, velx*5, vely*5);
        this.length = 5;//segment.length();
        console.log("Raindrop created.");
    }
}

class RainManager {
    constructor(x,y,width,height,rain_volume)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.volume = rain_volume;
        this.cloud = new Segment(x,y,width,0);
        this.ghostcloud = new Segment(x,y,width,0); // draggable rain
        this.raindrop = new Array();
        this.draggableNow = false;
        this.highlighted = false;
        this.attachedToMouse = false;
        this.dragLine = new Segment(0,0,0,0);
        this.mousedragx = 0;
        this.mousedragy = 0;
        this.bg = new Rectangle(x,y,width,height);

        for (var i = 0; i < this.volume; i++) {

            this.raindrop[i] = new Raindrop(this.x + Math.random() * this.width,
                                            this.y,
                                            -0.23,
                                            3 + Math.random() * 1.100);
        }

        this.process = () => {

            this.bg.x = grid.x + this.cloud.x;
            this.bg.y = grid.y + this.cloud.y;
            this.bg.height = this.height - this.y;

            for (var i = 0; i < this.volume; i++) {

                // Raindrop hits game level
                for (var j = 0; j < BoxManager.objects.length; j++) {
                    //BoxManager.objects[j].bg.draw("red");
                    if (BoxManager.objects[j].bg.pointInside(this.raindrop[i].segment.x, this.raindrop[i].segment.y)) {
                        // Reset raindrop if it hits an object
                        this.raindrop[i].segment.x = -grid.x + this.ghostcloud.x + Math.random() * this.width;
                        this.raindrop[i].segment.y = -grid.y + this.ghostcloud.y;
                    }
                }

                // Raindrop reached bottom of its area, reset
                this.raindrop[i].segment.x += this.raindrop[i].velx;
                this.raindrop[i].segment.y += this.raindrop[i].vely;
                if (this.raindrop[i].segment.y > this.height) {
                    this.raindrop[i].segment.x = -grid.x + this.ghostcloud.x + Math.random() * this.width;
                    this.raindrop[i].segment.y = -grid.y + this.ghostcloud.y;
                }
            }

        }

        // Init: run rain for a period of time before displaying it
        for (var j = 0;j<1000;j++)
            this.process();

        this.draw = () => {
            // draw background
            if (this.highlighted) {
//                gfx.globalAlpha = 0.7;
    //            this.bg.draw("#111", true, false);
  //              gfx.globalAlpha = 1;
            }
            // draw cloud stretch
            this.cloud.drawAt(grid.x, grid.y, 1, "#fff");

            //var seg = new Segment(this.ghostcloud.x, this.ghostcloud.y, this.width, 0);
            //seg.draw(3,"pink");

            // draw raindrops
            for (var i = 0; i < this.volume; i++) {
                this.raindrop[i].segment.drawAt(grid.x, grid.y, 1,  this.raindrop[i].color);
            }
            if (this.draggableNow) {
                moveicon.draw(grid.x+this.x + this.width/2, grid.y+this.y + 32);
            }
        }
    }
}

var RainArea = new Array();

RainArea.add = function(x,y,width,height,vol) {
    RainArea[RainArea.length] = new RainManager(x,y,width,height,vol);
}

function MakeRainsSelectable(boolean_state) {
    for (var i = 0; i < RainArea.length; i++) {
        RainArea[i].draggableNow = boolean_state;
    }
}

function RainIsBeingMoved() { // Are any of the rains being moved by the designer right now in real-time?
    for (var i = 0; i < RainArea.length; i++)
        if (RainArea[i].attachedToMouse) return true; return false;
}

function StopMovingAllRain() {
    for (var i = 0; i < RainArea.length; i++) {
        RainArea[i].attachedToMouse = false;
        RainArea[i].draggableNow = false;
        RainArea[i].highlighted = false
    }
}