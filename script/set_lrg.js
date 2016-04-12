// variáveis do sistema:
var wan, relSta, mobile=!1, barTempo=!1/*bar. tempo ativa*/, sinopse=sinopse2=!1, xbmcPage=!1/*página xbmc ativa (main, musica ou vídeo)*/,
	xbmcOn=!1/*se sair de pag.s xbmc ==> false*/, fundo='f2'/*fundo default*/, inoutPageLoaded=!1/*pág in/out carregada*/,
	curPag=oldPag='xbmcipPage', camPag=!0, ipPag=!1, mainPag=!1, musicPag=!1, videoPag=!1, tstPag=!1,
	chromeApp = true;

//========================================================================================
$(document).ready(function(){
  $('#rstImg').img([
	'camImg' ,'#','fndBox',,,,,
	'camImg1','#','fndBox img',384,,,,
	'camImg2','#','fndBox img',384,216,,,
	'camImg3','#','fndBox imgFlip',,,,,
	'camImg4','#','fndBox img',0,216
  ])

  $('#rstImg').div([
	'txt5','pl5 pt5',,,,
	'aud5','pl5 pt5 oh',,,,
	'img5','pl5',,60,,
//	'camLarge','lupa imgFlip'
  ])
  C$('#rstImg').innerHTML += '<canvas id="camLarge" class="lupa"></canvas>';

  $('#loadings').div([
	'camLoading' ,'abs',300,210,,
	'camLoading1','abs',532,112,,
	'camLoading2','abs',532,327,,
	'camLoading3','abs',195,112,,
	'camLoading4','abs',195,327,
  ])
  // botões câmeras, "VID", "LEN", portão, cam3 refresh time
  $('#camsBtn').div([
	'cam1','cam',,,'cam 1',
	'cam2','cam',71,,'cam 2',
	'cam3','cam',142,,'cam 3',
	'cam4','cam',213,,'cam 4',
	'cam5','cam',284,,'cam 5',
	'cam0','cam',355,,'todas',
	'camx','cam',426,,'video',
	'bt5','cA',-7,122,'<pre id="btnjpg" class="btnled"> VID</pre><span id="jpgOn"></span>',
	'bt6','cA',-7,162,'<pre id="btnmag" class="btnled"> LEN</pre><span id="magOn"></span>',
	'gateBk','portao abs blur',70,170,'',
	'gate','portao abs',70,170,'',
	's1701','abs xB f5',156,89,
  ])
  // botões de posicões setadas da cam3
  $('#botCam3').div([
	,'pt1 pl2',,,['m1','btn2',,,1],
	,'pt1',59,,['m2','btn2',,,2],
	,'pt1',111,,['m3','btn2',,,3],
	,'pt1',163,,['m4','btn2',,,4],
	,'pt2 pl2',,,['m5','btn2',,,5],
	,'pt2',59,,['m6','btn2',,,6],
	,'pt2',111,,['ms','btn2',,,'S'],
	'delbot','pt2',163,,['md','btn2',,,'D'],
	'lmpLig','lampDes abs pt1',222,
  ])[0].innerHTML += '<div class="xbmc_texto abs c1" style="left:9px;top:87px">cam 3</div>';
  // botões cam1: ascende lamp., apaga lamp.
  $('#botCam1').div([
	'lampLig','lampLig abs pl2 pt1',,,,
	'lampDes','lampDes abs pt1',94,,,
	,'xbmc_texto abs c1',9,87,'cam 1'
  ])
 // setas de direção de sweep-cam
  $('#nav').img([
	'arrowUs','img/arrow-5-up_w.png','abs',50,,,,
	'arrowRs','img/arrow-5-right_w.png','abs',135,50,,,
	'arrowDs','img/arrow-5-down_w.png','abs',50,135,,,
	'arrowLs','img/arrow-5-left_w.png','abs',,50
  ])
  // botões: "testes", "servidores"		campos texto: tempo exec, status de RS232tcp
  $('#bt3').div([
	'dirBtn','btnled l1',,,'testes',
	'srvBtn','btnled l1',,,'servidores',
//	'minifier','btnled l1',,,'minifier',
	'dirTime','f4 w1',,,'--',
	'dirTeste','abs f2 w2',320,1
  ])[0].innerHTML += '<input type="file" id="fileinput" onchange="$().drop()" class="input">';
  // botões sistema
  for(var i=1,j=16;i<11;i++,j+=52)
	$('#ipBtns')[0].innerHTML +=
		'<div class="abs b1" style="left:10px;top:'+j+'px"><div id="ip'+i+'" class="button"><div class="height"><div id="ipB'+i+'" class="inner"></div><span></span></div></div></div>';
  $('#ipBtns')[0].innerHTML +=
	'<pre id="s39" class="box1 abs" style="left:-2px;top:-32px;width:190px;height:24px"></pre><div class="abs" style="left:-58px"><div id="wolBtn" class="btnled b1" style="width:50px">WOL</div></div>';
  // caixa de texto: json id, mídia, kodi ver.
  $('#txt1').div([
	's9995','pl1',,2,,
	's9998','pl1',,14,,
	's9996','pl1',,28,,
  ])
  // botões canvas: "sis solar", "pano", "oscilador", "audio vol", "video vol"
  $('#btc').div([
	'solarBtn','btnled l1',,,'sis solar',
	'clothBtn','btnled l1',,,'pano',
	'osc','btnled l1',,,'oscilador',
	'audVol','btnled l1',,,'audio vol',
	'vdVol','btnled l1',,,'video vol',
  ])
  // botões das câmers
  $('#btcam').div([
	'cam1ldng','abs', 40, 32,,
	'camRc1Btn','pCam',85,6,'<i class="icon-stop redD"></i>',
	'camSp1Btn','pCam',156,6,'<i class="icon-stop"></i>',
	'cvsMsg1','mCam',85,36,,
	'cam2ldng','abs', 40, 97,,
	'camRc2Btn','pCam',85,71,'<i class="icon-stop redD"></i>',
	'camSp2Btn','pCam',156,71,'<i class="icon-stop"></i>',
	'cvsMsg2','mCam',85,101,,
	'cam3ldng','abs', 40, 162,,
	'camRc3Btn','pCam',85,136,'<i class="icon-stop redD"></i>',
	'camSp3Btn','pCam',156,136,'<i class="icon-stop"></i>',
	'cvsMsg3','mCam',85,166,,
	'cvsMsg','mCam',85,200,,
	'vidTst1',,,,,
	'vidTst2',,,,,
	'vidTst3',,,,,
  ])
  // pictures: video, music
  $('#d2701').img([
	'im1',img.blank,'s2700 b p0',,,350,200,
	'im2',img.blank,'s2701 object rotate360cw b',140,,200,200,
	'im3',img.blank,'s2702 b',200,,133,
  ])[0].innerHTML += '<div  class="abs" id="imgLdng" style="left:200px;top:90px"></div>';
  // sweep mouse
  $('#swm').img([
	'arrowUm','img/arrow-5-up_w.png','abs',50,0,,,
	'arrowRm','img/arrow-5-right_w.png','abs',135,50,,,
	'arrowDm','img/arrow-5-down_w.png','abs',50,135,,,
	'arrowLm','img/arrow-5-left_w.png','abs',0,50,,,
	'btn_OK','img/btn_OK_w.png','abs',57,54,70,70,
	'btn_ESC','img/btn_ESC_w.png','abs',44,56,100,70
  ])
  // sweep mouse - mãos (drag, tap, pinch)
  $('#sw').img([
	,'img/hand_drag.png','abs',90,10,80,90,
	,'img/hand_tap.png','abs',190,10,80,90,
	,'img/hand_pinch.png','abs',290,10,80,90
  ])
  // gira picture music a cada 15 seg,
	function rot2701(){
		if(C$('.s2701').src.substr(-9)!="blank.png")$('#2701').toggleClass('on')
		setTimeout(rot2701,15000)	// volte a girar o Thumb em 15 segundos
	}
	setTimeout(rot2701,15000)
	// botões do menu-fundos
	$('#d1312').hide()	// esconda fundos
	for(var i = 1; i < 10; i++)$('#d1312')[0].innerHTML += '<li><a id="f'+i+'" class="btnf'+i+'"></a></li>'
	$('#f1').btn("trcF('f1')")
	$('#f2').btn("trcF('f2')")
	$('#f3').btn("trcF('f3')")
	$('#f4').btn("trcF('f4')")
	$('#f5').btn("trcF('f5')")
	$('#f6').btn("trcF('f6')")
	$('#f7').btn("trcF('f7')")
	$('#f8').btn("trcF('f8')")
	$('#f9').btn("trcF('f9')")
	// minicam
	var el=$('#miniCam'); el.tap(function(){	// clic sobre minicam
		var a=el[0].width=="711";
		el.fadeOut(120,function(x){ el.sty(a ? [,set.tabDev?465:552,216,122] : [,set.tabDev?186:278,711,401]).fadeIn() })
	})
	// 12 leds das entrads do mód. ipcontrol
	for(var i = 11, j = 10; i < 23; i++, j += 20)$('#leds')[0].innerHTML += '<div id="d20'+i+'" class="led" style="left:'+j+'px"></div>';
	// botões menu-páginas
	$('#bx6').div([,'nwrp',,-22,'Sala jantar - barra de LEDs', 'btr','abs w3',15,57,'', 'btg','abs w3',85,57,'', 'btb','abs w3',155,15,'', 'btw','abs w3',225,15,'',])
	$('#btl').div(['luz25','btnled bgc5',,,'25%', 'luz50','btnled bgc9',,,'50%', 'luzUp','btnled',,,'+', 'luzDown','btnled',,,'-',])
	$('#btr').div(['ledr','btnled bgr',,,'R', 'ledr1','btnled bgr1',,,'.', 'ledr2','btnled bgr2',,,'.', 'ledr3','btnled bgr3',,,'.', 'ledr4','btnled bgr4',,,'.',])
	$('#btg').div(['ledg','btnled bgg',,,'G', 'ledg1','btnled bgg1',,,'.', 'ledg2','btnled bgg2',,,'.', 'ledg3','btnled bgg3',,,'.', 'ledg4','btnled bgg4',,,'.',])
	$('#btb').div(['led0','btnled bgc1',,,'OFF', 'ledb','btnled bgb',,,'B', 'ledb1','btnled bgb1',,,'.', 'ledb2','btnled bgb2',,,'.', 'ledb3','btnled bgb3',,,'.', 'ledb4','btnled bgb4',,,'.',])
	$('#btw').div(['led1','btnled bgc9',,,'ON', 'ledw','btnled bgw',,,'W', 'ledFsh','btnled',,,'flash', 'ledStb','btnled',,,'strob', 'ledFad','btnled',,,'fade', 'ledSmt','btnled',,,'smot',])
	// login loading-image
	var e = C$("#d1306"), i = 1;
	for(; i < 9; i++)e.innerHTML += '<div class="blockG" id="rotateG_0'+i+'"></div>';
	$('#d1306, #imgLdng').hide()	// esconda "loading"

})
//========================================================================================


