var Bullet = function()
{
	this.segment = new Segment(0,0,0,0);
	this.state = false;
	this.counter = 0; // life counter
}

    		/* Bullet processor */
			var BULLET_MAX = 50;
			var bull = new Array();
			var bull_idx = 0;

			$(document).ready(function() {
			
				for (var i = 0; i < BULLET_MAX; i++)
			    	bull[i] = new Bullet(0, 0, 16);
		    });
		    	
		    function add_bullet(seg) {

		    	bull_idx++;
		    	
		    	if (bull_idx >= BULLET_MAX)
		    		bull_idx = 0;

		    	bull[bull_idx].segment = new Segment(seg.x, seg.y, seg.vecx, seg.vecy);
		    	bull[bull_idx].state = true;
		    	
		    	
		    	//bull[bull_idx].segment.draw(2,"green");
		    	

		    }
		    
			function proc_bullets() {
				for (var i = 0; i < BULLET_MAX; i++) {
					if (bull[i].state == true) {
						bull[i].segment.x += bull[i].segment.vecx * 0.25;
						bull[i].segment.y += bull[i].segment.vecy * 0.25;
						
						// apply gravity
						//bull[i].segment.vecy += 0.3;
						
						bull[i].counter++;
						if (bull[i].counter % 100 == 0)
						{
//							var s = bull[i].segment.normal();
//							var n = s.unit();
//							add_bullet( s );
						}
						if (bull[i].counter > 2000) {
							bull[i].counter = 0;
							bull[i].state = false;
						}
					}
				}
			}
			function draw_bullets() {
				for (var i = 0; i < BULLET_MAX; i++) {
					if (bull[i].state == true) {
						bull[i].segment.draw(1, "white");
			        }
			    }
//			    gfx.globalAlpha = 1;
			}