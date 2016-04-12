function Sound(opt_loop) {
  var self_ = this, context_ = null, source_ = null, loop_ = opt_loop || false;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (window.AudioContext) context_ = new window.AudioContext();

  this.load = function(url, mixToMono, opt_callback) {	// mixToMono: true, If the sound should be mixed down to mono
	if (context_) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			context_.decodeAudioData(this.response, function(audioBuffer) {
				self_.sample = audioBuffer;
				opt_callback && opt_callback();
			}, function(e) { console.log(e) });
		}
		xhr.send();
	}
  };

  this.play = function() {
	if (context_) {
		source_ = context_.createBufferSource();
		source_.buffer = self_.sample;
		source_.looping = loop_;
		source_.connect(context_.destination);
		source_.start();
	}
  };

  this.stop = function() {
	if (source_) {
		source_.stop();
		source_.disconnect(0);
	}
  };
}