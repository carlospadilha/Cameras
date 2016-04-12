//==================================================== biblioteca cam (cameras)
var cam = {
  ip1: "", ip1x: "", ip2: "", ip3: "", ip3h: "", ip3v: "", ip4: "", ip4v: "", ip5: "", ip5v: "", ip5u: "",
  pass1: "", pass2: "", pass3: "", pass4: "", pass5: "",
  strm1: "", strm2: "", strm2v: "", strm3: "", strm3q: "", strm3v: "", audio3: "", strm4v: "", strm5v: "", strm5u: "",
  snap1: "", snap2: "", auxTmr: 0, tmr: 0, tmrAll: 0,
  url: "", tmr: "", curr: 3, vidE: {}, locVol: "", video: "",
  qtmParam: ' autoplay="true" plugin="quicktimeplugin" scale="Aspect" cache="false" CONTROLLER="false" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/" ',
  vidParam: ' type="video/ogg; codecs=theora,vorbis" autoplay controls preload="none" ',
  com: false,	// comunicação com rede local principal
  delayCom: 0,	// tempo de comunicação com cam 1
  //------------------------- mostra todas as ip câmeras
  all: function(){
	if (!cam.com) return;	// não há comunicação com rede local principal
	$('#swpCam').hide()		// desabilita cam navigation (touch)
	cp.addOn(['cam0']);		// ative botão cam "Todas"

	if (curPag == "camPage"){
		$('#camNavi').hide()	// esconda cam navigation
		var w = 382, h = 215, t3 = 0;
		if (!chromeApp)
			$('#camImg4')
				.attr('src', cam.strm5 + "&" + cp.secTime())
				.one('load', function(){ $('#camLoading4').hide() })
				.show() // mostre cam 1
				.btn('cam.show(5)')	// clic em cima e mostre em tela única
	}
	if (curPag == "camMblPage"){
		$('#rstImg').css({top:1})
		var w = 263, h = 149, t3 = 150;
		C$('#vidCam').pause(); $('#vidCam').hide()	// esconda elemento vídeo
	}

	$('#camLoading1').show(); $('#camLoading2').show(); $('#camLoading3').show()
	setTimeout(function(){ cp.hide(['camLoading1','camLoading2','camLoading3','camLoading4']) }, 10000) // esconda "loadings" depois de 10 segundos, caso persistam

	if (chromeApp){
		$('#camImg1, #camImg2, #camImg4').show()
		cam.setSrcAll()
	}else{
		$('#camImg1').attr('src', cam.strm1 + "&" + cp.secTime()).one('load', function(){ $('#camLoading1').hide() }).btn('cam.show(1)').show()	// mostre cam 1
		$('#camImg2').attr('src', cam.strm2 + "&" + cp.secTime()).one('load', function(){ $('#camLoading2').hide() }).btn('cam.show(2)').show()	// mostre cam 2
	}
	$('#camImg3').css({top: t3, width: w, height: h}).btn('cam.show(3)').show(); cam.cam3Src(); cam.auxTmr3 = cp.timeDate();				// mostre cam 3
	if (!set.tabDev) $('#botCam1, #botCam3').show();	// mostre botões da câmera 1 e 3
  },
  //------------------------- set modo Vídeo
  fnc: [],
  setFnc: function(x){
	var el = $('#jpgOn'); /*cp.remOn(['vlcOn']);		cam.vlc[x] = false;*/
	if (el.hasClass('on'))	{ el.removeClass('on');	cam.fnc[x] = false }
	else					{ el.addClass('on');	cam.fnc[x] = true };
	cam.show(x)
  },
  //------------------------- set modo Lente
  mag: false,
  setMag: function(){
	var el = $('#magOn');
	if (el.hasClass('on'))	{ el.removeClass('on');	cam.mag = false; $('#camLarge').removeClass('lupa'); cp.addOn(['swpCam']) }
	else					{ el.addClass('on');	cam.mag = true;  $('#camLarge').   addClass('lupa'); cp.remOn(['swpCam']); cam.show(cam.curr) }
  },
  //------------------------- set modo Audio
  aud: false,
  setAud: function(x){
	var el = $('#audOn');
	if (el.hasClass('on'))	{ el.removeClass('on');	cam.aud = false }
	else					{ el.addClass('on');	cam.aud = true };
	cam.show(x);
  },
  //------------------------- mostra ip câmeras 1, 2, 3, 4 e 5 individualmente
  show: function(ipCam){
	$("#s1701").texto(" ");		// apague (xxx ms) da cam 3

	cam.imgClr('camLarge');		// apague/esconda magnified (background image)
	clearTimeout(cam.tmr);		// cancele loop da cam 3

	cp.clrImg(["camImg", "camImg1", "camImg2", "camImg3", "camImg4"])	// apague/esconda elementos de câmeras (img)
	/*C$('#vidCam').pause();*/ $('#vidCam').attr('src', '#')	// idem, (video)
	cp.hide([
		'camLoading', 'camLoading1', 'camLoading2', 'camLoading3', 'camLoading4',	// esconda "camLoadings"
		'botCam1', 'botCam3',	// esconda luz frontal e botões da câmera 3
		'vidCam'				// esconda elementos vlc e vídeo
	])
	cp.remOn(['cam0', 'cam1', 'cam2', 'cam3', 'cam4', 'cam5', 'camx']);	// desative botões-cãmera

	setTimeout(function(){ camShow(ipCam) }, 200)

	function camShow(ipCam){
		// se IP Cam 1 ou 2 esconda botão-portão:
		if (ipCam == 1 || ipCam == 2 || ipCam == 4) $("#gate, #gateBk").hide()
		else										$("#gate, #gateBk").show();
		// se "video", esconda navegação-câmeras:
		if (ipCam == 9)			$('#camNavi').hide()
		else if (!set.tabDev)	$('#camNavi').show();
		$('#swpCam').show()			// habilita cam navigation (touch)

		if (ipCam == 6){ cam.all(); return }	 // mostre todas as câmeras
		if (ipCam == 0) return;		// ipCam(0), significa esconder câmeras, e não setar outra

		cam.curr = ipCam;
		if (!cam.com && ipCam != 9) return;		// não há comunicação com rede local principal

		$('#camLoading').show(); setTimeout(function(){ $('#camLoading').hide() }, 20000);	// mostre, esconda "loading" depois de 20 segundos, caso persista
		cp.remOn([/*'vlcOn',*/'jpgOn'])

		if (curPag == "camPage")	{ var cam720pWidth = 764, cam720pHeight = 430, camWidth = 573, camHeight = 430; cam.clr('imag5') };
		if (curPag == "camMblPage")	{ var cam720pWidth = 393, cam720pHeight = 220, camWidth = 394, camHeight = 294 };

		if (ipCam == 1){
			cp.addOn(['cam1'])		// ative botão cam 1
			$('#botCam1').fadeIn(function(){ blurBack("#botCam1") })	// mostre botões do portão, luz frontal e desfoque sua sub-pág
			$('#camImg').sty([,,camWidth,camHeight])
			cam.url = chromeApp ? cam.snap1 : cam.strm1; cam.setSrc(); $('#camImg').show(); cam.magImg(cam.url, camWidth, camHeight, 640, 480, false)
			cam.param(0, 32, function(){})	// resolução VGA da cam 1
		}
	
		if (ipCam == 2){
			cp.addOn(['cam2'])
			$('#camImg').sty([,, camWidth, camHeight])
			cam.url = chromeApp ? cam.snap2 : cam.strm2; cam.setSrc(); $('#camImg').show(); cam.magImg(cam.url, camWidth, camHeight, 640, 480, false)
		}

		if (ipCam == 3){
			cp.addOn(['cam3']) /*ative botão cam 3*/; $('#resBot').hide() /*esconda botão "R" (Restore)*/; $('#botCam3').fadeIn(function(){ blurBack("#botCam3") }) /*mostre botões da cam 3 e desfoque sua sub-pág*/
			if (cam.fnc[3] && curPag != "camMblPage"){	// modo video
				cp.addOn(['jpgOn'])
				$('#vidCam').attr('src',cam.url = cam.ip3h + "/cam.ogg").css({width: cam720pWidth, height: cam720pHeight}).show()
				cam.loading("vidCam")	// apague "loading" qdo. video-load
			}else{	// modo jpeg
				$('#camImg3').css({top: 0, width: cam720pWidth, height: cam720pHeight}).show()
				cp.addOn(['camImg3'])	// flip cam 3, classe "imgFlip.on"
				cam.auxTmr3 = cp.timeDate();
				setTimeout(function(){ cam.cam3Src(); if (cam.mag) setMagnify("camImg3", cam720pWidth, cam720pHeight, 1280, 720, true) }, 500)
			}
		}

		if (ipCam == 4){
			cp.addOn(['cam4'])		// ative botão cam 4
			$('#camImg').sty([,,camWidth,camHeight])
			cam.url = chromeApp ? cam.snap4 : cam.strm4; cam.setSrc(); $('#camImg').show(); cam.magImg(cam.url, camWidth, camHeight, 640, 480, false)
		}

		if (ipCam == 5){
			cp.addOn(['cam5'])		// ative botão cam 5
			$('#camImg').sty([,,camWidth,camHeight])
			cam.url = chromeApp ? cam.snap5 : cam.strm5; cam.setSrc(); $('#camImg').show(); cam.magImg(cam.url, camWidth, camHeight, 640, 480, false)
			cam.param(0, 32, function(){})	// resolução VGA
		}

		if (ipCam == 9){
			cp.addOn(['camx'])
			var aux = !isSafari && !android;
			if (aux) /*Chrome ou Firefox*/ $('#vidCam').attr('src', cam.url = cam.video							).css({width: 680, height: 400}).show()
			else	 /*Safari ou Android*/ $('#vidCam').attr('src', cam.url = "buffer/video.mp4?" + cp.secTime()).css({width: 680, height: 400}).show()
			cam.loading("vidCam")
		}

		// formata tamanho do fundo e quadro de imagem/video das câmeras:
		if (curPag == "camPage")	$('#vidCam').css({top: 0})
		if (curPag == "camMblPage") $('#rstImg').css({top: (ipCam == 3 || ipCam == 4) ? 76 : 1})
	}
  },
  //------------------------- carrega src e faz watch-dog da cam 3
  cam3Src: function(){
	if (chromeApp){
		if ($('#camImg3, #miniCam').is(':visible'))
			cp.proxyAjaxBin(cam.strm3, '', function(x){
				if (x && $('#camImg3').is(':visible')) { C$('#camImg3').src = x.data; clearTimeout(cam.tmr); cam.tmr = setTimeout(cam.cam3Src, 100); $("#s1701").texto("(" + parseInt(cp.timeDate() - cam.auxTmr3) + " ms)"); cam.auxTmr3 = cp.timeDate() };
				if (x && $('#miniCam').is(':visible')) { C$('#miniCam').src = x.data; clearTimeout(cam.tmr); cam.tmr = setTimeout(cam.cam3Src, 250)  };
				if (!$('#camImg3').is(':visible')){								 clearTimeout(cam.tmr); cam.tmr = setTimeout(cam.cam3Src, 2000) };	// watch dog
				$('#camLoading, #camLoading3').hide()
			})
		else { clearTimeout(cam.tmr); cam.tmr = setTimeout(cam.cam3Src, 2000) }
	}else{
		if ($('#camImg3').is(':visible')) C$('#camImg3').src = /*'php/streamCam.php?url=' +*/ cam.strm3 + "?" + cp.secTime();
		if ($('#miniCam').is(':visible')) C$('#miniCam').src = /*'php/streamCam.php?url=' +*/ cam.strm3 + "?" + cp.secTime();
	}
  },
  //------------------------- IP Cams 1 e 2 streaming.	Se chromeApp: Cams 1, 2, 4 e 5 snapshot loop
  setSrc: function(){
	if (chromeApp){
		clearTimeout(cam.tmr); 
		if ($('#camImg').is(':visible'))
			cp.proxyAjaxBin(cam.url, '', function(x){
				if (x) $('#camImg').attr('src', x.data).one('load', function() { $('#camLoading').hide() })
				cam.tmr = setTimeout(cam.setSrc, 100);
			})
		else cam.tmr = setTimeout(cam.setSrc, 200)
	}else
		$('#camImg').attr('src', cam.url + "&" + cp.secTime()).one('load', function() { $('#camLoading').hide() }).show()
  },
  //------------------------- chromeApp: Cams 1, 2 e 4 snapshot loop
  setSrcAll: function(){
	clearTimeout(cam.tmrAll); 
	if ($('#camImg1, #camImg2').is(':visible'))
		cp.proxyAjaxBin(cam.snap1, '', function(x){
			if (x) $('#camImg1').attr('src', x.data).one('load', function() { $('#camLoading1').hide() })
			cp.proxyAjaxBin(cam.snap2, '', function(x){
				if (x) $('#camImg2').attr('src', x.data).one('load', function() { $('#camLoading2').hide() })
				cp.proxyAjaxBin(cam.snap5, '', function(x){
					if (x) $('#camImg4').attr('src', x.data).one('load', function() { $('#camLoading4').hide() })
					cam.tmrAll = setTimeout(cam.setSrcAll, 100);
				})
			})
		})
	else cam.tmr = setTimeout(cam.setSrc, 200)
  },
  //------------------------- apaga "loading" quando video carregado
  loading: function(x){	// detalhes sobre .readyState: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
	if (C$('#' + x).readyState != 4) setTimeout(function(){cam.loading(x)}, 200)
	else{$('#camLoading').hide(); $('#camLoading4').hide()}
  },
  //------------------------- limpa imagem de Cams
  clr: function(e) { $('#' + e).attr('src', img.blank).fadeOut() },
  //------------------------- rotinas de aumento (lente) das câmeras
  bgImg:  function(e, url){$('#' + e).css('background-image', 'url(' + url + ')')},	// carrega imagem de fundo (tamanho real)
  // apaga imagem de fundo:
  imgClr: function(e) { cam.bgImg(e, '../' + img.blank) },

  magImg: function(url, imgW, imgH, bckW, bckH, flip){
	if (cam.mag){
		cam.bgImg('camLarge', url)	// load magnified cam
		setMagnify(url, imgW, imgH, bckW, bckH, flip)
	}
  },
  //------------------------- IP Cam 3 - move p/ posições pressetadas
  bot3: 1,
  btnMove3: function(bot){
	if (cam.curr == 3){		// IP Cam 3
		if (bot == 11) cam.move("", "", "=setpsp&para="  + cam.bot3)
		if (bot == 12) cam.move("", "", "=delpsp&para="  + cam.bot3)
		if (bot > 0 && bot < 11){
			cam.move("", "", "=callpsp&para=" + (cam.bot3 = bot));
			cam.btnSetOn(bot); cp.dataRead(function(x){ x.botCam3 = bot; cp.dataStore(x, function(){}) })	// salve nº do botão
		}
	}
  },
  btnSetOn: function(bot){	// mantém botão acionado (bot) e desaciona os outros
	for (var i = 1; i < 7; i++) $("#m" + i).removeClass('on')
	$("#m" + bot).addClass('on')
  },
  //------------------------- IP Cam 1 - navegação 1 passo
  step: function(dir){
	som.clic();	// som de "clic"
	cam.crossCmd(cam.ip1x + "/decoder_control.cgi?" + cam.pass1 + "&command=" + dir + "&onestep=1")
  },
  //------------------------- IP Cams 1, 2, 3 e 5 - navegação
  move: function(cmd, dir, dir2, dir5, backReturn, callback){
	if (cam.curr == 1) var ender = cam.ip1x + "/decoder_control.cgi?command=" + cmd  + "&" + cam.pass1;
	if (cam.curr == 2) var ender = cam.ip2x + "/moveptz.xml?dir="			  + dir  + "&" + cam.pass2;
	if (cam.curr == 3) var ender = cam.ip3  + "/ptzctrl?act="				  + dir2;
	if (cam.curr == 4) var ender = cam.ip4  + "/decoder_control.cgi?command=" + dir5 + "&" + cam.pass4;
	if (cam.curr == 5) var ender = cam.ip5x + "/decoder_control.cgi?command=" + dir5 + "&" + cam.pass5;
	cam.crossCmd(ender, backReturn, callback)
  },
  //------------------------- comando (cross-domain)
  crossCmd: function(cmd, backReturn, callback){
//	corsWindow(cmd, function(x){ var a = x })
//	$("head").append('<img src="' + cmd + '">')
//	cp.jsonpSend(cmd, function(x){ var a = x })
	if (/*cam.curr == 3 || */cam.curr == 4 && !chromeApp ) $("head").append('<script src="' + cmd + '"></script>')	// via <script src=...>
	else cp.proxyAjax(cmd, '',  wan ? 10000 : 3000, '', function(x){	// via php
		if (x == "timeout") cp.msgErr("Erro Comunic. Cam " + cam.curr + " - " + x, true)
		else wan && cp.msgErr("Cam " + cam.curr + " - " + (cam.curr == 2 ? $($.parseXML(x)).find("Success").text() : x), true);
		backReturn && callback(x);
	});
  },
  //------------------------- IP Cam 1 - set parâmetros
  param: function(parametro, valor, callback){
	cp.proxyAjax(cam.ip1x + "/camera_control.cgi?" + cam.pass1 + "&param=" + parametro + "&value=" + valor, '', 3000, '', callback)
  },
  //------------------------- IP Cam 1 - get parâmetros
  getParCam: function(){
	cp.proxyAjax(cam.ip1x + "/get_misc.cgi?" + cam.pass1, '', '', '', function(x){ cp.msgErr("get parametros: " + x) })
  }, // "get_params.cgi?" / "get_status.cgi?" / "get_camera_params.cgi?" / "get_forbidden.cgi?" / "get_misc.cgi?"
  //------------------------- IP Cam 1 - patrol
  patrol: function(valor){	// 0 = +lento	100 = +rápido
	cp.proxyAjax(cam.ip1x + "/set_misc.cgi?" + cam.pass1 + "&ptz_patrol_rate=" + valor, '', '', '', function(dado){
		if (valor == 20) $("#d46").texto(0);	//  set mov. lento IP-Cam?,		libere botão
		if (valor == 5 ) $("#d47").texto(0);	//  set mov. rápido IP-Cam?,	libere botão
	})
  },
  //------------------------- IP Cam 3 - login
  login3: function(){
	if (!cam.com) return;
	var url = cam.ip3 + '/login?' + cam.pass3;	// http://192.168.1.36/login?user=admin&password=sol
//	cp.proxyAjax(url, '', '', '', function(){})	// via php
	cp.proxyAjax(url, '', wan ? 10000 : 3000, '', function(x){
		if ($(new DOMParser().parseFromString(x, "text/xml")).find("title").text() != "DVS/IP-CAM") cp.msgErr("cam 3: erro de conexão", true);	// cam 3 login (HTML parser/filter tag "title") ==> "DVS/IP-CAM"
		if (!chromeApp) $("head").append('<script src="' + url + '"></script>')
		setTimeout(cam.cam3Src, 500)
	})
  },
  //------------------------- rotinas video vidCam
	blinkTmr: 0,
  vidState: function(x){	// mostra/recolhe barra/transport/volume
	if (x){
		if (!camPag) return;
		$("#latMenu").hide()
		sys.inPag ('xbmcMV'); sys.inPag ('barTmp'); cp.show(['legBtn', 'audBtn']); sys.outRls();
	} else{
		if (camPag) { sys.outPag('xbmcMV'); sys.outPag('barTmp') }
		$("#latMenu").show()
	}
  },
 
  vidControl: function(x){
	var vidElm = C$("#vidCam");
	if (vidElm.controller != undefined && vidElm.controller != null) return vidElm.controller
	else return vidElm
  }
}

