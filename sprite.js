window.ResourceId = 0;
var SpriteSilentLoad = false; // Do not output to loading state to console; if enabled.
var Sprite = function(fn) {
    var that = this;
    var root = this;
    this.filename = fn;
    this.TO_RADIANS = Math.PI/180;
    this.image = null;
    this.is_pattern = false;
    this.pattern = null;
    this.pattern_x_times = 0;
    this.width = 0;
    this.height = 0;
    this.image = null;
    this.load = function(filename) {
        this.image = new Image();
        this.image.onload = function(event) {
            that.width = this.width;
            that.height = this.height;
            // Only count resources loaded from the resource folder here, not sprites explicitly created by programmer; because otherwise it'll mess with the loading bar counter
            // Programmer-instantiated sprites are a special case and should be handled separately
            if (fn.substr(0,9) == "resources")
                window.ResourceId++;
            if (SpriteSilentLoad)
            console.log("Loaded sprite (" + that.width + "x" + that.height + ") " + fn + " ("+window.ResourceId+" of " + game.resourceNumber + ")");
            if (window.ResourceId >= game.resourceNumber) {
                game.ResourcesLoaded = true;
                console.log("All resources have finished downloading.");
            }
        };
        this.image.src = filename;
        return this;
    };
    this.to_pattern = function(x_times) { this.pattern_x_times = x_times; this.pattern = Context.context.createPattern(this.image, 'repeat'); this.is_pattern = true; };
    this.spritesheet = null;
    this.rect = new Rectangle(0, 0, 0, 0);

    // Load from spritesheet
    if (fn instanceof Spritesheet) { this.spritesheet = fn; this.image = this.spritesheet.image; } else

    // Load from sprite
    if (fn != undefined && fn != "" && fn != null) this.load(fn); else console.log("Unable to load sprite. Filename '" + fn + "' is undefined or null.");

    // Check if this sprite was pressed on (with either mouse or touch)
    this.pressed = function() {
        if (that) {
            that.rect.x = that.x;
            that.rect.y = that.y;
            that.rect.width = that.width;
            that.rect.height = that.height;
            return that.rect.pressed();
        }
        return false;
    }

    // Check if point inside rectangle of this sprite
    this.pointInside = function(px, py) {
        if (that) {
            that.rect.x = that.x;
            that.rect.y = that.y;
            that.rect.width = that.width;
            that.rect.height = that.height;
//			gfx.globalAlpha = 0.25;
            //that.rect.draw("white"); // for debugging touchable areas
//			gfx.globalAlpha = 1;
            return that.rect.pointInside(px, py);
        }
        return false;
    };

    this.drawHC = function(y, scale) {
        if (scale == undefined) scale = 1;
        var x = (($("#game").width()/2)-(that.width/2));
        that.x = x;
        that.y = y;
        Context.context.save();
        Context.context.scale(scale, scale);
        //      Context.context.translate(that.x, that.y);
        Context.context.drawImage(this.image, that.x, that.y, that.width, that.height);
        Context.context.restore();
    }

    // Normal draw
    this.drawOldVersion = function(x, y) {
        that.x = x;
        that.y = y;
        Context.context.drawImage(this.image, x, y, BLOCK_W, BLOCK_H);
    };

    this.draw = function(x, y, various, sprite_width, cellsPerWidth) {
        that.x = x;
        that.y = y;

        // Draw regular sprite
        if (various == undefined) {
            Context.context.drawImage(this.image, x, y, that.width, that.height);
        } else

        // If various is a single numeric frame id
        if ($.isNumeric(various) && various >= 0) {
            var res = i2xy(various, cellsPerWidth);
            Context.context.drawImage(this.image, res[0]*cellsPerWidth, res[1]*cellsPerWidth, cellsPerWidth, cellsPerWidth, x, y, cellsPerWidth, cellsPerWidth);
        } else

        // if various is Animation Sequence - an array like [1,2,3,4] or [17,18,19,20];
        if (various.length != undefined && various.length > 0)
        {
            if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= 3) {
                AnimationCounter[AnimationCounterIndex].animationDelay = 0;
                AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
                if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= various.length)
                    AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
                AnimationCounter[AnimationCounterIndex].animationCurrentFrame = various[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
            }
            var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, cellsPerWidth);
            Context.context.drawImage(this.image, res[0]*sprite_width, res[1]*sprite_width,
                sprite_width, sprite_width, x, y, sprite_width, sprite_width);

            AnimationCounterIndex++;

           // if (AnimationCounterIndex >= 32000)
              //  AnimationCounterIndex = 0;
        }
    };


    this.rotAnim = function(x, y, sequence, angle, size, cellsPerWidth, animationDelayX/*, callback_end_sequence*/)
    {
        that.x = x;
        that.y = y;

        if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= animationDelayX) {
            AnimationCounter[AnimationCounterIndex].animationDelay = 0;
            AnimationCounter[AnimationCounterIndex].animationIndexCounter++;

            if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= sequence.length)
                AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;

            AnimationCounter[AnimationCounterIndex].animationCurrentFrame = sequence[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
        }
        var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, cellsPerWidth);

        Context.context.save();
        Context.context.translate(x+size/2, y+size/2);    // Translate sprite to its center
        Context.context.rotate(angle * this.TO_RADIANS);    // Rotate sprite around its center
        Context.context.drawImage(this.image, res[0]*size, res[1]*size, size, size,
            -size/2, -size/2,                         // Translate sprite back to its original position
            size, size);
        Context.context.restore();

        window.AnimationCounterIndex++;
    };

    // The difference is that rotAnim2 requires its own custom animation counter object;
    // this is useful when you have animated particles, otherwise global counter can quickly get out of control...
    this.rotAnim2 = function(x, y, sequence, angle,
                             size, // size of a single sprite
                             cellsPerWidth, // # of cells per width in entire spritesheet
                             animationDelayX,
                             AnimationCounterObject // pass its own animation counter
                             /*, callback_end_sequence*/)
    {
        that.x = x;
        that.y = y;
        var res = 0;
        // Passes its own animation counter object?
        if (AnimationCounterObject != null && AnimationCounterObject != undefined) {
            if (AnimationCounterObject.animationDelay++ >= animationDelayX) {
                AnimationCounterObject.animationDelay = 0;
                AnimationCounterObject.animationIndexCounter++;
                if (AnimationCounterObject.animationIndexCounter >= sequence.length)
                    AnimationCounterObject.animationIndexCounter = 0;
                AnimationCounterObject.animationCurrentFrame = sequence[AnimationCounterObject.animationIndexCounter];
            }
            res = i2xy(AnimationCounterObject.animationCurrentFrame, cellsPerWidth);
        } else { // Uses global animation counter
            /*
            if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= animationDelayX) {
                AnimationCounter[AnimationCounterIndex].animationDelay = 0;
                AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
                if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= sequence.length)
                    AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
                AnimationCounter[AnimationCounterIndex].animationCurrentFrame = sequence[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
            }
            res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, cellsPerWidth);
            */
        }
        Context.context.save();
        Context.context.translate(x+size/2, y+size/2);    // Translate sprite to its center
        Context.context.rotate(angle * this.TO_RADIANS);    // Rotate sprite around its center
        Context.context.drawImage(this.image, res[0]*size, res[1]*size, size, size,
            -size/2, -size/2,                         // Translate sprite back to its original position
            size, size);
        Context.context.restore();
       // AnimationCounterIndex++;
    };

    // Stretched draw
    this.draw2 = function(x, y, w, h) {
        that.x = x;
        that.y = y;
        if (this.is_pattern) {
            //Context.context.fillStyle = Context.context.createPattern(this.image, 'repeat');;
            //Context.context.fillRect(x, y, w, h);
            for (var i = 0; i < this.pattern_x_times; i++) {
                Context.context.drawImage(this.image, x + w*i, y, w, h);
            }
        } else {
            Context.context.drawImage(this.image, x, y, w, h);
        }
    };

    // Rotated draw
    this.rot = function(x, y, angle) {
        that.x = x - that.image.width / 2;
        that.y = y - that.image.height / 2;
        Context.context.save();
        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        Context.context.restore();
    };

    // Rotated draw
    this.rotscale = function(x, y, sx, sy, angle) {
        that.x = x - that.image.width / 2;
        that.y = y - that.image.height / 2;
        Context.context.save();
        Context.context.translate(x, y);
        Context.context.scale(sx, sy);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        Context.context.restore();
    };

    // Rotated draw; around a specific point on the sprite (cpx, cpy)
    this.rotscale2 = function(x, y, sx, sy, angle, offsetx, offsety) {
        that.x = x - that.image.width / 2;
        that.y = y - that.image.height / 2;
        that.x -= offsetx;
        that.y -= offsety;

//    	alert(offsetx + "," + offsety);
//    	that.x
        Context.context.save();
        Context.context.translate(that.x, that.y);
        Context.context.scale(sx, sy);
        Context.context.rotate(angle * this.TO_RADIANS);
//        if (game != undefined && game.width > 0) {
        Context.context.drawImage(this.image, 0,0);//game.width / 2, game.height / 2);
        //      }
        Context.context.restore();
    };

};