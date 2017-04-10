$(document).ready(function() {
    toolbox.ConfigureRightClick(); // Now that DOM is loaded, configure right click on toolbox
});

const ACTION_MAKE_LEFT_SLOPE = 0;
const ACTION_MAKE_RIGHT_SLOPE = 1;
const ACTION_MAKE_COLLECTIBLE = 2;

class Toolbox {
    constructor() {
        this.contextMenuOpen = false;
        this.ConfigureRightClick = () => {
            $(".ContextItem").on("click", function() {
                event.preventDefault();
                var action = $(this).attr("action");
                if (action == "Convert to Left Slope") {
                }
                if (action == "Convert to Right Slope") {
                }
                $("#ContextMenu").hide();
                Toolbox.contextMenuOpen = false;
            });
            $(document).on("contextmenu", function() {
                event.preventDefault();
                $("#ContextMenu").show();
                $("#ContextMenu").css({"left":(Mouse.x+16)+"px","top":Mouse.y+"px"});
                $("#ContextMenu").fadeIn(200);
                Toolbox.contextMenuOpen = true;
            });
        }

        this.SELECTION_TOOL = 0;
        this.MOVE_WORLD = 1;
        this.BOX_TOOL = 2;
        this.CIRCLE_TOOL = 3;
        this.WHOKNOWS_TOOL = 4;
        this.ERASER_TOOL = 5;
        this.SOME_TOOL = 6;
        this.RAINMAKER = 7;
        this.CELESTIAL = 8;
        this.currentToolID = this.SELECTION_TOOL;

        this.hand_dragging = false;

        //this.gridFriction = 0.01;
        //this.toolSpritesheet = new Spritesheet("tools.png");
        this.old_x = 0;
        this.old_y = 0;
        this.drag_x = 0; // current position of the grid in the world (todo: move to grid.js)
        this.drag_y = 0;
        this.line = new Segment(0, 0, 0, 0);
        this.otherline = new Segment(0, 0, 0, 0);
        this.pressed = false; // Mouse button is held down
        this.selectionBox = new Rectangle(0, 0, 0, 0);
        this.infoBox = new Rectangle(0, 0, 0, 0);

        this.tmp = new Rectangle(0,0,0,0);

        this.resetRain = () => {
            this.pressed = true;
        };

        // Change shape type of selected elements
        this.action = (act) => {
            for (var i = 0; i < BoxManager.objects.length; i++)  {
                if (BoxManager.objects[i].selected) {
                    if (act == ACTION_MAKE_LEFT_SLOPE)
                        BoxManager.objects[i].convert(BOX_TYPE_LEFTSLOPE);
                    if (act == ACTION_MAKE_RIGHT_SLOPE)
                        BoxManager.objects[i].convert(BOX_TYPE_RIGHTSLOPE);
                    if (act == ACTION_MAKE_COLLECTIBLE)
                        BoxManager.objects[i].convert(BOX_TYPE_COLLECTIBLE);
                }
            }
        };

        // Turn all tools off and reset their functionality
        this.off = () => {
            this.currentToolID = -1;
            this.line.vecx = 0;
            this.line.vecy = 0;
            this.pressed = false; // Reset tool "mouse is down" state
            if(localStorage) {
                localStorage.worldx = window.grid.x;
                localStorage.worldy = window.grid.y;
            }
        };

        this.select = (tool_id) => {
            this.currentToolID = tool_id;
        };
        this.draw = () => { // Draw current tool icon at mouse position
            //this.toolSpritesheet.draw();
            //if (this.pressed) // Draw the line only if mouse is currently held down
               //this.line.draw(1, "#0080e2");
        };
        this.process = function () {

            // Do not process anything if context sub-menu is open
            if (Toolbox.contextMenuOpen) return;

            // Keyboard shortcuts
            if (isCtrl && key.a) {
                for (var i=0;i<BoxManager.objects.length;i++) {
                    BoxManager.objects[i].selected = true;
                    BoxManager.objects[i].color = "teal";
                }
            }

            // Universal diagonal line!
            this.line.x = this.old_x;
            this.line.y = this.old_y;
            this.line.vecx = Mouse.x - this.old_x;
            this.line.vecy = Mouse.y - this.old_y;
            this.otherline.x = this.old_x + this.line.vecx;
            this.otherline.y = this.old_y;
            this.otherline.vecx = -this.line.vecx;
            this.otherline.vecy = this.line.vecy;

            /* --- Standard tool events ---
            if (this.currentToolID == this.RAINMAKER) { // Select objects in the world
                 if (this.pressed) { // Mouse is being currently pressed down

                 }
                 if (Mouse.leftdown) { // Mouse was clicked down
                     this.pressed = true;
                 }
                 if (window.clicked) { // Mouse was clicked up
                      this.pressed = false;
                 }
             }
            */

            if (this.currentToolID == this.RAINMAKER) { // Select objects in the world
                window.gfx.setLineDash([]);
                if (this.pressed) { // Mouse is being currently pressed down
                    // Mouse is being currently pressed down
                    this.selectionBox.x = this.old_x;
                    this.selectionBox.y = this.old_y;
                    this.selectionBox.width = Mouse.x - this.old_x;
                    this.selectionBox.height = Mouse.y - this.old_y;
                    gfx.globalAlpha = 0.4;
                    this.selectionBox.draw("#111", true, false);
                    this.selectionBox.draw("#555", false, true);
                    gfx.globalAlpha = 1;
                }
                if (Mouse.leftdown) { // Mouse was clicked down
                    this.old_x = Mouse.x; this.old_y = Mouse.y;
                    this.pressed = true;
                }
                if (window.clicked) { // Mouse was clicked up
                    RainArea.add(this.selectionBox.x,
                                 this.selectionBox.y,
                                 this.selectionBox.width,
                                 this.selectionBox.height,
                                 75);
                    this.pressed = false;
                }
            }

            if (this.currentToolID == this.ERASER_TOOL) { // Select objects in the world
                // Mouse is being currently pressed down
                if (this.pressed) {
                    // Browse through all objects and see if we're hovering over any of them, if so, delete object...
                    for (var i=0;i<BoxManager.objects.length;i++) {
                        if (BoxManager.objects[i] != undefined)
                            if (BoxManager.objects[i].bg.pointInside(Mouse.x, Mouse.y)) {
                                BoxManager.objects[i].color = "red";
                                // remove this object
                                //BoxManager.remove(i);
                            }
                    }

                }
                // Mouse was clicked down
                if (Mouse.leftdown) {

                    this.pressed = true;
                }
                // Mouse was clicked up
                if (window.clicked) { this.pressed = false; }
            }

            // Make a box
            if (this.currentToolID == this.BOX_TOOL) {
                window.gfx.setLineDash([]);
                // Mouse is being currently pressed down
                if (this.pressed) {
                    this.selectionBox.x = this.old_x;
                    this.selectionBox.y = this.old_y;
                    this.selectionBox.width = Mouse.x-this.old_x;
                    this.selectionBox.height = Mouse.y-this.old_y;

                    this.selectionBox.draw("#555", true, false);

                    this.line.draw(1, "#333");
                    this.otherline.draw(1, "#333");
                    // Draw box size inside info box
                    this.infoBox.x = Mouse.x + 48;
                    this.infoBox.y = Mouse.y + 16;
                    this.infoBox.width = 80;
                    this.infoBox.height = 64;
                    window.gfx.globalAlpha = 0.75;
                    this.infoBox.draw("#000", true, false);
                    window.gfx.globalAlpha = 1;
                    // Print box size
                    text( "World = " + (-window.grid.x+this.selectionBox.x) + ", " + (this.selectionBox.y - window.grid.y),  this.selectionBox.x - 8,  this.selectionBox.y - 8, "white", "left", 11, "verdana");
                    // Print box dimensions
                    text("W: " + this.selectionBox.width,  Mouse.x + 54, Mouse.y + 32,  "white", "left", 11, "verdana");
                    text("H: " + this.selectionBox.height,  Mouse.x + 54, Mouse.y + 48,  "white", "left", 11, "verdana");
                }
                // Draw box

                //window.gfx.setLineDash([]);
                // Mouse was clicked down
                if (Mouse.leftdown) { this.pressed = true; this.old_x = Mouse.x; this.old_y = Mouse.y; }
                // Mouse was clicked up
                if (window.clicked) {
                    // Add this box to box manager
                    this.pressed = false;

                    // If negative width or height, swap parameters to [x, y] = upper left corner
                    if (this.old_x > this.old_x + this.selectionBox.width) {
                        this.old_x = this.old_x + this.selectionBox.width;
                        this.selectionBox.width = -this.selectionBox.width;
                    }
                    if (this.old_y > this.old_y + this.selectionBox.height) {
                        this.old_y = this.old_y + this.selectionBox.height;
                        this.selectionBox.height = -this.selectionBox.height;
                    }

                    // Ignore objects with 0 width or height
                    if (this.selectionBox.width != 0 || this.selectionBox.height != 0)
                        BoxManager.add(this.old_x, this.old_y, this.selectionBox.width, this.selectionBox.height);
                }
            }

            // Select objects in the world
            if (this.currentToolID == this.SELECTION_TOOL) {

                // Handle rain in select mode
                for (var i = 0; i < RainArea.length; i++) {
                    if (RainArea[i].bg.pointInside(Mouse.x, Mouse.y)) {
                        RainArea[i].highlighted = true;
                        if (Mouse.leftdown) {
                            RainArea[i].attachedToMouse = true;
                            // RainArea[i].mousedragx = Mouse.x - RainArea[i].bg.x;
                            // RainArea[i].mousedragy = Mouse.y - RainArea[i].bg.y;

                            RainArea[i].dragLine.x = Mouse.x;
                            RainArea[i].dragLine.y = Mouse.y;
                            RainArea[i].dragLine.vecx = RainArea[i].bg.x - Mouse.x;
                            RainArea[i].dragLine.vecy = RainArea[i].bg.y - Mouse.y;

                            // memorize mouse click on rain
                            RainArea[i].drag_x = RainArea[i].bg.x;
                            RainArea[i].drag_y = RainArea[i].bg.y;
                        }
                        if (this.pressed) {
                            if (RainArea[i].attachedToMouse) {
                                var seg = new Rectangle(RainArea[i].drag_x,RainArea[i].drag_y,10,10);
                                //seg.draw("red",true,true);
                                var arb_w = RainArea[i].dragLine.x - Mouse.x;
                                var arb_h = RainArea[i].dragLine.y - Mouse.y;
                                RainArea[i].ghostcloud.x = RainArea[i].drag_x - arb_w;
                                RainArea[i].ghostcloud.y = RainArea[i].drag_y - arb_h;
                                //RainArea[i].ghostcloud.draw(1, "red");
                                RainArea[i].cloud.x = -grid.x + RainArea[i].ghostcloud.x;
                                RainArea[i].cloud.y = -grid.y + RainArea[i].ghostcloud.y;
                                //RainArea[i].dragLine.draw(2, "teal");

                                //RainArea[i].cloud.x = RainArea[i].drag_x - RainArea[i].bg.x + Mouse.x;
                                //RainArea[i].y = RainArea[i].drag_y;
                                //RainArea[i].x = RainArea[i].dragLine.x;
                                //RainArea[i].dragLine.vecx = RainArea[i].bg.x - Mouse.x;
                                //RainArea[i].dragLine.vecy = RainArea[i].bg.y - Mouse.y;
                                //RainArea[i].x = Mouse.x;
                                //RainArea[i].y = Mouse.y;
                            }
                        }
                    }
                    else
                        RainArea[i].highlighted = false;
                }

                // Mouse is being currently pressed down
                if (this.pressed) {

                    var moving_rain = RainIsBeingMoved();

                    this.selectionBox.x = this.old_x;
                    this.selectionBox.y = this.old_y;
                    this.selectionBox.width = Mouse.x - this.old_x;
                    this.selectionBox.height = Mouse.y - this.old_y;

                    // Draw selection box
                    window.gfx.setLineDash([4]);
                    window.gfx.lineWidth = 1;
                    //window.gfx.globalCompositeOperation="destination-out";
                    this.selectionBox.draw("#777", false, true);
                    //window.gfx.globalCompositeOperation="normal";
                    window.gfx.setLineDash([]);

                    // See if player was selected
                    if (moving_rain == false) // The rain is being moved right now; disable all other selection functionality; just return
                        if (Player.body.rectInside(this.selectionBox)) {
                            Player.color = "#9a1a8c";
                        } else Player.color = Player.materialColor;

                    // Browse through all objects and see if we're hovering over any of them, if so, delete object...
                    if (moving_rain == false) { // The rain is being moved right now; disable all other selection functionality; just return
                        for (var i=0;i<BoxManager.objects.length;i++) {
                            if (BoxManager.objects[i] != undefined)  {

                                this.tmp.x = grid.x+BoxManager.objects[i].x;
                                this.tmp.y = grid.y+BoxManager.objects[i].y;
                                this.tmp.width = BoxManager.objects[i].bg.width;
                                this.tmp.height = BoxManager.objects[i].bg.height;

                                if (this.tmp.rectInside(this.selectionBox)) {
                                    BoxManager.objects[i].color = "#22a28e";
                                    BoxManager.objects[i].selected = true;
                                } else {
                                    BoxManager.objects[i].color = BoxManager.objects[i].materialColor;
                                    BoxManager.objects[i].selected = false;
                                }
                            }
                        }
                    }
                }

                // Mouse was clicked down
                if (Mouse.leftdown) {

                    // Check if any objects were under the mouse, and if so select them
                    for (var i=0;i<BoxManager.objects.length;i++) {
                        if (BoxManager.objects[i] != undefined) {
                            if (BoxManager.objects[i].bg.pointInside(this.selectionBox.x, this.selectionBox.y)) {

                            }
                        }
                    }

                    this.pressed = true; this.old_x = Mouse.x; this.old_y = Mouse.y; }
                // Mouse was clicked up
                if (window.clicked) {this.pressed = false; StopMovingAllRain(); }
            }

            if (this.currentToolID == this.MOVE_WORLD) { // If hand-grab tool is chosen
                // Update the main grid position
                if (this.pressed) {
                    window.grid.x = this.drag_x + this.line.vecx;
                    window.grid.y = this.drag_y + this.line.vecy;

                    // Adjust rain
                    if (this.hand_dragging) {
                        for (var j = 0; j < RainArea.length; j++) {
                            //RainArea[j].cloud.x = -grid.x + RainArea[j].ghostcloud.x;
                            //RainArea[j].cloud.y = -grid.y + RainArea[j].ghostcloud.y;

                            RainArea[j].ghostcloud.x = grid.x + RainArea[j].cloud.x;
                            RainArea[j].ghostcloud.y = grid.y + RainArea[j].cloud.y;
                        }
                    }

                }
                if (Mouse.leftdown) { // Mouse.leftdown -  Track single-frame "down" click - Remember x & y of click, but only once
                    this.old_x = Mouse.x;
                    this.old_y = Mouse.y;
                    this.drag_x = window.grid.x; // memorize current grid position in the world
                    this.drag_y = window.grid.y;
                    this.pressed = true; // Set "mouse is down" state
                    this.hand_dragging = true;
                }
                if (window.clicked) { // Mouse up - This happens when mouse button is released
                    // Only now reset line coordinates
                    this.line.vecx = 0;
                    this.line.vecy = 0;
                    this.pressed = false; // Reset tool "mouse is down" state
                    this.hand_dragging = false;

                    if(localStorage) {
                        localStorage.worldx = window.grid.x;
                        localStorage.worldy = window.grid.y;
                    }
                }
            }

            // Draw dashboard info
            text("Game World at x=" + window.grid.x + "px, y=" + window.grid.y + "px", 16, 16, "yellow", "left", 11, "verdana");

            // Draw Game Painter version
            text("Game Painter v0.004", game.width/2, 48, "yellow", "center", 14, "arial");

            // Copyright
            text("Game making tool created by Tigris Games", game.width/2, 64, "#777", "center", 14, "arial");
        }

        // Process toolbox keyboard shortcuts
        $(document).on('keydown', function(e) {

            // Delete key -- remove objects
            if (e.which == 46) {
                var index = 0;
                var s = "s";
                for (var i = 0; i < MAX_BOX_NUMBER; i++)
                    if (BoxManager.objects[i] != undefined)
                        if (BoxManager.objects[i].selected)
                            index++;
                if (index == 1) s = "";
                console.log("Deleting " + index + " object" + s + ".");
                for (var i = 0; i < MAX_BOX_NUMBER; i++) {
                    if (BoxManager.objects[i] != undefined) {
                        if (BoxManager.objects[i].selected) {
                            BoxManager.remove(i);
                            i--; // prevent splicer re-indexing
                        } else index++;
                    }
                }
                BoxManager.save();
                return false;
        }});
    }
}