$(document).ready(function(){
	if (!chromeApp)
		$('#camImg3, #miniCam')
		.on('error', function(){ som.err(); cam.login3() })	// cam 3 login e src
		.on('load',  function(){
			clearTimeout(cam.tmr)
			$('#camLoading, #camLoading3').hide();
			if ($('#camImg3').attr("src") != "../img/blank.png")
				if ($('#camImg3').is(':visible')) { cam.tmr = setTimeout(cam.cam3Src, 100); $("#s1701").texto("(" + parseInt(cp.timeDate() - cam.auxTmr3) + " ms)"); cam.auxTmr3 = cp.timeDate() }
				else								cam.tmr = setTimeout(cam.cam3Src, 2000);	// watch dog
			if ($('#miniCam').is(':visible'))		cam.tmr = setTimeout(cam.cam3Src, 250);
		})

	C$("#vidCam").addEventListener("loadedmetadata", function(){ var width  = this.videoWidth, height = this.videoHeight }, false );
	C$("#vidCam").onended = function(e){ };
	$("#vidCam")
	.bind("ended",	function(e){ cam.vidState(false) })
	.bind("pause",	function() { })
	.bind("play",	function() { cam.vidState(true) })
	.bind("progress", function(e){
		if (/#/.test(C$("#vidCam").src)) return;		// se source == "#", retorne
		var totalTime = this.duration, playTime = this.currentTime;
		$("#s20007").texto(cp.StoHMS(totalTime))
		$("#s20006").texto(cp.StoHMS( playTime))
		if (cam.blinkTmr < cp.timeDate()){
			cam.blinkTmr = cp.timeDate() + 500;			// a cada 0.5 seg
			if ($("#d33").texto())	$("#d33").texto(0)	// apague botão "play/pause"
			else 					$("#d33").texto(1)	// ascenda "
		}
		kd.secTime = totalTime;
		var aux = 1 + parseInt(playTime * 1000 / kd.secTime, 10);
		if (aux && kd.seekEnable) $("#a112").CPslider({value: aux});
		if (kd.volEnable){
			$("#a114").CPslider({value: cam.locVol})	// posicione cursor do volume
			cam.vidE[0].volume = cam.locVol / 100;
		}
		cam.vidState(true)
	})
});

function failed(e){ if (/null/.test(C$("#vidCam").src)) cam.vidState(false) }
