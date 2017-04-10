var DustParticle = function()  {
    this.segment = new Segment(0,0);
    this.state = false;
    this.type = 0; // 0,1,2 or 3 to alternate sprites
    this.counter = 0; // life counter
    this.animationCounter = new Animate(0,0,0);
}

/* Dust particle processor */
var DUST_MAX = 30;
var dustparticle = new Array();
var dust_idx = 0;

$(document).ready(function() {
    for (var i = 0; i < DUST_MAX; i++)
        dustparticle[i] = new DustParticle(0, 0, 16);
});

function add_dustparticle(xx,yy) {
    dust_idx++;
    if (dust_idx >= DUST_MAX)
        dust_idx = 0;
    dustparticle[dust_idx].segment = new Segment(xx,yy+Math.random()*4,10,10);
    dustparticle[dust_idx].state = true;
    if (Math.floor(Math.random()*2)==0)
        dustparticle[dust_idx].animationCounter = 1;
}

function proc_dustparticle() {
    for (var i = 0; i < DUST_MAX; i++) {
        if (dustparticle[i].state == true) {
            //dustparticle[i].segment.x += dustparticle[i].segment.vecx * 0.25;
            dustparticle[i].segment.y -= 0.1;

            // apply gravity
            //dustparticle[i].segment.vecy += 0.3;

            dustparticle[i].counter++;
            //if (dustparticle[i].counter % 100 == 0)  {
//							var s = dustparticle[i].segment.normal();
//							var n = s.unit();
//							add_dustet( s );
           // }

            //
            if (dustparticle[i].counter >= 140) {
                dustparticle[i].counter = 0;
                dustparticle[i].state = false;

                // Reset animation counter
                dustparticle[i].animationCounter.animationCurrentFrame = 0;
                dustparticle[i].animationCounter.animationDelay = 0;
                dustparticle[i].animationCounter.animationIndexCounter = 0;
            }
        }
    }
}
function draw_dustparticle() {
    for (var i = 0; i < DUST_MAX; i++) {
        if (dustparticle[i].state == true) {
            dust.rotAnim2(
                dustparticle[i].segment.x,
                grid.y + dustparticle[i].segment.y,
                [0, 1, 2, 3, 4, 5, 6, 7],
                0, // angle
                16, // each dust particle is 16x16
                8, // # of sprites per width of the spritesheet
                15, // animation delay, for how long to display this frame before going to next?
                dustparticle[i].animationCounter); // its own custom animation counter object
        }
    }
}