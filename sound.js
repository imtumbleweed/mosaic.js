var SFX_OW1 = 0;
var SFX_WIND = 1;
window.sfx = new Array(1000);
window.sound = new Array(1000);
var SoundStation = function(filename)
{
	this.that = this;
	this.context = null;
	this.audio = new Audio(filename);
//	this.volumeGain = null;	// currently used only for background music volume
	this.volumeGainContext = null;	// currently used only for background music volume
	this.musicVolume = 1.0;
	var that = this;
	this.play = function(__buffer_ID, repeatSound, contextGain) {
	
		// To turn all sounds off, uncomment this line:
		// return false;
	
		if (window.sfx[__buffer_ID] == undefined)
			return;
		var __buffer = window.sfx[__buffer_ID];
		var source = this.context.createBufferSource();
		  source.buffer = __buffer;



		  //	   tie to gain context so we can control this sound's volume
		  if (contextGain)
		  {
	  		  this.volumeGainContext = this.context.createGain();
			  source.connect(this.volumeGainContext);
			  this.volumeGainContext.connect(this.context.destination);
			  this.volumeGainContext.gain.value = 1.0;
		  } else

		// do regular connect (full volume)

		  source.connect(this.context.destination);
	

		  
		  source.start(0);
		  if (repeatSound)
		  	source.loop = true;
	}
	this.available = false;
	this.Initialize = function() {
		var contextClass = (window.AudioContext || 
		  window.webkitAudioContext || 
		  window.mozAudioContext || 
		  window.oAudioContext || 
		  window.msAudioContext);
		if (contextClass) {
			this.available = true;
			this.context = new contextClass();
            LoadSfx(); 
		} else {
			this.available = false;
		}
	}
	this.onError = function() { console.log("Sound.load('" + filename_url + "')... Failed!"); }
	this.load = function(__buffer_ID, filename_url) {
		var request = new XMLHttpRequest();
		request.open('GET', filename_url, true);
		request.responseType = 'arraybuffer';
		var that_v2 = this.that;
		request.onload = function()  {
		  	that_v2.context.decodeAudioData(request.response, function(theBuffer) {
		    window.sfx[__buffer_ID] = theBuffer;
		  	// Create global sound object
		  	var sfxname = "sfx" +  filename_url.match(/([^\/]+)(?=\.\w+$)/)[0];
		  	window[sfxname] = new Object();
			window[sfxname].play = () => { Sound.play(__buffer_ID); }
		    console.log("Sound.load('mp3')...[window." + sfxname + "] Ok!");

			// if (filename_url == "http://www.learnjquery.org/games/gem/sfx/delune.mp3")
			// window.soundtrackReady = true;
		  }, this.onError);
		}
		request.send();
	}
}

window.collectibleCurrentSfx = 1;
function LoadSfx() {
	console.log("LoadSfx()...");
	Sound.load(0, "sfx/coin.mp3");
	Sound.load(1, "sfx/coin1.mp3");
	Sound.load(2, "sfx/coin2.mp3");
	Sound.load(3, "sfx/coin3.mp3");
	Sound.load(4, "sfx/coin4.mp3");
	Sound.load(5, "sfx/coin5.mp3");
	Sound.load(6, "sfx/coin6.mp3");
	Sound.load(7, "sfx/coin7.mp3");
	Sound.load(8, "sfx/bubble.mp3");
	Sound.load(9, "sfx/click1.mp3");
	Sound.load(10, "sfx/click2.mp3");

	// Sound.load(8, "http://www.learnjquery.org/games/gem/sfx/delune.mp3");

}

var Sound = new SoundStation();