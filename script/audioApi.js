//https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
(function($){
  function ctxCreate(){
	try{ return new (window.AudioContext || window.webkitAudioContext)() }
	catch(e){ cp.msgErr("Browser não suporta audio API"); return null }
  }

  function apend_i(elem){
	var i = elem.children[0];
	if (!i){
		i = document.createElement('i');
		$(elem).append(i);
	}
	if (!i.e){
		i.e = { audioCtx: ctxCreate() };					//			source
		i.e.source	 = i.e.audioCtx.createMediaElementSource(elem);
		i.e.gainNode = i.e.audioCtx.createGain();			//			gainNode
		i.e.source.connect(i.e.gainNode);					//			source ===> gainNode
	}
	if (!i.e.an){
		var an = i.e.an = {
			analyser: i.e.audioCtx.createAnalyser(),		//			analyser
			drawLoop: 0, noise: false
		}
		an.analyser.maxDecibels = -10;
	//	an.analyser.smoothingTimeConstant = 0.85; // [0.8](0-1)
		i.e.gainNode.connect(an.analyser);
		an.analyser.connect(i.e.audioCtx.destination);		//			gainNode ===> analyser ===> speakers (inicial)
	}
	// https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
	if (!i.e.eq){
		var eq = i.e.eq = {
			lowFilter:	i.e.audioCtx.createBiquadFilter(),	//			lowFilter
			higFilter:	i.e.audioCtx.createBiquadFilter()	//			higFilter
		};
		// filters setup
		eq.lowFilter.type			 = "lowshelf";
		eq.lowFilter.frequency.value = 450.0;
		eq.lowFilter.gain.value 	 = 8.0;
		eq.higFilter.type			 = "highshelf";
		eq.higFilter.frequency.value = 4500.0;
		eq.higFilter.gain.value 	 = 13.0;
		i.e.gainNode.connect(eq.lowFilter);					//			gainNode ===> lowFilter
		i.e.gainNode.connect(eq.higFilter);					//			gainNode ===> higFilter
	}
	if (!i.e.co){
		var co = i.e.co = {
			compressor: i.e.audioCtx.createDynamicsCompressor(),// 		compressor
		}
		// compressor setup
		co.compressor.threshold.value = -35;	// -50
		co.compressor.knee.value	  = 40;		// joelho suave
		co.compressor.ratio.value	  = 10;		// 12
		co.compressor.reduction.value = -20;	// -20
		co.compressor.attack.value	  = 0;
		co.compressor.release.value   = 0.25;	// secs
		co.compressor.connect(i.e.gainNode);				//			compressor ===> gainNode
	}
	//
	if (!i.e.os){
		var o = i.e.os = {
			oscillator: i.e.audioCtx.createOscillator()		//			oscillator
		}
		// oscillator setup
		o.oscillator.type			 = "sine";
		o.oscillator.frequency.value = 200;	// freq. inicial
		o.oscillator.detune.value	 = 100; // value in cents
		o.oscillator.onended = function() { console.log( "oscilador OFF!" ) }
		o.curX = 0; o.curY = 0;
		o.oscillator.connect(i.e.an.analyser);					//			oscillator ===> analyser (===> speakers)
	}
	return i;
  }
  
//------------------ oscilador
  $.fn.oscillator = function(enable){
	var i = apend_i(this[0]), o = i.e.os, WIDTH = window.innerWidth, HEIGHT = window.innerHeight, maxFreq = 7000, maxVol = 0.02;
	i.e.gainNode.gain.value = 0.001;		// initial vol.

	if (enable)   o.oscillator.start(1)	// inicia em 1 segundo
	else		{ o.oscillator.stop(); i.e.os = null; return };

	document.onmousemove = updatePage;			// Get new mouse pointer coordinates when mouse is moved, then set new gain and pitch values
	function updatePage(ev) {
		o.curX = (window.Event) ? ev.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		o.curY = (window.Event) ? ev.pageY : event.clientY + (document.documentElement.scrollTop  ? document.documentElement.scrollTop  : document.body.scrollTop);
		o.oscillator.frequency.value =	o.curX / WIDTH  * maxFreq;
		i.e.gainNode.gain.value	 =		o.curY / HEIGHT * maxVol;
	}
	return this
  }
//------------------ ruido branco
  $.fn.whiteNoise = function(sec){
	var i = apend_i(this[0]), wn = i.e.wn;

	if (wn) wn.audioCtx.close();					// se context já criado, destrua-o e recrie-o
	wn = { audioCtx: ctxCreate() };					// Get an AudioBufferSourceNode. This is the AudioNode to use when we want to play an AudioBuffer
	wn.source = wn.audioCtx.createBufferSource();
	wn.frameCount = wn.audioCtx.sampleRate * sec;	// Create an empty x seconds stereo buffer at the sample rate of the AudioContext
	wn.myArrayBuffer = wn.audioCtx.createBuffer(2/*channels*/, wn.frameCount, wn.audioCtx.sampleRate);
	wn.source.buffer = wn.myArrayBuffer;			// set the buffer in the AudioBufferSourceNode
	wn.source.connect(wn.audioCtx.destination);		// connect the AudioBufferSourceNode to the destination so we can hear the sound

	for (var channel = 0; channel < 2/*channels*/; channel++){
		var nowBuffering = wn.myArrayBuffer.getChannelData(channel);						// This gives us the actual array that contains the data
		for (var j = 0; j < wn.frameCount; j++) nowBuffering[j] = Math.random() * 2 - 1;	// audio needs to be in [-1.0; 1.0]
	}
	wn.source.start();	// start the source playing
	return this
  }
//------------------ volume do elemento
  $.fn.audioVol = function(vol){
	for (var k = 0; k < this.length; k++){	// aplique em todos os elementos ("#audDir0", "#audDir1", ...)
		var i = apend_i(this[k]);
		i.e.source.connect(i.e.gainNode); i.e.gainNode.connect(i.e.audioCtx.destination);	// connect the AudioBufferSourceNode to the destination
		var a = i.e.gainNode.gain.value;
		i.e.gainNode.gain.value = vol;
	}
	return this
  };
//------------------ fade in/out do elemento
  var fadeInTime, fadeOutTime;
  $.fn.audFade = function(modo, time){
	var waapi = false;
	if (waapi){
		var i = apend_i(this[0]);
		i.e.source.connect(i.e.gainNode); i.e.gainNode.connect(i.e.audioCtx.destination);	// source ===> gainNode ===> speakers
	}
	var elem = this[0], fadeFrac = (waapi ? 100 : cam.locVol) / time; if (!elem) { cp.msgErr('$("' + this.selector + '").audFade não encontrado !'); return this };

	if (waapi)
		if (modo == "out")	{ fadeOut(i) }
		else				{ i.e.gainNode.gain.value = 0; fadeIn(i) }
	else
		if (modo == "out")	{ elem.volume = cam.locVol / 100; fadeOut() }
		else				{ elem.volume = 0				; fadeIn () };

	return this;

	function fadeOut(i){
		if (!waapi){
			kd.volEnable = false;
			if ($(elem).attr("src") == "#") return;
			if (elem.volume > fadeFrac) { elem.volume -= fadeFrac; clearTimeout(fadeOutTime); fadeOutTime = setTimeout(fadeOut, 100) }
			else { elem.volume = 0; elem.pause(); kd.volEnable = true }
		}else{
			if ($(elem).attr("src") == "#") return;
			if (i.e.gainNode.gain.value > fadeFrac ) { i.e.gainNode.gain.value -= fadeFrac; clearTimeout(fadeOutTime); fadeOutTime = setTimeout(fadeOut, 100, i) }
			else { i.e.gainNode.gain.value = 0; elem.pause() }
		}
	}
	function fadeIn(i){
		if (!waapi){
			kd.volEnable = false;
			if (elem.volume <= (cam.locVol / 100 - fadeFrac)) { elem.volume += fadeFrac; clearTimeout(fadeInTime); fadeInTime = setTimeout(fadeIn, 100) }
			else { elem.volume = cam.locVol / 100; kd.volEnable = true }
		}else{
			if (i.e.gainNode.gain.value <= 1 ) { i.e.gainNode.gain.value += fadeFrac; clearTimeout(fadeInTime); fadeInTime = setTimeout(fadeIn, 100, i) }
			else i.e.gainNode.gain.value = 1;
		}
	}
  };
//------------------ mp3 info
  $.fn.audMp3 = function(res){
	false && $("#audDir0").whiteNoise(2);

/*	var audioCtx = ctxCreate();
	audioCtx.decodeAudioData(res, function(buffer){
		var sampleRate	= buffer.sampleRate;
		var lenght		= buffer.length;
		var channels	= buffer.numberOfChannels; 
	});*/
  };
//------------------ mp3 analisador expectro
  var drawLoop;
  $.fn.analyser = function(barras){	// barras:	true ==> gráfico de barras		false ==> gráfico sinuwave
	var elem = this[0], i0 = apend_i(C$("#audDir0")), an0 = i0.e.an, i1 = apend_i(C$("#audDir1")), an1 = i1.e.an;	// presseta analyser p/ os dois audios: audDir0(an0) e audDir1(an1)
	an0.analyser.fftSize = barras ? 128 : 2048; an0.bufferLength = an0.analyser.frequencyBinCount;
	an0.dataArray = new Uint8Array(an0.bufferLength); an1.dataArray = new Uint8Array(an0.bufferLength);
	var canvas = C$("#analyser"), canvasCtx = canvas.getContext('2d'), WIDTH = canvas.width, HEIGHT = canvas.height;	// canvas setup

	function draw() {
		drawLoop = requestAnimationFrame(draw);

		canvasCtx.fillStyle = 'rgb(0, 0, 0)';	// fundo
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		mainPag && $(canvas).show();

		if (barras){
			var barWidth = (WIDTH / an0.bufferLength) * 2.5, barHeight, x = 0, noise = false;
			an0.analyser.getByteFrequencyData(an0.dataArray); an1.analyser.getByteFrequencyData(an1.dataArray)
			for (var j = 0; j < an0.bufferLength; j++){
				var data = Math.max(an0.dataArray[j], an1.dataArray[j]); if (data > 0) noise = true; barHeight = Math.round(data / 1.3);
				canvasCtx.fillStyle = 'rgb(0,' + (255 - data) + ',' + data + ')';
				canvasCtx.fillRect( x, HEIGHT - (data * HEIGHT / 255), barWidth, HEIGHT );
				x += barWidth + 1;
			}
		}else{
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = 'rgb(250, 0, 0)';	// linha vermelha
			canvasCtx.beginPath();

			var sliceWidth = WIDTH * 1.0 / an0.bufferLength, x = 0, noise = false;
			an0.analyser.getByteTimeDomainData(an0.dataArray); an1.analyser.getByteTimeDomainData(an1.dataArray)
			for (var j = 0; j < an0.bufferLength; j++){
				var data = an0.dataArray[j] == 128 ? an1.dataArray[j] : an0.dataArray[j], y = data / 256 * HEIGHT;	// y = data div 128 * HEIGHT div 2
				if (data != 128) noise = true;
				j === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
				x += sliceWidth;
			}
			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
		}
		if (!noise && $(elem).attr("src") == "#"){
			window.cancelAnimationFrame(drawLoop);								// audio atual terminou, encerra loop
			if ($("#audDir0, #audDir1").attr("src") == "#") $(canvas).hide()	// os dois audios terminaram, esconda analyzer
		};
	};
	window.cancelAnimationFrame(drawLoop); draw();
  };
//------------------ equalizador
  $.fn.loudness = function(enable){
	for (var k = 0; k < this.length; k++){	// aplique em todos os elementos ("#audDir0", "#audDir1", ...)
		var i = apend_i(this[k]), eq = i.e.eq;

		if (enable) { i.e.gainNode.disconnect(i.e.an.analyser); eq.lowFilter.connect   (i.e.an.analyser); eq.higFilter.connect   (i.e.an.analyser); i.e.gainNode.gain.value = 0.30 }	// Loud ON diminui vol global para evitar saturação
		else		{ i.e.gainNode.connect   (i.e.an.analyser); eq.lowFilter.disconnect(i.e.an.analyser); eq.higFilter.disconnect(i.e.an.analyser); i.e.gainNode.gain.value = 1.00 };
	}			//	Loud OFF:	source ===> gainNode(1.0) ===> lowFilter =X=> analyser (===> speaker)	Loud ON:	source ===> gainNode(0.3) ===> lowFilter ===> analyser (===> speaker)
	return this	//							gainNode(1.0) ===> higFilter =X=> analyser (===> speaker)							gainNode(0.3) ===> higFilter ===> analyser (===> speaker)
  }				//							gainNode					 ===> analyser (===> speaker)							gainNode					 =X=> analyser (===> speaker)
//------------------ compressor
  $.fn.compressor = function(enable){
	for (var k = 0; k < this.length; k++){	// aplique em todos os elementos ("#audDir0", "#audDir1", ...)
		var i = apend_i(this[k]);

		if (enable)  { i.e.source.connect	(i.e.co.compressor); i.e.source.disconnect(i.e.gainNode) }
		else		 { i.e.source.disconnect(i.e.co.compressor); i.e.source.connect   (i.e.gainNode) };
	}			//	Comp OFF:	source =X=> compressor ===> gainNode ===> ...	Comp ON:	source ===> compressor ===> gainNode ===> ...
	return this	//				source ===>					gainNode ===> ...				source =X=>					gainNode ===> ...
  }
})(jQuery);