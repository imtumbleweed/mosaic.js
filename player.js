const LEFT = 0;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;
var temp = new Segment(0,0,0,0);
var poi = new Point(0,0);

// Collision detection
const TOTAL_COLPOINTS = 32;
const DEFAULT_GRAVITY = 0.85;
const MAXIMUM_GRAVITY = 5;
var downline = new Segment(300,300,0,100);

class CollisionData {
    constructor(x, y, height)  {
        this.x = x;
        this.y = y;
        this.height = height;
        this.sett = function (x, y, ht) {
            this.x = x;
            this.y = y;
            this.height = ht;
        }
    }
};

class PlayerClass {
    constructor() {
        this.x = 0; // World coordinates
        this.y = 0;
        this.velx = 0;  // velocity
        this.vely = 0;
        this.momx = 0;  // momentum
        this.momy = 0;
        this.materialColor = "#19a6ff";
        this.color = this.materialColor;
        this.body = new Rectangle(this.x,this.y,64,64);
        this.active = false;
        this.pressed = false;
        this.attachedToMouse = false;
        this.controlKeysPressed = false;
        this.dirx = RIGHT; // defaults
        this.diry = DOWN;

        this.firing = false;

        this.collision = false;

        this.drawx = 0; // actual drawing location of the sprite after collision
        this.drawy = 0; // need to do it this way to fix collision-gravity jitter bug

        this.gravityType = 1; // 0 = hovering (0-gravity)
                              // 1 = normal gravity
                              // 2 = top down view (Z-axis gravity)

        this.falling = true;
        this.jumping = false;
        this.grounded = false;
        this.grounded2 = false;
        this.playerHeight = 100;// height of the player counting from top of the collision ray

        this.jumping = false;
        this.dot = new Point(0,0);
        this.JumpingVelocity = 35;
        this.JumpingVelocityMult = 1.05;
        this.Gravity = 1;

        this.shortest_idx = 0;
        this.shortest_height = 10000;
        this.already_jumping = false;

        this.rod = new Segment(0,0,0,0);

        this.dots = new Array();

        for (var i = 0; i < TOTAL_COLPOINTS; i++)
            this.dots[i] = new CollisionData(0, 0, 0);

        this.spawn = (px, py) => {
            console.log("Spawning player at " + px + ", " + py);
            this.body.x = px-this.width/2;
            this.body.y = py-this.width/2;
            this.active = true;
            this.attachedToMouse = true;
            this.pressed = true;
        }

        this.process = () => {
            if (this.active) {

                if (this.jumping) {
                    this.y -= 2; // JumpForce
                    this.y += this.Gravity * 2;
                    this.Gravity *= 1.055;
                    if (this.Gravity >= MAXIMUM_GRAVITY)
                        this.Gravity = MAXIMUM_GRAVITY;
                }

                // Process player movement (friction)
                if (this.gravityType == 1) {
                    if (Player.controlKeysPressed == false) {
                        this.momx -= this.momx * 0.075;
                        this.x += this.momx;
                    }
                }

                // Drag player around if attached to mouse
                if (this.attachedToMouse) {
                    this.x = -grid.x+Mouse.x-this.body.width/2;
                    this.y = -grid.y+Mouse.y-this.body.height/2;
                }
                if (this.pressed) {

                }
                // Mouse was clicked down once
                if (Mouse.down) {
                    if (this.body.pointInside(Mouse.x, Mouse.y)) {
                        this.attachedToMouse = true;
                        this.pressed = true;
                        this.color = "#c6f000";
                        // Reset toolbox
                        toolbox.currentToolID = -1;
                        toolbox.line.vecx = 0;
                        toolbox.line.vecy = 0;
                        toolbox.pressed = false;
                        $(".ToolIcon").removeClass("Selected");
                    }
                }
                // Mouse was clicked up once
                if (window.clicked) {
                    if (this.attachedToMouse) { // release from the mouse into the world
                        this.attachedToMouse = false;
                        this.color = this.materialColor;
                    }
                    this.pressed = false;
                }

                if (this.falling) {
                   this.y += 1.5;
                }
            }
        };


        this.collide = () => {

            if (this.active) {

                downline.x = grid.x + this.x;
                downline.y = grid.y + this.y;

                var colidx = 0;

                for (var i = 0; i < TOTAL_COLPOINTS; i++) this.dots[i].height = 0;

                for (var i = 0; i < BoxManager.objects.length; i++) {

                    if (BoxManager.objects[i].type == BOX_TYPE_COLLECTIBLE) {
                        var pbox = new Rectangle(this.x,this.y,32,32);
                        pbox.draw("red",false,true);
                        if (pbox.rectInside(BoxManager.objects[i].bg)) {
                            BoxManager.objects[i].type = -1;// = "black"; // hide

                            var sfxtag = "sfxcoin" + window.collectibleCurrentSfx;
                            window[sfxtag].play();
                            if (window.collectibleCurrentSfx++ >= 7)
                                window.collectibleCurrentSfx = 0;
                            continue;
                        }
                    }

                    if (BoxManager.objects[i].type == BOX_TYPE_RECT) {
                        temp.x = grid.x + BoxManager.objects[i].bg.x;
                        temp.y = grid.y + BoxManager.objects[i].bg.y;
                        temp.vecx = BoxManager.objects[i].bg.width;
                        temp.vecy = 0;
                    }

                    if (BoxManager.objects[i].type == BOX_TYPE_LEFTSLOPE) {
                        temp.x = grid.x + BoxManager.objects[i].triangle.A.x;
                        temp.y = grid.y + BoxManager.objects[i].triangle.A.y;
                        temp.vecx = -BoxManager.objects[i].width;
                        temp.vecy = BoxManager.objects[i].triangle.A.vecy - BoxManager.objects[i].triangle.B.vecy;
                    }

                    if (BoxManager.objects[i].type == BOX_TYPE_RIGHTSLOPE) {
                        temp.x = grid.x + BoxManager.objects[i].triangle.A.x;
                        temp.y = grid.y + BoxManager.objects[i].triangle.A.y;
                        temp.vecx = BoxManager.objects[i].triangle.A.vecx;
                        temp.vecy = BoxManager.objects[i].triangle.B.vecy + BoxManager.objects[i].height;
                    }

                    //temp.draw(1, "yellow");

                        // find shortest
                        if (temp.intersect(downline) == DO_INTERSECT) {
                            this.dot.x = int_x;
                            this.dot.y = int_y;
                            this.dot.draw(2, "gray");
                            this.dots[colidx].x = int_x;
                            this.dots[colidx].y = int_y;
                            this.dots[colidx++].height = int_y;
                        }
                }

                if (colidx > 0) {

                    this.JumpingVelocity = 1;
                    this.jumping = false;
                    this.falling = true;
                    this.Gravity = DEFAULT_GRAVITY;

                    // Now find the intersection with shortest distance
                    this.shortest_height = 100000;
                    for (var i = 0; i < colidx; i++) {
                        if (this.dots[i] != undefined) {
                            if (this.shortest_height > this.dots[i].height) {
                                this.shortest_height = this.dots[i].height;
                                this.shortest_idx = i;
                            }
                        }
                    }



                    //text(this.shortest_idx, 220, 220);

                    this.dot.x = this.dots[this.shortest_idx].x;
                    this.dot.y = this.dots[this.shortest_idx].y;

                    this.dot.draw(2, "red");

                    var pt = new Point(grid.x+this.x, grid.y+this.y);
                    pt.draw(2, "pink");

                    var se = new Segment(pt.x,pt.y,0,this.dot.y-pt.y);

                    if (se.vecy < 35) {
                        se.draw(2, "red");
                        this.y = -grid.y + this.dot.y - 35;
                    }// else
                       // se.draw(2, "yellow");

                   // var hh = this.dot.y-this.y;//grid.y+this.dot.y-this.y;
                    //var seg = new Segment(grid.x+this.x,grid.y+this.y,0,hh);
                    //seg.draw(2,"yellow");

                    // adjust player position
                    //if (hh < 50) {
                    //    this.y = this.dot.y - 50;
                    //}


                    // calculate sprite location
                    this.drawx = this.dot.x - 16;
                    this.drawy = this.dot.y - 34;
                }

            }

        }

        this.draw = () => {

            this.body.draw(this.color, true, true);

            if (this.active) {
                this.body.x = grid.x + this.x;
                this.body.y = grid.y + this.y;

                //if (this.attachedToMouse)
                //{

                //}

               //
                //this.colray.x = this.body.x + 32;
                //this.colray.y = this.body.y + 0;
                // this.colray.draw(2, "white");
            }
        }

        // Load player's previous position if available
        this.load = () => {
            console.log("Loading Player data.");
            $.ajax( { url : "player.txt", type: "POST", success: function(msg) {
                //if (Player instanceof PlayerClass) {
                    var object = JSON.parse(msg);
                    for (var property in object) {
                        if (object.hasOwnProperty(property)) {
                            //console.log(typeof(property));
                            if (object[property] != "[object Object]") {
                                Player[property] = object[property];
                                //console.log(property + "=" + object[property]);
                            }
                        }
                    }

                    //console.log(msg);
                    //Player = JSON.parse(msg);
                //}
            }});
        }

        // Save player position in file
        this.save = () => {
            console.log("Player.save()...");
            $.ajax( {   url : "saveplayer.php",  type : "POST",
                        data : { "payload" : JSON.stringify(Player)},
                success: function(msg) {
                    console.log(msg);
                }
            });
        }
    }
}