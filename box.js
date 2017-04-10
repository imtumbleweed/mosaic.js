const BOX_TYPE_RECT = 0;
const BOX_TYPE_LEFTSLOPE = 1;
const BOX_TYPE_RIGHTSLOPE = 2;
const BOX_TYPE_BOTTOM_LEFTSLOPE = 3;
const BOX_TYPE_BOTTOM_RIGHTSLOPE = 4;
const BOX_TYPE_COLLECTIBLE = 5;
const MAX_BOX_NUMBER = 256000;
var GlobalObjectIdentifier = 0;
class Box {
    constructor(x,y,w,h,type) {

        // Basic parameters
        this.identifier = GlobalObjectIdentifier++;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        if (type == undefined)
            this.type = BOX_TYPE_RECT;
        else
            this.type = type;

        // Assets
        this.bg = new Rectangle(x,y,w,h);
        this.line = new Segment(0,0,10,10);
        this.otherline = new Segment(0,0,10,10);
        this.triangle = new Triangle();

        // Materials
        this.materialColor = "#222";
        this.color = this.materialColor;

        this.selected = false;

        // Convert shape to a type
        this.convert = (type) => {
            // todo: check if the type is allowed / exists
            this.type = type;

            if (this.type == BOX_TYPE_LEFTSLOPE) {
                this.triangle.A.x = (this.x + this.width);
                this.triangle.A.y = (this.y);
                this.triangle.A.vecx = (this.x - (this.x + this.width));
                this.triangle.A.vecy = ((this.y + this.height) - this.y);
                this.triangle.B.x = this.triangle.A.x + this.triangle.A.vecx;
                this.triangle.B.y = this.triangle.A.y + this.triangle.A.vecy;
                this.triangle.B.vecx = this.width;
                this.triangle.B.vecy = 0;
                this.triangle.C.x = this.triangle.B.x + this.triangle.B.vecx;
                this.triangle.C.y = this.triangle.B.y + this.triangle.B.vecy;
                this.triangle.C.vecx = 0;
                this.triangle.C.vecy =  - this.height;
            }
            if (this.type == BOX_TYPE_RIGHTSLOPE) {
                this.triangle.A.x = this.x;
                this.triangle.A.y = this.y;
                this.triangle.A.vecx = this.width;
                this.triangle.A.vecy = this.height;
                this.triangle.B.x =  this.triangle.A.x + this.width;
                this.triangle.B.y =  this.triangle.A.y + this.height;
                this.triangle.B.vecx = -this.width;
                this.triangle.B.vecy = 0;
                this.triangle.C.x = this.triangle.B.x + this.triangle.B.vecx;
                this.triangle.C.y = this.triangle.B.y + this.triangle.B.vecy;
                this.triangle.C.vecx = 0;
                this.triangle.C.vecy = -this.height;
            }
            if (this.type == BOX_TYPE_COLLECTIBLE) {
                this.color = "yellow";
            }

            // resave level data
            BoxManager.save();
        }

        this.draw = function() {

            if (this.type == BOX_TYPE_RECT) {
                this.line.x             = this.x;
                this.line.y             = this.y;
                this.line.vecx          = this.width;
                this.line.vecy          = this.height;
                this.otherline.x        = this.x + this.width;
                this.otherline.y        = this.y;
                this.otherline.vecx     = -this.width;
                this.otherline.vecy     = this.height;
                this.bg.x               = this.x;
                this.bg.y               = this.y;
                this.bg.width           = this.width;
                this.bg.height          = this.height;

                // draw as rectangle
                this.bg.drawAt(grid.x, grid.y, this.color, true, false);
                this.line.drawAt(grid.x, grid.y, 1, "#333");
                this.otherline.drawAt(grid.x, grid.y, 1, "#333");
            }

            if (this.type == BOX_TYPE_LEFTSLOPE) {
                this.triangle.draw();
            }

            if (this.type == BOX_TYPE_RIGHTSLOPE) {
                this.triangle.draw();
            }

            if (this.type == BOX_TYPE_COLLECTIBLE) {
                this.line.x             = this.x;
                this.line.y             = this.y;
                this.line.vecx          = this.width;
                this.line.vecy          = this.height;
                this.otherline.x        = this.x + this.width;
                this.otherline.y        = this.y;
                this.otherline.vecx     = -this.width;
                this.otherline.vecy     = this.height;
                this.bg.x               = this.x;
                this.bg.y               = this.y;
                this.bg.width           = this.width;
                this.bg.height          = this.height;
                this.bg.drawAt(grid.x, grid.y, this.color, true, false);
                this.line.drawAt(grid.x, grid.y, 1, "#333");
                this.otherline.drawAt(grid.x, grid.y, 1, "#333");
            }
        };
    }
}

class BoxManagerClass {
    constructor() {
        this.objects = new Array();
        //this.lastObjectID = 0;
        this.objectsLoaded = false;
        //var objects = new Array(MAX_BOX_NUMBER);
        //for (var i = 0; i < MAX_BOX_NUMBER; i++) objects[i] = new Box(0,0,0,0);
        this.load = () => { // Load boxes
            console.log("BoxManager.load();");
            $.ajax({url:"objects.txt", type:"post", success: function(msg) {
                //console.log("objects.txt = " + msg);
                var objs = JSON.parse(msg);
                console.log("objects loaded = " + obj.length);
                for (var i = 0; i < objs.length; i++) {
                    BoxManager.objects[i] = new Box(objs[i].x,objs[i].y,objs[i].width,objs[i].height);
                    BoxManager.objects[i].convert(objs[i].type);

                }
                console.log(BoxManager.objects.length + " object(s) loaded.");
                //console.log(this.objects);
                //console.log(this.objects.length);
                BoxManager.objectsLoaded = true;

                // Load player location, only after all boxes have been loaded;
                // Otherwise the player will fall through without collision detection
                Player.load();

            }});
        };
        this.save = () => {// Save boxes
            console.log("BoxManager.save();");
            //console.log("saving...");
            //console.log(JSON.stringify());
            //console.log(this.objects);
            $.ajax({url:"saveboxes.php", type : "post", data:{"payload":JSON.stringify(this.objects)}, success: function(msg) {
                //console.log("saveboxes.php = " + msg);
            }});
        };
        // Add new box
        this.add = (x,y,w,h) => {
            this.objects[this.objects.length] = new Box(-grid.x+x,-grid.y+y,w,h);
            this.save(); // Save all boxes
        };

        // Delete (remove) this box
        this.remove = (id) => {
            if (id > -1)
                this.objects.splice(id,1);
        };

        // Draw the box
        this.draw = () => {
            //console.log(this.objects.length);
            for (var i=0;i<this.objects.length;i++)
                this.objects[i].draw();
        };
    }
}

var BoxManager = new BoxManagerClass();