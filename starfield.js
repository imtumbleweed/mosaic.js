var Star = function(x,y) {
	this.x;
	this.y;
	this.state = false;
	this.angle = Math.random() * 360;
	this.alpha = 0.0;
	this.velocity = 1.0;
	this.counter = 0; // life counter
}
    		/* starParticle processor */
			var STARFIELD_STARS_MAX = 1000;
			var starParticle = new Array();
			var starParticle_idx = 0;

			$(document).ready(function() {
				for (var i = 0; i < STARFIELD_STARS_MAX; i++)
			    	starParticle[i] = new Star(mobileWidth/2, mobileHeight/2);
		    });
		    	
		    function add_star(x,y ) {
		    	starParticle_idx++;
		    	if (starParticle_idx >= STARFIELD_STARS_MAX)
		    		starParticle_idx = 0;
		    	starParticle[starParticle_idx].x = x;
		    	starParticle[starParticle_idx].y = y;
		    	starParticle[starParticle_idx].state = true;
				starParticle[starParticle_idx].angle = Math.random() * 360;
		    }
		    
			function proc_starfield() {
				for (var i = 0; i < STARFIELD_STARS_MAX; i++) {
					if (starParticle[i].state == true) {
//						starParticle[i].segment.x += starParticle[i].segment.vecx * 0.25;

						var data = ang2vec(starParticle[i].angle);
						var dirx = data[0];
						var diry = data[1];
						starParticle[i].x += dirx*0.05*starParticle[i].velocity;
						starParticle[i].y += diry*0.05*starParticle[i].velocity;
						
						starParticle[i].velocity += 0.04;
						starParticle[i].alpha += 0.0015;

						// evaporate...
//						starParticle[i].y -= 0.05;
//						if (starParticle[i].alpha > 0.0)
//						    starParticle[i].alpha -= 0.001;
						
						// apply gravity
						//starParticle[i].segment.vecy += 0.3;
						
						starParticle[i].counter++;
						if (starParticle[i].counter % 100 == 0)
						{
//							var s = starParticle[i].segment.normal();
//							var n = s.unit();
//							add_starParticleet( s );
						}
						
						if (starParticle[i].counter > 1000) {
							starParticle[i].counter = 0;
							starParticle[i].velocity = 1.0;
							starParticle[i].alpha = 0.0;
							starParticle[i].state = false;
						}
					}
				}
			}
			function draw_starfield() {
				for (var i = 0; i < STARFIELD_STARS_MAX; i++) {
					if (starParticle[i].state == true) {
						gfx.globalAlpha = starParticle[i].alpha;

						star.rotscale(starParticle[i].x, starParticle[i].y, 1, 1, starParticle[i].angle);
						gfx.globalAlpha = 1;
			        }
			    }
//			    gfx.globalAlpha = 1;
			}