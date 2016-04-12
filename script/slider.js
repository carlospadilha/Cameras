(function($){
	function slider(el, opts){	// base no url: http://jsfiddle.net/LucP/BPdKR/2/ e o meu: http://jsfiddle.net/kaizen2/ysLL6fo8/6/
		var elem = $(el); if (!elem[0]) return this;
		var	elem0 = elem[0], elemSelector = elem.selector.replace('#', ''),
			isMouseDownScale = false, isMouseDownButton = false,
			startMousePos = 0, lastElemPos = 0, mousePos = 0, elemPos = 0, ultVal = 0,
			tipoM, valorM;

		if (!elem.hasClass('cp-slider')){	// se container não foi criado, crie-o na 1ª vez
			elem.addClass('cp-slider').append('<div class="cp-slider-scale_' + elemSelector + '"><div class="cp-slider-button_' + elemSelector + '"></div></div>');
			elem0.vert = opts.orientation == 'vertical';
			if (!elem.width() && !elem0.vert) elem.css('width' ,(opts.width  + 'px'))	// elemento não possui "width"? defina largura do elemento c/ parâmetro de entrada "width" ou default
			if (!elem.height() && elem0.vert) elem.css('height',(opts.height + 'px'))	// idem para "height"

			var halfButW = elem.find('.cp-slider-button_' + elemSelector).width()  / 2,	// meia largura do botão
				halfButH = elem.find('.cp-slider-button_' + elemSelector).height() / 2,	// meia altura
				halfScaW = elem.find('.cp-slider-scale_'  + elemSelector).width()  / 2,	// meia largura da escala
				halfScaH = elem.find('.cp-slider-scale_'  + elemSelector).height() / 2;	// meia altura
			elem0.inv	 = (opts.range == 'min' && elem0.vert) || (opts.range == 'max' && !elem0.vert);
			elem0.min 	 = opts.min;
			elem0.max 	 = opts.max;
			elem0.compEsc	  = elem0.vert ? elem.height() : elem.width();	// comprimento da escala
			elem0.step 	 	  = opts.step * elem0.compEsc / (elem0.max - elem0.min);
			elem0.halfBut	  = elem0.vert ? halfButH : halfButW;
			elem0.halfTickSca = elem0.vert ? halfScaW : halfScaH;
			elem0.halfTickBut = elem0.vert ? halfButW : halfButH;
			elem0.pos = - elem0.halfBut;	// posição atual do cursor

			var ele1 = document.getElementById(elemSelector),
				ele2 = document.getElementsByClassName('cp-slider-button_' + elemSelector);
			ele1    .addEventListener("touchstart", start1, false); 
			ele1    .addEventListener("mousedown",  start1, false);
			ele2[0] .addEventListener("touchstart", start2, true);
			ele2[0] .addEventListener("mousedown",  start2, true);
			document.addEventListener("touchmove",  move,   true);
			document.addEventListener("mousemove",  move,   true);
			document.addEventListener("touchend",   stop,   true);	//	document.addEventListener("touchcancel", stop, true);
			document.addEventListener("mouseup",    stop,   true);
		};

		var valInv = function(valor){	// se "inv", inverta valor
			return elem0.inv ? (elem0.compEsc - valor - elem0.halfBut * 2) : valor;
		},
		valMinMax = function(x){	// limita valores de x dentro da escala
			x	 = Math.max(-elem0.halfBut, x);
			return Math.min(x, elem0.compEsc - elem0.halfBut);
		},
		posScaBut = function(pos){		// posiciona escala e botão
			elem0.pos = valMinMax(pos);
			var valModStep = (pos - elem0.min) % elem0.step,
				alignValue = pos - valModStep;
			if (Math.abs(valModStep) * 2 >= elem0.step) alignValue += valModStep > 0 ? elem0.step : -elem0.step;
			pos = valMinMax(alignValue);	// pos = parseFloat(alignValue.toFixed(5))

			elem.find('.cp-slider-button_' + elemSelector)
				.css(elem0.vert ? "top" : "left", elem0.inv ? - elem0.halfBut : pos + "px")				// mova o botão ao longo da escala
				.css(elem0.vert ? "left" : "top", elem0.halfTickSca - elem0.halfTickBut - 0.3 + "px")	// posicione centro do botão no centro da escala
			elem.find('.cp-slider-scale_'  + elemSelector)
				.css(elem0.vert ? "height" : "width", Math.abs((elem0.inv ? 1  : 0) - (pos + elem0.halfBut) / elem0.compEsc) * 100 + "%")	// comprimento da escala
				.css(elem0.vert ? "top" : "left", elem0.inv ? (pos + elem0.halfBut) : 0 + "px")			// mova a escala
			return ultVal = valInv(pos);
		},
        getMousePosition = function(e){	// posição absoluta do mouse
			e = e.touches ? e.touches[0] : e;	//	e = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;
			return mousePos = elem0.vert ? e.pageY : e.pageX;
		},
        getElemPosition = function(el){	// posição absoluta do elemento
			return elemPos = (elem0.vert ? el.offset().top : el.offset().left) + elem0.halfBut;
		},
		updatePosition = function(e){	// posição relativa do cursor (botão) na escala
			return posScaBut(lastElemPos + getMousePosition(e) - startMousePos)
		};

		posScaBut(valInv(((opts.value || elem0.min) - elem0.min) * elem0.compEsc / (elem0.max - elem0.min) - elem0.halfBut));	// preenche escala e move cursor (value)

		function start1(e){	//	elem.on('touchstart mousedown', function(e){	// escala e cursor pressionados:
			if (!isMouseDownScale){ // garante um único touchstart ou mousedown
				if (!isMouseDownButton){	// pressionado fora do cursor
					startMousePos = getElemPosition(elem.find('.cp-slider-button_' + elemSelector));
					lastElemPos	  = elem0.pos;
				}
				triggerCall("start", updatePosition(e)) // posicione cursor e callback
			}
			isMouseDownScale = true;
		};	//	});
		function start2(e){	//	elem.find('.cp-slider-button_' + elemSelector).on('touchstart mousedown', function(e){	// cursor pressionado:
			if (!isMouseDownButton){ // garante um único touchstart ou mousedown
				startMousePos = getMousePosition(e);
				lastElemPos   = elem0.pos;	// era lastElemPos = elem0.vert ? ($(this).offset().top - $(this).parent().offset().top) : ($(this).offset().left - $(this).parent().offset().left);
				triggerCall("start", updatePosition(e)) // posicione cursor e callback
			}
			isMouseDownButton = true;
		};	//	});
		function move(e){	//	$(document).on('touchmove mousemove', function(e){	// mouse movendo:		(era touchDev ? 'touchmove' : 'mousemove')
			if (isMouseDownScale || isMouseDownButton) triggerCall("slide", updatePosition(e)) // posicione cursor e callback
		};	//	})
		function stop(e){	//	.on('touchend touchleave touchcancel mouseup', function(e){	// mouse solto:
			if (isMouseDownScale && !isMouseDownButton) startMousePos = getElemPosition(elem.find('.cp-slider-button_' + elemSelector))	// posiçao do cursor
			if (isMouseDownScale && isMouseDownButton)	startMousePos = ultVal;	// posiçao do mouse
			if (isMouseDownScale || isMouseDownButton){
				lastElemPos = elem0.pos;
				triggerCall("stop", ultVal)
				isMouseDownScale = isMouseDownButton = false;
			}
		};	//	})

		function triggerCall(tipo, valor){
			if (tipo == tipoM && valor == valorM) return;	// mesmo valor e tipo, não responda!
			tipoM = tipo; valorM = valor;
			var callback = opts[ tipo ];
			if (callback) callback({
				value: Math.round((valor + elem0.halfBut) * (elem0.max - elem0.min) / elem0.compEsc + elem0.min),
				mousePos: mousePos,
				elemPos: elemPos
			})
		};
	};
//----------------------------------------------------------------------------
	$.fn.CPslider = function(options){
		slider($(this), $.extend({}, $.fn.CPslider.defaults, options))	// $.extend() mistura conteúdo dos objetos {}, $.fn.PPSlider.defaults e options
	}
	$.fn.CPslider.defaults = {
		orientation: 'horizontal',
		width:	150,
		height: 150,
		range:	'min',
		min:	1,
		max:	100,
		step:	1,
	}
})(jQuery);