var AO = function(i) {
    this.counter = i;
}

var Animate = function(animationDelay, animationIndexCounter, animationCurrentFrame)
{
    this.animationDelay = animationDelay;
    this.animationIndexCounter = animationIndexCounter;
    this.animationCurrentFrame = animationCurrentFrame;
};

window.AnimationCounterIndex = 0;
var AnimationCounter = new Array();

function InitializeAnimationCounters()
{
    for (var i = 0; i < 32000; i++)
        AnimationCounter[i] = new Animate(-1, 0, 0);
}

function ResetAnimationCounter()
{
    window.AnimationCounterIndex = 0;
}

function ProgressAnimationCounter(prog_amount)
{
    window.AnimationCounterIndex += prog_amount;
}