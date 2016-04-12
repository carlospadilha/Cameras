//function magnify(){..... deletado em 10/01/2016
//------------------ efeito lupa
function setMagnify(el, imgW, imgH, bckW, bckH, flip){
	
	var lupa = $('.lupa'), e = lupa[0].style,
		meiaLenteW = lupa.width()  / 2,
		meiaLenteH = lupa.height() / 2,
		inv = flip ? -1 : 1,
		fatorW	= inv * bckW / imgW,
		fatorH	= inv * bckH / imgH,
		cteW	= flip ? bckW : 0,
		cteH	= flip ? bckH : 0;

//	if (flip) cp.addOn(['camLarge'])		// flip fundo (ampliação), modo background image
//	else	  cp.remOn(['camLarge']);

	$('.magnify').unbind('mousemove');		// limpe vínculo anterior

	if (!touchDev)	// mouse - hoover sobre a área visual
		$('.magnify').mousemove(				  function(ev) { var el_offset = $(this).offset();									if (cam.mag) showMag(ev.pageX - el_offset.left, ev.pageY - el_offset.top) })
	else			// idem (touch devices)
		$('.magnify').bind('touchstart touchmove',function(ev) { var el_offset = $(this).offset(), t = ev.originalEvent.touches[0]; if (cam.mag) showMag(t.pageX  - el_offset.left, t.pageY  - el_offset.top) })

	function showMag(mx, my){
		// mostre/esconda lente se dentro/fora da área de visão
		if (mx < imgW && my < imgH && mx > 0 && my > 0){
			lupa.fadeIn(100)

			e.left = mx - meiaLenteW + 'px';	// desloc. da lente com o mouse
			e.top  = my - meiaLenteH + 'px';

			if (el == "camImg3"){	// camImg3 (snapshots) - modo canvas
				var img = C$("#camImg3");
				img.onload = function(){
					if (!cam.mag) return;
					var w = img.width * Math.abs(fatorW), h = img.height * Math.abs(fatorH),
						rx = Math.round( ( inv * (meiaLenteW + 2) ) - mx * fatorW ), 
						ry = Math.round( ( inv * (meiaLenteH + 2) ) - my * fatorH ),
						cvs = C$("#camLarge"), ctx = cvs.getContext('2d'); cvs.width = 175; cvs.height = 175;
					if (flip) { ctx.translate(w, h); ctx.scale(-1, -1) };
					ctx.drawImage(img, rx, ry, w, h)
				}					// camImg (videostream.cgi) - modo background image
			}else{
				var rx = Math.round(meiaLenteW - mx * fatorW - cteW),
					ry = Math.round(meiaLenteH - my * fatorH - cteH);
				e.backgroundPosition = rx + "px " + ry + "px";	// desloc. da background image
			}

		}else lupa.fadeOut(200);
	}
}




//------------------ gerenciamento de fundos e desfoca imagem abaixo de sub-pag.:
var fndTmr;
$(document).ready(function(){
	if (!mobile) $('#btnfnd').btn("$('#d1312').fadeIn(); $('#d1311').hide(); clearTimeout(fndTmr); fndTmr=setTimeout(function(){$('#d1312').fadeOut(); $('#d1311').fadeIn()},7000)")	// botão menu de fundos

	var transition = isSafari ? "webkitTransitionEnd" : isFirefox ? "transitionend" : "transitionend";

	if (!mobile){
		C$('#camBox').addEventListener(transition, function(e){
			if (e.target.id == "camBox" && camPag)		blurBack("#camP, #botCam3, .blur")	// fim de movim. sub-págs dentro de camBox, desfoque fundos de camP botCam3 e gate
		});
		$('#rls, #lanWan').on(transition, function(e){
			if (e.originalEvent.target.id == "rls")		blurBack("#rls")	// idem sub-pág 8 relés
			if (e.originalEvent.target.id == "lanWan")	blurBack("#lanWan")	// idem sub-pág lan/wan
		});
		$('#ipBox').on(transition, function(e){
			if (e.originalEvent.target.id == "ipBox" && ipPag) blurBack("#ipBtns, #bx4, #bx5", "#d302")	// idem sub-págs dentro de ipBox
		});
		$('#lm, #la').on(transition, function(e){
			if (e.originalEvent.target.id == "lm")		blurBack("#lm")		// idem sub-pág labels
			if (e.originalEvent.target.id == "la")		
			blurBack("#la")		// idem sub-pág de lista de arquivos
		});
		$('#sinBox').on(transition, function(e){
			if (e.originalEvent.target.id == "sinBox")	blurBack("#sinBox")	// idem sub-pág de sinopse/atores
		});

		$('#d2405').on(transition, function(){			blurBack("#d2405") });		// idem sub-pág barra de tempo

		$('#latMenu').on(transition, function(){		blurBack("#latMenu") });	// idem sub-pág menu lateral
	}
	$('#navBox').on(transition, function(e){		// fim de movim. navigation-menu, gira seta dupla amarela
		if (e.originalEvent.target.id == "navBox"){
			if ($("#d1311").hasClass("on")) C$('#d7').className = 'naviFlip right'
			else							C$('#d7').className = 'naviFlip';	// gira chevron-left 180º
		}
	});
})

