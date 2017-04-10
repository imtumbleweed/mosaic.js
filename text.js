function text(string, x, y, color, align, size, font) {
	if (align == undefined) align = "left";
	if (size == undefined) size = "14px";
	if (font == undefined) font = "Arial";
	if (color == undefined) color = "gray";
	gfx.textAlign = align;
	gfx.font = size + " " + font;
    gfx.fillStyle = color;
    gfx.fillText(string, x, y);
}