function showPage(shown){
	if(shown==curPag)return;
	oldPag=curPag;

	$('#'+oldPag)
	.addClass('on')	// mova p/ fora do viewport sub-pags da pág anterior
	.bind("transitionend", function(){
		$(this).unbind("transitionend")
		.fadeOut(function(){
			$('#'+shown).show(function(){
				$(this).removeClass('on')
			})
		})
	});

	curPag=shown;

	cp.remOn(['d8', 'd10', 'd11', 'd12', 'd13', 'd16'])

	cp.hide(['d301'/*vol. receiver*/, 'd1302'/*lista sources*/, 'd2311'/*lista de músicas/filmes achados*/])

	camPag = shown=='camPage';
	if (camPag){
		if (cam.com) cam.show(cam.curr)	// se cam.com, mostre a camera corrente (apagada qdo. mudou de página)
		cp.addOn(['d8'])	// ative ícone da pág. "camPage"
		$('#d1330').sty([320,set.tabDev?200:700])
		$("#clock").sty([765,15]).fadeIn()
		$().sty(['d2405', 125, 300])	// barra/transport: reposicione
	}else{
		setTimeout(function(){cam.show(0)},700)	// esconda as câmeras
	}
	if(ipPag=shown=='xbmcipPage'){
		cp.addOn(['d10'])	// ative ícone da pág. "xbmcipPage"
		$('#d1330').sty([301,set.tabDev?200:610])
		sys.inicXbmcip()	// reinicie "xbmcip.js"
		$("#clock").sty([130,92]).fadeIn()
	}
	if(camPag||ipPag){
		if (!dir.on){
			if(!set.tabDev)sys.inPag('on_off')	// botão wan/lan
			sys.inPag('btnReles')
		}
		$('#d1305').sty([500,330]) // loading...
	}else
		sys.outRls()
	if(mainPag=shown=='xbmcmainPage'){
		$("#d305").text('midia').show()
		$('#miniCam').show()	// ip-cam mini
		cp.addOn(['d13'])	// ative ícone da pág. "xbmcmainPage"
		$().sty([
		'd301',set.tabDev?240:305,set.tabDev?193:502,,, // volume receiver
		'd1304',set.tabDev?338:400,set.tabDev?200:290,,set.tabDev?380:420, // playlist
		'd1305',set.tabDev?600:660,set.tabDev?400:510	// loading...
		])
		$('.plyBtn, #v115').show()
	}else{
		cam.clr('miniCam')	// bloqueie fluxo e esconda minicam
		$('#d30000,	#v115, #analyser').hide()
	}
	if(musicPag=shown=='xbmcmusicPage'){
		$("#d305").text('músicas').show()
		cp.addOn(['d12'])	// ative ícone da pág. "xbmcmusicPage"
		$().sty([
		'd301',set.tabDev?807:850,set.tabDev?300:460,,,
		'd1304',132,234,,set.tabDev?330:420,
		'd1305',390,398
		])
		$('.plyBtn, #libProp').show()
		fi.inicMusic()	// reinicie "xbmcmusic.js"
	}else{
		$('#libProp').hide()
	}
	if(videoPag=shown=='xbmcvideoPage'){
		$("#d305").text('filmes').show()
		$('.plyBtn, #d1304').hide()	// botão playlist, playlist
		cp.addOn([
		'd11',	// ative ícone da pág. "xbmcvideoPage"
		'd2303'	// mostre thumb-vídeos (z-index:10)
		])
		$().sty([
		'd301',set.tabDev?885:948,set.tabDev?258:350,,,
		'd1305',515,set.tabDev?450:599
		])
		vi.inicVideo()	// reinicie "xbmcvideo.js"
		if(sinopse||sinopse2)sys.inPag('d2304v',set.tabDev?'tab':'')
	}else{
		cp.remOn(['d2303'])
		sys.outPag('d2304v',set.tabDev?'tab':'')
	}
	if(mainPag||videoPag)sys.inPag('labelsMain')	// labels
	else sys.outPag('labelsMain')

	if(tstPag=shown=='canvasPage'){
		cp.addOn(['d16'])
		inicCanvas()
	}

	if(mainPag||musicPag||videoPag){
		$('#d1330').sty([378,216]) // box mensagem de erro
		kd.renew();	// faça kd.loopInfo atualizar status
		sys.pages()			// mostre/esconda HT buttons
		fi.inicMain()
		xbmcPage=!0;
		$('#d2701').show()	// picture music/video
		inicCamMainPag()	// inicializa as câmeras de mainPag e kd.loopInfo
		pl.show(false)
		if(barTempo)sys.inPag('barTmp');	// sub-pag barra tempo
		sys.inPag('xbmcMV')	// sub-pag botões media
		cam.vidState(false)
		$("#clock").fadeOut()
		$().sty(['d2405', 4, -122])	// barra/transport: reposicione
	}else{
		xbmcPage=!1;
		xbmcOn=!1;
		cp.hide([
		'd34',		// sinalizador kd.loopInfo()
		'd1304',	// lista playlist
		'd1305',	// "loading"
		'd2701',	// foto
		])
		sys.outPag('barTmp')
		sys.outPag('xbmcMV')
	}
}

$(document).ready(function(){
	cp.hide([
	'xbmcmainPage','xbmcmusicPage','xbmcvideoPage', 'arcondPage', 'inout', 'luzesPage', 'canvasPage',
	'd1330',	// box mensagem de erro
	'aviso',
	'd2404',	// box lista de músicas
	'd2302',	// box menu explorer vídeo
	'd2304',	// caixa texto musicPag
	'camImg', 'vidCam',	// câmeras
	'login'		// login
	])
	cp.addOn(['xbmcmainPage'])
})