function trcF(e){
	$('#d1312').fadeOut(); $('#d1311').fadeIn()
	$('#corpo').removeClass(fundo).addClass(e)	// remove fundo anterior e adiciona o novo
	fundo = e;

	$('#corpo').bgLoaded({	// backgroundImage foi carregada, desfoque sub-pags com .fndPag
		afterLoaded: function(){ 
		blurBack(".fndPag, #navBox, .blur") }
	})
}

//------------------ desfoca background image:
function blurBack(elem){	// criada por mim, muito rápida
	if (mobile) return;
	if (fundo == "f9") { $(".fndPag").css({'background': 'rgba(0,0,0,0.5)'}); return }
	var blurBox = $$(elem), url = "img/bg/bg" + fundo.replace("f", "") + "_blur.jpg", re = new RegExp(url), corpoSize = $("#corpo").css('background-size');

	for (var i = 0; i < blurBox.length; i++){
		var e = blurBox[i], $e = $(e), eSty = e.style;				// elemento
		if (isElemInViewport(e)){
			var /*leftPos =  e.offsetLeft,*/						// ... em left:...px (original)
				leftCur	= $e.offset().left + 2,						// idem (atual) + 2 pix (borda)
				/*topPos =  e.offsetTop,*/							// ... em top:...px (original)
				topCur	= $e.offset().top  + (set.tabDev ? 22 : 2),	// idem (atual) + 2 pix (borda)
				oldBckGndImg = eSty.backgroundImage;
			eSty.backgroundImage = "url(" + url + ")";				// set backgroundImage
			eSty.backgroundPosition = -leftCur + "px " + -topCur + "px";
			eSty.backgroundSize = corpoSize;
		}
	}
}

function blurBack2(elem){	// http://www.blurjs.com/
	if (mobile) return;
	if (fundo == "f9") { $(".fndPag").css({'background': 'rgba(0,0,0,0.5)'}); return }
	$(elem).blurjs({
		source: "#corpo",
		radius: 3,
		offset: { x: -2, y: -2 },	// 2 pix (borda)
		overlay: 'rgba(0,0,0,0.4)',
	//	optClass: 'blurred',
		cache: true,
		cacheKeyPrefix: 'blurjs-'	//Prefix to the keyname in the localStorage object
	});
}

// elemento visível?
function isElemInViewport(el) {	// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
	var rect = el.getBoundingClientRect();
	return (
		rect.top	>= 0 &&
		rect.left	>= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.right	<= (window.innerWidth  || document.documentElement.clientWidth ) && /*or $(window).width() */
		rect.width	>  0 &&
		rect.height >  0
	);
/*	var rect     = el.getBoundingClientRect(),
		vWidth   = window.innerWidth  || doc.documentElement.clientWidth,
		vHeight  = window.innerHeight || doc.documentElement.clientHeight,
		efp      = function (x, y) { return document.elementFromPoint(x, y) };     

	if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;	// Return false if it's not in the viewport

	return (	// Return true if any of its four corners are visible
		  el.contains(efp(rect.left,  rect.top))
	  ||  el.contains(efp(rect.right, rect.top))
	  ||  el.contains(efp(rect.right, rect.bottom))
	  ||  el.contains(efp(rect.left,  rect.bottom))
	);*/
}
