function i2xy(index, mapWidth)
{
    var x = index % mapWidth;
    var y = Math.floor(index/mapWidth);
    return [x, y];
}

function xy2i(x, y, mapWidth)
{
    return y * mapWidth + x;
}

function DisableScrollbars()
{
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
}

function ResetAnimation()
{

}