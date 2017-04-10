class TimelinePanel {

    constructor(x, y, width, height) {
        this.panelOffset = 200;
        this.area = new Rectangle(x, $(window).height()-height, width, height);
        this.timepanel = new Rectangle(x + this.panelOffset, $(window).height()-height+32, width, 150);
        this.active = false;
        this.length = 0;                // Length of active animation

        this.process = () => {
            if (window.clicked) {
                if (this.area.pointInside(Mouse.x, Mouse.y))
                    this.active = true;
                else
                    this.active = false;
            }
        }
        this.draw = () => {
            this.area.draw("#262626", true, false);

            // Draw time panel
            this.timepanel.draw("#212121", true, false);

            if (this.active)
                this.area.draw("#3399cc", false, true);

            for (var i = 0; i < 50; i++) {
                var x = this.panelOffset + i * 75;
                var h = 17;
                //if (game.resourcesLoaded)
                if (typeof timespacing !== "undefined")
                    Context.context.drawImage(timespacing.image, x, this.area.y + 15, 75, h);
            }


        }
    }
};