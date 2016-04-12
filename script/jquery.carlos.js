(function($){
    var isiOS = /(ipad|iphone)/g.test(navigator.userAgent.toLowerCase()) ? true : false, getPointerEvent = function(event){ return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event };

// $(elem).tap(function({path, name}){}), single touch
	$.fn.tap  = function(callback){ setTap(this, "tap",		callback); return this }	// possibilita adicionar outras funções, por exemplo .show() ==>   $(elem).tap(...).show()
// $(elem).dbtap(function({path, name}){}), double touch
	$.fn.dbtap= function(callback){ setTap(this, "dbltap",	callback); return this }
// $(elem).dtap(function(pointer){}),	drag tap (igual a .tap, exceto callback(pointer))
	$.fn.dtap = function(callback){ setTap(this, "dragtap", callback); return this }
// $(elem).htap(function(pointer){}),	tap hold
	$.fn.htap = function(callback){ setTap(this, "holdtap", callback); return this }
// $(elem).drgl(function(pointer){}),	drag left
	$.fn.drgl = function(callback){ setTap(this, "left",	callback); return this }
// $(elem).drgr(function(pointer){}),	drag right
	$.fn.drgr = function(callback){ setTap(this, "right",	callback); return this }
// $(elem).drgu(function(pointer){}),	drag up
	$.fn.drgu = function(callback){ setTap(this, "up",		callback); return this }
// $(elem).drgd(function(pointer){}),	drag down
	$.fn.drgd = function(callback){ setTap(this, "down",	callback); return this }
// $(elem).drot(function(pointer){}),	drag rotate
	$.fn.drot = function(callback){ setTap(this, "rotate",	callback); return this }
// $(elem).rel(function(pointer){}),	touch release
	$.fn.rel =  function(callback){ setTap(this, "release", callback); return this }
	// elem: elemento;	func: functions;	callback: path
	function setTap(elem, func, callback){
		var currX = 0, currY = 0, prevX = 0, prevY = 0, touchStarted = false, tapTimer, /*numTmr,*/ tapNum = 0, oneFinger = true, gap = 50,
			movLeft, movRight, movDown, movUp;
		elem
		.on(touchDev ? 'touchstart' : 'mousedown', function(e){
			movLeft = movRight = movDown = movUp = false;
			oneFinger = (touchDev ? e.originalEvent.touches.length : 1) == 1;
			var pointer = getPointerEvent(e);
			prevX = pointer.pageX;
			prevY = pointer.pageY;
			touchStarted = true;
			tapNum++;
			clearTimeout(tapTimer); tapTimer = setTimeout(function(){	// tempo máx. de toque único: 290ms
				if (!movLeft && !movRight && !movDown && !movUp){
					// tap, dbltap ou drgtap:
					if (!touchStarted){
						if ((tapNum == 1 && (func == "tap")) || (tapNum == 2 && (func == "dbltap"))){
							if (chromeApp) { som.clic_.stop(); som.clic_.play() }
							else som.clic();

							var liElemClicked = $(e.target).closest('li')[0], liElms = $(elem)[0].childNodes;
							if (liElemClicked) for (i = 0; i < liElms.length; i++) { if (liElemClicked == liElms[i]) break }	// i = posição do liElemClicked

							callback({ path: "" || e.target.title, name: e.target.name, lang: e.target.lang, index: liElemClicked ? i : null, node: e.target.nodeName });
						}
						if  (tapNum == 1 && (func == "dragtap")) callback(pointer);
					};
					// tap hold:
					if (touchStarted){
						if (tapNum==1 && (func == "holdtap")) callback(pointer)
						touchStarted = false;
					}
				}
				tapNum = 0
			}, 290);
		//	clearTimeout(numTmr); numTmr = setTimeout(function(){tapNum = 0}, 300)	// após 300ms reset contador de toques
		})
		.on('touchend mouseup touchcancel', function(){
			touchStarted = false;
			if (func == "release") callback("r");
		})
		.on(touchDev ? 'touchmove' : 'mousemove', function(e){
			var pointer = getPointerEvent(e), deltaX, deltaY;
			if (Math.abs(deltaX = prevX - pointer.pageX) > Math.abs(deltaY = prevY - pointer.pageY)){	// movimento principal horiz. ou vert.?
				movLeft  = deltaX > gap;
				movRight = deltaX < -gap;
				if (oneFinger && touchStarted){
					if ((func == "left")  && movLeft)  dragOn();
					if ((func == "right") && movRight) dragOn()
				}
			}else{
				movUp	 = deltaY > gap;
				movDown  = deltaY < -gap;
				if (oneFinger && touchStarted){
					if ((func == "up")	 && movUp)	 dragOn();
					if ((func == "down") && movDown) dragOn();
				}
			}
			if (!oneFinger && touchStarted && (func == "rotate")) dragOn();

			function dragOn() {touchStarted = false; callback(pointer); return}
		})
	}
/*	// imag-path to file-path
	function extractImgPath(path){
		return decodeURIComponent(decodeURI(path.substr(path.lastIndexOf('image/') + 14).replace('-poster.jpg', '.mkv')))
	}*/
//----------------------------------------------------------------------------
// $(elem).blockList(),	bloqueia limites das listas para evitar scroll de tela
	$.fn.blockList = function(){
		this
		.on('touchstart', function(e){
			e.stopPropagation();
			var t = getPointerEvent(e);
			this.ts_x = t.pageX;
			this.ts_y = t.pageY;
			this.endY = this.scrollHeight - this.clientHeight;	// pos. Y de fim de lista
			this.endX = this.scrollWidth  - this.clientWidth	// pos. X de fim de lista
		})
		.on('touchmove', function(e){	// permite scroll das listas com classe "scrollable"
			e.stopPropagation();
			var t = getPointerEvent(e),
			td_x  = t.pageX - this.ts_x, // desloc. na hor.
			td_y  = t.pageY - this.ts_y; // desloc. na ver.
			if (Math.abs(td_x) < Math.abs(td_y)){	// mov. princ. vertical
				lstY = this.scrollTop;
				if (td_y<0){ if (lstY == this.endY)	e.preventDefault() }	// p/cima, se atingiu fim da lista, bloqueie
				else	   { if (lstY < 1)			e.preventDefault() }	// p/baixo, se atingiu início da lista, bloqueie
			}else{			 if (!this.endX)		e.preventDefault() }	// mov. princ. horiz, se lista horizontal sem scroll, bloqueie
		})
	}

	// solução do link: http://stackoverflow.com/questions/16889447/prevent-full-page-scrolling-ios
/*		this
		.on('touchstart', function(e) {
			this.allowUp = (this.scrollTop > 0);
			this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight);
			this.prevTop = null;
			this.prevBot = null;
			this.lastY = e.originalEvent.pageY;
		})
		.on('touchmove', function(e) {
			var event = e.originalEvent;
			var up = (event.pageY > this.lastY), down = !up;
			this.lastY = event.pageY;
	
			if ((up && this.allowUp) || (down && this.allowDown))
				event.stopPropagation();
			else
				event.preventDefault();
		})*/
//----------------------------------------------------------------------------
// $(elem).texto(texto), o mesmo que cp.setjoin(elem, texto), se texto=1 adiciona classe ".on', se =0 remove
	$.fn.texto = function(texto){
		for (var k = 0; k < this.length; k++){	// para todos os elementos ... de $(..., ..., ...).texto()
			var elem = $(this[k]);

			if (texto === 1)			elem.addClass('on')
			else
				if (texto === 0) 		elem.removeClass('on')
				else
					if (texto === "") 	elem.text("")
					else
						if (texto)		elem.text(texto)
						else
							return		elem.hasClass('on');
		}
		return this
	}
//----------------------------------------------------------------------------
// $(elem).div([id1, class1, left1, top1, inner text1, id2,...]), cria elementos "<div...>"
	$.fn.div = function(itens){
		var elem = this[0], i = 0;
		/*elem.innerHTML = "";*/
		while (i < itens.length){
			var divArray = [], j = 0;
			while (j < 5) divArray[j++] = itens[i++];
			try{ elem.innerHTML += criaDiv(divArray) }catch(e){
				var a = e	// debug
			}
		}
		function criaDiv(x){	// cria elemento "<div>"
			var id= x[0] ? ' id="'		+ x[0] + '"' : '',
				c = x[1] ? ' class="'	+ x[1] + '"' : '',
				l = x[2] ? 'left:'		+ x[2] + 'px' : '',
				t = x[3] ? ';top:'		+ x[3] + 'px' : '',
				tx= x[4] ? x[4] : '';
			return '<div' + id + c + (l || t ? ' style="' + l + t + '"' : '') + '>' + (tx instanceof Array ? criaDiv(tx) : tx) + '</div>'
		}
		return this
	}
//----------------------------------------------------------------------------
// $(elem).img([id1, src1, class1, left1, top1, width1, height1, id2,...]), cria elementos "<img...>"
	$.fn.img = function(itens){
		var elem = this[0], i = 0, aux = elem.innerHTML;
		elem.innerHTML = "";
		while (i < itens.length){
			var img = [], j = 0;
			while (j < 7) img[j++] = itens[i++];
			elem.innerHTML += criaImg(img)
		}
		elem.innerHTML += aux;
		function criaImg(x){	// cria elemento "<img>"
			var id=x[0] ? ' id="'	+ x[0] + '"':'',
				s =x[1] ? ' src="'	+ x[1] + '"':'',
				c =x[2] ? ' class="'+ x[2] + '"':'',
				l =x[3] ? 'left:'	+ x[3] + 'px':'',
				t =x[4] ? ';top:'	+ x[4] + 'px':'',
				w =x[5] ? ';width:' + x[5] + 'px':'',
				h =x[6] ? ';height:'+ x[6] + 'px':'';
			return '<img' + id + s + c + (l || t || w || h ? ' style="' + l + t + w + h + '"' : '') + ' alt="">'
		}
		return this
	}
//----------------------------------------------------------------------------
// $(elem).sty([left,top,width,height])	ou	$().sty([id1,left1,top1,width1,height1,id2...])
	$.fn.sty = function(itens){
		var elem = this;
		if (elem.selector){
			setSty(elem[0], -1)
		}else{
			var i = -1;
			while (i < itens.length - 1){
				var res = [], id = itens[++i]; if (typeof id !== 'string'){alert('erro em $().sty'); return}
				id = (id.substr(0,1) == '.' ? '' : '#') + id
				res = Array.prototype.slice.call(document.querySelectorAll(id));	// todas as ocorrências do id
				setSty(res[0], i)
				res.forEach(function(resIdx){	//	var j = 1; while (j < res.length) setSty(res[j++], i)
					setSty(resIdx, i)
				})
				i += 4;
			}
		}
		function setSty(el, n){
			if (el){
				el = el.style;
				var und;	// undefined
				if (itens[++n] != und) el.left	= itens[n] + 'px';			
				if (itens[++n] != und) el.top	= itens[n] + 'px';
				if (itens[++n] != und) el.width  = itens[n] + 'px';
				if (itens[++n] != und) el.height = itens[n] + 'px';
			}else
				cp.msgErr('$("' + id + '").sty: elemento não existe')
		}
		return elem
	}
//----------------------------------------------------------------------------
// $(elem).btn(function(){...}) botão (elem) acionado execute comandos		ou		$(elem).bts('...') botão (elem) acionado execute comandos e forma de string (eval)
	$.fn.btn = function(cmd){
		var elem = this;
		if (elem[0]){	// elemento existe?
			elem
			.tap(function(){	// single touch
			//	som.clic();
				typeof cmd == 'string' ? eval(cmd)/*(Function(cmd))()*/ : cmd(elem);
			})
			// resolve o problema do hover no iPad. CSS's devem ser mudados de :hover para .hover:
			.mouseenter(function(){ elem.addClass('hover') })
			.mouseleave(function(){ elem.removeClass('hover') })
			.click(		function(){ elem.removeClass('hover') })
			.find('a').slice(0, 1).click(function(){ elem.removeClass('hover') })	// p/caso de listas <ul><li><a...>
		}else 
			cp.msgErr('$("' + elem.selector + '").btn não encontrado !')
		return elem
	}

// o mesmo que $(elem).btn(function(){ elem.texto(1); cmd; })
	$.fn.btx = function(cmd){
		var elem = this;
		elem.btn(function(){
			elem.texto(1);	// mantém botão ativo (aceso)
			cmd();
		})
		return elem
	}
//----------------------------------------------------------------------------
// $(#elem).lstItemSel(path, imgItem),	highlight linha ativa da lista	onde: elem é id (sem #) da lista pesquisada, path é o item a ser pesquisado, imgItem define 1a ou 2a. imagem
	$.fn.lstItemSel = function(path, imgItem){
		var elem = this;
		$$('#' + this.selector + ' li').each(function(){
			var itemPath = $(this).find('img').slice(imgItem).attr('title');	// path do item da lista
			if (path && itemPath){
				if (itemPath == /*cp.bar1to2(*/path.substr(0, itemPath.length)/*)*/) setStyle($(this), true)	// se igual ao path pesquisado, adiciona estilo
				else								  								 setStyle($(this), false)	// remove-o
			}else setStyle($(this), false)
			
		})
		function setStyle(elem, status){
			elem = elem[0].style;
			elem.border = status ? '1px solid #5AF' : '';				// borda azul claro
			elem.borderRadius = status ? '4px' : '';					// raio da borda
			elem.backgroundColor = status ? 'rgba(34,85,136,0.7)' : '';	// fundo azul marinho com transparência 30%
		}
		return elem
	}
//----------------------------------------------------------------------------
// $(elem).bub(class1, class2, time),	efeito buble	onde: class1 é a classe a ser removida, class2 será acrescentada, time é o delay
	$.fn.bub = function(class1, class2, time){
		var elem = this;
		setTimeout(function(){
			elem
			.removeClass(class1)
			.addClass(class2)}
			,time
		)
		return elem
	}
//----------------------------------------------------------------------------
// $(elem).isOverflowWidth().xxx,	onde xxx:	width => largura do texto;			ovflWidth => true se oveflow do texto na largura do elemento
//												height => altura da linha do texto;	ovflHeight => true se oveflow do texto na altura do elemento
	$.fn.isTextOverflow = function() {
		var textOvfl = false, value = 0, ovflW = null, ovflH = null, valueW = null, valueH = null;
		this.each(function() {
			var el = $(this);
			if (el.css("overflow") == "hidden"){
				var e = $(this.cloneNode(true)).hide().css('position', 'absolute').css('overflow', 'visible');

				var w = e.width('auto').height(el.height());
				el.after(w);	// insere conteúdo de t após el
				ovflW = (valueW = w.width()) > el.width()

				var h = e.height('auto').width(el.width());
				el.after(h);
				ovflH = (valueH = h.height()) > el.height();
			}
		})
		return {
			'ovflWidth': ovflW,
			'width': valueW,
			'ovflHeight': ovflH,
			'height': valueH
		};
	}
//----------------------------------------------------------------------------
// $(elem).bgLoaded({ afterLoaded: function(){ ... } })		se backgroundImage foi carregada execute ...
 	$.fn.bgLoaded = function(custom) {

		var self = this,
			defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		},
			settings = $.extend({}, defaults, custom);	// Merge default and user settings

		self.each(function(){	// todos os elementos em "elem"
			var $this  = $(this),
				bgImgs = $this.css('background-image').split(', ');
			$this.data('loaded-count',0);

			$.each(bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function(){
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count', $this.data('loaded-count') + 1);
					if ($this.data('loaded-count') >= bgImgs.length) settings.afterLoaded.call($this);
				});
			});

		});
	};

})(jQuery);

//============================================================================
// C$(elem)
window.C$ = function(selector){
	return document.querySelector(selector)
}

// $$(elem),	$$(elem).each(function(){..})
window.$$ = function(sel){
	var items = {}, res = [], i = 0, len = 0;
	res = Array.prototype.slice.call(document.querySelectorAll(sel));
	len = res.length;
	// add the res(array) to the items(object)
	while (i < len) items[i] = res[i++]
	// add some additional properties to this items object to make it look like an array
	items.length= len;
	items.splice= [].splice()
	items.each  = function(callback){
		res.forEach(function(item){ callback.call(item) })	//	for (var i = 0; i < len;) callback.call(items[i++])
	}
/*	items.hide  = $(sel).hide()
	items.show  = $(sel).show()
	for (i = 0; i < len;){
		var s = items[i++].style; s.opacity = 1;
		items.fadeOut = function(){ (s.opacity -= .09) < 0 ? s.display="none" : setTimeout(items.fadeOut,40) }
		items.fadeIn  = function(){ (s.opacity += .09) > 1 ? s.display="none" : setTimeout(items.fadeIn, 40) }
	}*/
	return items
}