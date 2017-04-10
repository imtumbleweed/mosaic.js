const BUBBLE_DEFAULT_MOVEMENT_SPEED = 2.5;

var BubbleParticle = function()  {
    this.segment = new Segment(100,100);
    this.bounding = new Rectangle(0,0,0,0);
    this.state = false;
    this.type = 0; // 0,1,2 or 3 to alternate sprites
    this.counter = 0; // life counter
    this.animationCounter = new Animate(0,0,0);
    this.dir = 0; // -1 = left; 1 = right
    this.floatspeed = 0;
    this.movementspeed = BUBBLE_DEFAULT_MOVEMENT_SPEED;
}

/* Dust particle processor */
var BUBBLE_MAX = 30;
var bubbleparticle = new Array();
var bub_idx = 0;

$(document).ready(function() {
    for (var i = 0; i < BUBBLE_MAX; i++)
        bubbleparticle[i] = new BubbleParticle(0, 0, 16, 0);
});

function add_bubbleparticle(xx, yy, ddir) {
    bub_idx++;
    if (bub_idx >= BUBBLE_MAX)
        bub_idx = 0;
    bubbleparticle[bub_idx].dir = ddir;
    bubbleparticle[bub_idx].segment = new Segment(xx,yy+20+Math.random()*8,    0,0);
    bubbleparticle[bub_idx].state = true;
    bubbleparticle[bub_idx].movementspeed = BUBBLE_DEFAULT_MOVEMENT_SPEED + Math.random()*0.5;

   // if (Math.floor(Math.random()*2)==0)
        //bubbleparticle[bub_idx].animationCounter = 0;
}

function proc_bubbleparticle() {
    for (var i = 0; i < BUBBLE_MAX; i++) {
        if (bubbleparticle[i].state == true) {

            bubbleparticle[i].bounding.x = bubbleparticle[i].segment.x;
            bubbleparticle[i].bounding.y = bubbleparticle[i].segment.y;
            bubbleparticle[i].bounding.width = 16;
            bubbleparticle[i].bounding.height = 16;

            //bubbleparticle[i].segment.x += bubbleparticle[i].segment.vecx * 0.25;

            bubbleparticle[i].segment.x += bubbleparticle[i].movementspeed * bubbleparticle[i].dir;
            bubbleparticle[i].segment.y -= bubbleparticle[i].floatspeed;
            bubbleparticle[i].floatspeed += 0.00075;

            // apply air friction
            bubbleparticle[i].movementspeed -= bubbleparticle[i].movementspeed * 0.01;

            bubbleparticle[i].counter++;
            //if (bubbleparticle[i].counter % 100 == 0)  {
//							var s = bubbleparticle[i].segment.normal();
//							var n = s.unit();
//							add_dustet( s );
            // }
            //
            if (bubbleparticle[i].counter >= 180) {

                Sound.play(1);

                bubbleparticle[i].counter = 0;
                bubbleparticle[i].state = false;
                bubbleparticle[i].floatspeed = 0;
                bubbleparticle[i].movementspeed = BUBBLE_DEFAULT_MOVEMENT_SPEED;

                // Reset animation counter
                bubbleparticle[i].animationCounter.animationCurrentFrame = 0;
                bubbleparticle[i].animationCounter.animationDelay = 0;
                bubbleparticle[i].animationCounter.animationIndexCounter = 0;
            }
        }
    }
}
function draw_bubbleparticle() {
    for (var i = 0; i < BUBBLE_MAX; i++) {
        if (bubbleparticle[i].state == true) {
            dust.rotAnim2(
                bubbleparticle[i].segment.x,
                bubbleparticle[i].segment.y,
                [8,9,10,11,12,13,14,15,16,17,18], // bubble
                //[32,33,34,35,36,37,38,39,40,41,42], // fire
                0, // angle
                16, // each dust particle is 16x16
                8, // # of sprites per width of the spritesheet
                20, // animation delay, for how long to display this frame before going to next?
                bubbleparticle[i].animationCounter); // its own custom animation counter object
        }
    }
}