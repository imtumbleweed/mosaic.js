const ENEMY_LEFT = 0;
const ENEMY_RIGHT = 2;
const ENEMY_UP = 4;
const ENEMY_DOWN = 8;

// Already defined in player.js
// var temp = new Segment(0,0,0,0);
// var poi = new Point(0,0);

// Collision detection
/* Already defined in player.js
const TOTAL_COLPOINTS = 256;
const DEFAULT_GRAVITY = 0.85;
const MAXIMUM_GRAVITY = 7;
var downline = new Segment(300,300,0,100);
*/

/* already defined in player.js
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
}; */

class EnemyClass {
    constructor() {
        this.fly_y = 0;
        this.life = 100;
        this.hit = false;
        this.hitfalloff = 100;
        this.x = 0; // World coordinates
        this.y = 0;
        this.velx = 0;  // velocity
        this.vely = 0;
        this.momx = 0;  // momentum
        this.momy = 0;
        this.materialColor = "#19a6ff";
        this.color = this.materialColor;
        this.body = new Rectangle(this.x,this.y,32,64);
        this.active = false;
        this.action = 0; // 0 - walk
                         // 1 - bubble up
        this.pressed = false;
        this.attachedToMouse = false;
        this.controlKeysPressed = false;
        this.dirx = RIGHT; // defaults
        this.diry = DOWN;
        this.dir = -1;
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

        this.animationCounter = new Animate(0,0,0);

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

                if (this.hit) {
                    if (this.hitfalloff > 25) {
                        this.hitfalloff--;
                    } else {
                        this.hit = false;
                        this.hitfalloff = 25;
                    }
                }

                if (this.jumping) {
                    this.y -= 10; // JumpForce
                    this.y += this.Gravity * 2;
                    this.Gravity *= 1.055;
                    if (this.Gravity >= MAXIMUM_GRAVITY)
                        this.Gravity = MAXIMUM_GRAVITY;
                }

                // Process player movement (friction)
                if (this.gravityType == 1) {
                    /* if (Player.controlKeysPressed == false) {
                        this.momx -= this.momx * 0.075;
                        this.x += this.momx;
                    } */
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

            // only if its not defeated
            if (this.action != 0)
             return;

            if (this.active) {

                downline.x = grid.x + this.x;
                downline.y = grid.y + this.y;

                var colidx = 0;

                for (var i = 0; i < TOTAL_COLPOINTS; i++) this.dots[i].height = 0;

                for (var i = 0; i < BoxManager.objects.length; i++) {

                    /* Enemies cannot collect collectibles
                    if (BoxManager.objects[i].type == BOX_TYPE_COLLECTIBLE) {
                        var pbox = new Rectangle(this.x,this.y,32,32);
                        pbox.draw("red",false,true);
                        if (pbox.rectInside(BoxManager.objects[i].bg)) {
                            BoxManager.objects[i].type = -1;// = "black"; // hide
                            Sound.play(0);
                            continue;
                        }
                    } */

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
                        //this.dot.draw(2, "gray");
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

                    this.dot.x = this.dots[this.shortest_idx].x;
                    this.dot.y = this.dots[this.shortest_idx].y;

                    //this.dot.draw(2, "red");

                    var pt = new Point(grid.x+this.x, grid.y+this.y);
                    //pt.draw(2, "pink");

                    var se = new Segment(pt.x,pt.y,0,this.dot.y-pt.y);

                    if (se.vecy < 35) {
                        //  se.draw(2, "red");
                        this.y = -grid.y + this.dot.y - 35;
                    }

                    // calculate sprite location
                    this.drawx = this.dot.x - 16;
                    this.drawy = this.dot.y - 34;
                }
            }
        }

        this.draw = () => {
            if (this.active) {
                this.body.x = this.x;
                this.body.y = this.y;
                this.body.drawAt(grid.x,grid.y,"#111", false, true);

                var sequence = [];
                if (this.dir == -1)  {
                    sequence = [0,1];
                    if (this.hit) sequence = [4,5];

                    if (this.action == 0)
                        this.x -= 0.1;
                }
                if (this.dir == 1)  {
                    sequence = [2,3];
                    if (this.hit) sequence = [6,7];

                    if (this.action == 0)
                        this.x += 0.1;
                }

                this.flyy -= 1;
                if (this.action == 1) {
                    this.drawy -= 0.5;
                    // Draw the enemy sprite
                    if (game.ResourcesLoaded)
                        bug.rotAnim2(this.drawx, this.drawy,
                            [8],
                            0,
                            64,
                            4,
                            20,
                            this.animationCounter);
                } else {
                    // Draw the enemy sprite
                    if (game.ResourcesLoaded)
                        bug.rotAnim2(+this.drawx, this.drawy - 8,
                            sequence,
                            0,
                            64,
                            4,
                            20,
                            this.animationCounter);
                }




            }
        }

        // Load player's previous position if available
        this.load = () => {

        }

        // Save player position in file
        this.save = () => {

        }
    }
}