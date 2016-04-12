$(document).ready(function(){
	//-------------------- rfx9600:
	$('#togle1Rfx').on('click', function(){ rx.btn(rx.dev, 2, 1, '', 0,	function(x){ cp.btnLedOnOff("ledTogle1", x)}) })	// togle on/off rele 1 do rx.dev
	$('#togle2Rfx').on('click', function(){ rx.btn(rx.dev, 2, 2, '', 0,	function(x){ cp.btnLedOnOff("ledTogle2", x)}) })	// .. 2
	$('#togle3Rfx').on('click', function(){ rx.btn(rx.dev, 2, 3, '', 0,	function(x){ cp.btnLedOnOff("ledTogle3", x)}) })	// .. 3
	$('#togle4Rfx').on('click', function(){ rx.btn(rx.dev, 2, 4, '', 0,	function(x){ cp.btnLedOnOff("ledTogle4", x)}) })	// .. 4

	if (!mobile){
		// receiver Panasonic
		$('#mute'     ).btn(function(){ rx.sendIR(1, 1, pan.mute, 0) })	// Mute
		$('#dvdInput' ).btn(function(){ rx.sendIR(1, 1, pan.dvd,  0) })	// DVD Input Select
		$('#channel'  ).btn(function(){ rx.sendIR(1, 1, pan.chan, 0) })	// Channel Select
		// luz do HT
		$('#luz25'    ).btn(function(){ rx.sendIR(1, 2, luz.v25,0) })	// 25%
		$('#luz50'    ).btn(function(){ rx.sendIR(1, 2, luz.v50,0) })	// 50%
		$('#luzUp'    ).btn(function(){ rx.sendIR(1, 2, luz.up,	0) })	// step +
		$('#luzDown'  ).btn(function(){ rx.sendIR(1, 2, luz.dn, 0) })	// step -
		// barra de leds RGB (sala de jantar)
		$('#led1'     ).btn(function(){ rx.sendIR(4, 2, led.on,	0) })	// on
		$('#led0'	  ).btn(function(){ rx.sendIR(4, 2, led.off,0) })	// off
		$('#ledw'	  ).btn(function(){ rx.sendIR(4, 2, led.w,	0) })	// white
		$('#ledr'	  ).btn(function(){ rx.sendIR(4, 2, led.r,	0) })	// red
		$('#ledr1'	  ).btn(function(){ rx.sendIR(4, 2, led.r1,	0) })
		$('#ledr2'	  ).btn(function(){ rx.sendIR(4, 2, led.r2,	0) })
		$('#ledr3'    ).btn(function(){ rx.sendIR(4, 2, led.r3,	0) })
		$('#ledr4'    ).btn(function(){ rx.sendIR(4, 2, led.r4, 0) })
		$('#ledg'     ).btn(function(){ rx.sendIR(4, 2, led.g,	0) })	// green
		$('#ledg1'    ).btn(function(){ rx.sendIR(4, 2, led.g1,	0) })
		$('#ledg2'    ).btn(function(){ rx.sendIR(4, 2, led.g2,	0) })
		$('#ledg3'    ).btn(function(){ rx.sendIR(4, 2, led.g3,	0) })
		$('#ledg4'    ).btn(function(){ rx.sendIR(4, 2, led.g4, 0) })
		$('#ledb'     ).btn(function(){ rx.sendIR(4, 2, led.b,	0) })	// blue
		$('#ledb1'    ).btn(function(){ rx.sendIR(4, 2, led.b1,	0) })
		$('#ledb2'    ).btn(function(){ rx.sendIR(4, 2, led.b2,	0) })
		$('#ledb3'    ).btn(function(){ rx.sendIR(4, 2, led.b3,	0) })
		$('#ledb4'    ).btn(function(){ rx.sendIR(4, 2, led.b4, 0) })
		$('#ledFsh'   ).btn(function(){ rx.sendIR(4, 2, led.fsh,0) })	// flash
		$('#ledStb'   ).btn(function(){ rx.sendIR(4, 2, led.stb,0) })	// strobe
		$('#ledFad'   ).btn(function(){ rx.sendIR(4, 2, led.fad,0) })	// fade
		$('#ledSmt'   ).btn(function(){ rx.sendIR(4, 2, led.smt,0) })	// smoth
	}
	$('#rfx').btn(function(){ var b=$('#rfx').text(); rx.dev=b=='rfx 1'?2:b=='rfx 2'?3:b=='rfx 3'?4:1; $('#rfx').texto('rfx '+rx.dev); rx.releStatus() })
	// botão "le status" entradas rfx9600
	$('#statusEnt').btn(function(){
		rx.inEn(0);
		rx.cmd(rx.dev, 3, 1, '', '', function(x){
			cp.ledOnOff("ledEnt1", x)	// le entrada 1
			rx.cmd(rx.dev, 3, 2, '', '', function(x){
				cp.ledOnOff("ledEnt2", x) 	// .. 2
				rx.cmd(rx.dev, 3, 3, '', '', function(x){
					cp.ledOnOff("ledEnt3", x) 	// .. 3
					rx.cmd(rx.dev, 3, 4, '', '', function(x){
						cp.ledOnOff("ledEnt4", x) 	// .. 4
						rx.inEn(1);
					})
				})
			})
		})
	})
	// portão
	$('#gate').btx(function(){	// o mesmo que ().btn() + mantém botão ativo (aceso)
		rx.inEn(0);
		setTimeout(function(){ rx.pulsoRele(1, 2, 950, function(){ 
			rx.inEn(1);
			$('#gate').texto(0) /* desativa botão */
		})}, 200)
	})
	$('#cmdClr')	.btn(function(){ li.clear('l60000') })	// limpa lista de comandos
	$('.ac_powerOn').btn(function(){ ac.powerON() })		// on/off ar-condicionado
	$('.arrowri')	.btn(function(){ ac.fanUp() })
	$('.arrowle')	.btn(function(){ ac.fanDown() })
	$('.arrowup')	.btn(function(){ ac.tempUp() })
	$('.arrowdo')	.btn(function(){ ac.tempDown() })
	$('.btn_ok')	.btn(function(){ ac.mode() })
	$('#acTurbo')	.btn(function(){ ac.Turbo() })
	$('#acLuz')		.btn(function(){ ac.Luz() })
	$('#acSwing')	.btn(function(){ ac.Swing() })
	//-------------------- ip control:
	$('#ipctrl_entradas').btn(function(){io.cmd(162,false,0)})	// botão "le status"
	$('#ipctrl_pooling' ).btn(function(){						// .. "pooling"
		if (io.pooling) { io.pooling = false; $("#poolingLed").texto(0) }
		else			{ io.pooling = true ; $("#poolingLed").texto(1); io.dblRead = null; io.send() }
	})
	$('#ioStatus').btn(function(){ io.rstatus() })
	// relés:
	$('#rl1').btn(function(){ io.releBtn(1)} )
	$('#rl2').btn(function(){ io.releBtn(2)} )
	$('#rl3').btn(function(){ io.releBtn(3)} )
	$('#rl4').btn(function(){ io.releBtn(4)} )
	$('#rl5').btn(function(){ io.releBtn(5)} )
	$('#rl6').btn(function(){ io.releBtn(6)} )
	$('#rl7').btn(function(){ io.releBtn(7)} )
	$('#rl8').btn(function(){ io.releBtn(8)} )
	//-------------------- fechamento de páginas e sub-páginas (xcancel)
	if (!mobile){
		$('#luzClose')	 .btn(function(){ $("#luzesPage").fadeOut() })	// fecha página lúzes
		$('#x1')		 .btn(function(){ dir.clr() })					// fecha sub-pág diretório (cam page)
		$('#filSchClose').btn(function(){ sk.lupa() })					// fecha sub-pág lista arquivos procurados
		$('#filLstClose').btn(function(){ $('#d2404').fadeOut() })		// fecha sub-pág lista de arquivos (music page)
		$('#libClose')	 .btn(function(){ vi.libInfoClose() })			// fecha sub-pág video library info
		$('#mouseClose') .btn(function(){ $('#swpMouse').fadeOut(300); $('#a114').show() })	// fecha sub-pág sweep-mouse
	}
	$('#inOutClose') .btn(function(){ $("#inout").fadeOut(); if(!camPag && !ipPag) sys.outPag('btnReles'); inoutPageLoaded=!1;/*desabilite lista l60000*/ }) // fecha página In/out
	$('#arCondClose').btn(function(){ $("#arcondPage").fadeOut() })	// fecha página ar-condicionado
	$('#plyClose')	 .btn(function(){ pl.close() })					// fecha sub-pág playlist/memolist
	//-------------------- câmeras:
	$('#cam1').btn(function(){cam.show(1)})
	$('#cam2').btn(function(){cam.show(2)})
	$('#cam3').btn(function(){cam.show(3)})
	$('#cam4').btn(function(){cam.show(4)})
	$('#cam5').btn(function(){cam.show(5)})
	$('#cam0').btn(function(){cam.show(6)})
	$('#camx').btn(function(){cam.show(9)})

	$('#lampLig').btn(function(){ cam.curr = '1'; cam.move(94, "") })
	$('#lampDes').btn(function(){ cam.curr = '1'; cam.move(95, ""); /*cam3out()*/ })
	$('#lmpLig').btn(function(){ io.releBtn(8) })

	$('#m1').btn(function(){ cam.btnMove3(1) })
	$('#m2').btn(function(){ cam.btnMove3(2) })
	$('#m3').btn(function(){ cam.btnMove3(3) })
	$('#m4').btn(function(){ cam.btnMove3(4) })
	$('#m5').btn(function(){ cam.btnMove3(5) })
	$('#m6').btn(function(){ cam.btnMove3(6) })
	$('#ms').btn(function(){ cam.btnMove3(11) })
	$('#md').btn(function(){ cam.btnMove3(12) })
//	$('#mr').btn(function(){ cam.btnMove3("R") })
	
	/*function cam3out(){ cp.proxyAjax(cam.ip3 + "/ao", '', '', '', function(){}) }*/

	cp.hide(['camLoading', 'camLoading1', 'camLoading2', 'camLoading3', 'camLoading4', 'd1305', 'cam1ldng', 'cam2ldng', 'cam3ldng'])

	// cam mouse:
	cp.hide(['arrowDs', 'arrowUs', 'arrowLs', 'arrowRs'])
	cp.addOn(['swpCam'])	// habilite mouse - cam - navigation

	$('#swpCam')
	.drgd(function(){ shwCmd('arrowDs', 0, "down",	"down", 2, 3) })
	.drgu(function(){ shwCmd('arrowUs', 2, "up",	"up",	0, 1) })	// shwCmd(elemento, cam1_up_move, cam2_up_move, cam3_up_move, cam4_up_move, cam4_up_stop)
	.drgl(function(){ shwCmd('arrowLs', 6, "left",	"left", 4, 5) })
	.drgr(function(){ shwCmd('arrowRs', 4, "right", "right",6, 7) })
//	.rel (function(){ camStop(); setTimeout(function(){ cp.hide(['arrowDs', 'arrowUs', 'arrowLs', 'arrowRs']) }, 500) })
	.rel (function(){ camStop(); setTimeout( cp.hide, 500, ['arrowDs', 'arrowUs', 'arrowLs', 'arrowRs'] ) })

	var camStopPos;
	function shwCmd(el, cmd1, cmd2, cmd3, cmd5m, cmd5s){
		if (cam.curr == "1") cam.step(cmd1)
		else{ cam.move("", cmd2, cmd3, cmd5m); camStopPos = cmd5s }
		$('#' + el).show()
	}
	function camStop(){
		if (cam.curr == "1") return
		else cam.move("", "stop", "stop", camStopPos)
	}
	//-------------------- xbmcip:
	$('#ip1').btn(function(){ sys.button(1) })
	$('#ip2').btn(function(){ sys.button(2) })
	$('#ip3').btn(function(){ sys.button(3) })
	$('#ip4').btn(function(){ sys.button(4) })
	$('#ip5').btn(function(){ sys.button(5) })
	$('#ip6').btn(function(){ sys.button(6) })
	if (!mobile){
		$('#ip7'	).btn(function(){ sys.button(7) })
		$('#ip8'	).btn(function(){ sys.button(8) })
		$('#ip9'	).btn(function(){ sys.button(9) })
		$('#ip10'	).btn(function(){ sys.button(10) })
		$('#wolBtn' ).btn(function(){ sys.wol() })
	}

	$('#xbmcOn') .btn(function(){ bt.kodiOn(function(){}) })		// xbmc on
	$('#xbmcOff').btn(function(){ bt.kodiOff(function(){}) })		// xbmc off

	// all on:
	$('#allOn').btn(function(){
		li.clear('l50000');											// limpar lista de mensagens
		if (sys.ht || sys.sala){									// Home Theater ou sala
		  rx.inEn(0);												// desabilite a leitura cíclica das entradas
		  dv.pcOn(function(){ 										// ligue o PC
			dv.rcvOn(function(){									// ligue o receiver
			  cp.msgStart("Selecionar entrada do receiver", true);
			  dv.rcvIn(function(){									// selecione entrada DVD do receiver
			  	if (sys.sala){ onComplete(); return };
				dv.prjOn(function(){								// ligue o projetor
				  cp.msgStart("Baixar tela de projeção", true);
				  rx.cmd(1, 1, 4, '', 0, function(){				// baixa tela de projeção (liga rele 4)
					cp.msgStart("Ajustar Luz para 25%", true);
					rx.sendIR(1, 2, luz.v25, '', 1, function(){		// set luz em 25%
					  cp.msgStart("Reduzir luz em 1 nivel", true);
					  rx.sendIR(1, 2, luz.dn, '', 1, function(){	// reduza luz 1 passo
						cp.msgStart("Reduzir luz em 1 nivel", true);
						rx.sendIR(1, 2, luz.dn, '', 1, function(){	// reduza luz 1 passo
						  onComplete()
						})
					  })
					})
				  })
				})
			  })
			})
		  })
		}else{
		  dv.pcWON();	// ligue o PC
		  onComplete()
		}

		function onComplete(){
			rx.inEn(1); 	// habilite a leitura cíclica das entradas
			som.ding(); cp.msgStart("carregando Windows, aguarde!", true);
			sys.waitKodi()
		}
	})

	// all off:
	$('#allOff').btn(function(){
		li.clear('l50000');										// limpar lista de mensagens
		if (sys.ht || sys.sala){
		  rx.inEn(0);											// desabilite a leitura cíclica das entradas
		  dv.pcOff(function(){									// desligue o PC
			dv.rcvOff(function(){								// desligue o receiver
			  if (sys.sala){ offComplete(); return };
			  dv.prjOff(function(){								// desligue o projetor
				cp.msgStart("Recolher tela de projeção", true);
				rx.cmd(1, 0, 4, '', 0, function(){				// levanta tela de projeção (desliga rele 4)
				  cp.msgStart("Ajustar Luz para 50%", true);
				  rx.sendIR(1, 2, luz.v50, '', 1, function(){	// set luz em 50%
					cp.msgStart("Aumentar luz em 1 nivel", true);
					rx.sendIR(1, 2, luz.up, '', 1, function(){	// aumente luz 1 passo
					  offComplete()
					})
				  })
				})
			  })
			})
		  })
		}else{
			bt.pcSusp(function(x){ offComplete() })
		}

		function offComplete(){
			rx.inEn(1);
			if (!$("#ledOnOff2").hasClass("on") && !$("#ledOnOff4").hasClass("on") && !(sys.ht && $("#ledOnOff5").hasClass("on")) ){	// se receiver e pc desligados...
				som.ding(); cp.msgStart("Desligamento total concluido", true)
			}else setTimeout(offComplete, 200)
		}
	})

	$('#projOnOff').btn(function(){ bt.prjPower() })	// on/off projetor
	$('#rcvOnOff') .btn(function(){ bt.rcvPower() })	// on/off receiver
	$('#pcOnOff')  .btn(function(){ bt.pcPower()  })	// on/off PC
	//-------------------- playlist
	$('#shufButton')  .btn(function(){ pl.shuffle() })
	$('#unshufButton').btn(function(){ pl.unshuffle() })
	$('#plylstClear') .btn(function(){ pl.clear(function(){}) })
	$('#plylstOpen')  .btn(function(){ pl.load() })
	$('#d39')		  .btn(function(){ pl.show(true) })	// botão playlist
	//-------------------- transport (CR, play, stop e CF)
	$('#d37').btn(function(){ kd.cr() })
	$('#d33').btn(function(){
		cam.vidE.is(':visible') ? ( cam.vidE[0].paused ? cam.vidControl().play() : cam.vidControl().pause() ) :
			sys.server ? ( sv.pauseBtn ? C$("#" + sv.audioInfo.Src).play() : C$("#" + sv.audioInfo.Src).pause() ) :
				kd.pause();
		sv.pauseBtn = true
	})
	$('#d35').btn(function(){
		cam.vidE.is(':visible') ? cam.vidE[0].src = null :
			sys.server ? C$("#" + sv.audioInfo.Src).pause() :
				kd.stop() });
		sv.isPlaying.pos = null
	$('#d38').btn(function(){ kd.cf() })
	//-------------------- exclusivos de iPad e Windows
	if (!mobile){	// iPad ou PC

	//	hamTap('d46', function(){$(('#d46').texto(1);cam.patrol(20)})	// cam 1, mov. lento
	//	hamTap('d47', function(){$(('#d47').texto(1);cam.patrol(5)})	// idem, rápido
		$('#pwrbtn').btn(function(){ set.inic(wan) })
		$('#btnjpg').btn(function(){ cam.setFnc(cam.curr) })	// cam modo jpg
		$('#btnmag').btn(function(){ cam.setMag() })			// cam modo magnify
		$('#escBtn').btn(function(el){							// "esc"/"Graf"
			if (sys.server){
				el.texto($(el).hasClass('on') ? 0 : 1)
				$(sv.audioInfo["AudElement"]).analyser($(el).hasClass('on'))
			}else kd.input("ESC")
		})
		$('#infBtn').btn(function(el){							// "INFO"/"Loud"
			if (sys.server){
				el.texto($(el).hasClass('on') ? 0 : 1)
				$("#audDir0, #audDir1").loudness($(el).hasClass('on'))
			}else Ekd.info()
		})
		$('#cpsBtn').btn(function(el){							// botão ativa/desat. compressor
			if (sys.server){
				el.texto($(el).hasClass('on') ? 0 : 1)
				$("#audDir0, #audDir1").compressor($(el).hasClass('on'))
			}
		})
		$('#memBtn').btn(function(){ pl.setMo() })				// modo memo on/off
		$('#dirBtn').btn(function(){ iSpy() })					// testes
		$('#srvBtn').btn(function(){ dir.srv() })				// acesso ao diretório dor servidores
		$('.subUp').btn(function(){ bt.chnUp() })				// receiver subwoofer +
		$('.subDn').btn(function(){ bt.chnDn() })				// rec. subwoofer -
		$('.volUp').btn(function(){ bt.volUp() })				// rec. vol. +
		$('.volDn').btn(function(){ bt.volDn() })				// rec. vol. -
		$('#prjOn') .btn(function(){ dv.prjOn(function(){}) })	// liga projetor
		$('#prjOff').btn(function(){ dv.prjOff(function(){}) })	// desliga projetor
		$('#relStatus').btn(function(){ rx.releStatus() })		// lê status dos relés RFX9600
/*		$('#minifier').btn(function(){
			cp.setLoading();
			cp.minifier('../script/cp_gerais.js', function(x){
				cp.readWrite("../script/cp_gerais.min.js", x, "w", "", function(){cp.rstLoading()})
			})
		})*/
		function setArrow(el, cmd1, cmd2, cmd3, cmd5m, cmd5s){
			$('#' + el)
			.on(touchDev ? 'touchstart' : 'mousedown',	function(){ if (cam.curr == "1") { cam.step(cmd1) } else cam.move("",  cmd2 ,  cmd3 , cmd5m) })
			.on(touchDev ? 'touchend'	: 'mouseup'  ,	function(){ if (cam.curr == "1") { return		  } else cam.move("", "stop", "stop", cmd5s) })
		}
		setArrow('arrowD', 0, "down", "down", 2, 3)	// mov.cam. "down" (seta cam1, cam2, cam3, cam5-move e cam5-stop)
		setArrow('arrowU', 2, "up",	  "up",   0, 1)	// idem "up"
		setArrow('arrowL', 6, "left", "left", 4, 5)	// idem "left"
		setArrow('arrowR', 4, "right","right",6, 7)	// idem "right"

		$('#legBtn').btn(function(){ kd.legenda() })
		$('#audBtn').btn(function(){ kd.audio() })
		$('#timeBar').fadeOut()	// HMS da barra de tempo

		$('#d305').btn(function(){
			if(mainPag ) fi.sourcesListAnim('file')
			if(musicPag) fi.getSource('music')
			if(videoPag) vi.explorerBtn()
		})

		$("#d2306").hide()	// campo texto de procura de músicas
		$("#d2307").hide()	// campo texto arquivo memolist
		$("#s41").keyup(function(){ sk.input($(this).val()) }) // exec. p/ cada letra digitada
		$("#s61").keyup(function(){ sk.key  ($(this).val()) })
		$('#d303').btn(function(){ sk.lupa() })
		$('#d304').btn(function(){ sk.btnRefresh(function(){}) })
		$('#nomPat').btn(function(){ sk.btnAux('nomPat', 'nome', 'path / nome') })
		$('#nomePath').btn(function(){ sk.btnAux('nomePath', 'nome', 'path / nome') })
		$('#libProp').btn(function(){ sk.btnAux('libProp','música','artista') })
		$('#arqDup').btn(function(){ sk.dupFlg = true; sk.key('') })
		$('#musDup').btn(function(){ sk.dupFlg = true; sk.input('') })
	//-------------------- canvas page
		$('#solarBtn').btn(function(){ $('#canvas').camSave().cloth(false).imgMx().solar(true)} )
		$('#clothBtn').btn(function(){ $('#canvas').camSave().solar(false).imgMx().cloth(true)} )
		$('#osc').btn(function(el){
			el.texto($(el).hasClass('on') ? 0 : 1)
			$('#audDir0').oscillator($(el).hasClass('on'));
		})
		$('#audVol').btn(function(){ $('#audDir0, #audDir1').audioVol(-0.5) })
		$('#vdVol').btn(function(){ $('#vidCam').audioVol() })
	//	$('#imgMxBtn').btn(function(){ $('#canvas').cloth(false).solar(false).imgMx(717, 8, 640, 360, 'im2')} )
		$('#camSp1Btn').btn(function(){ $('#vidTst1').camSave('cam1', 'stop')} )
		$('#camRc1Btn').btn(function(){ $('#vidTst1').camSave('cam1', 'rec', cam.snap1, 640, 480, 10, false, false)} )
		$('#camSp2Btn').btn(function(){ $('#vidTst2').camSave('cam2', 'stop')} )
		$('#camRc2Btn').btn(function(){ $('#vidTst2').camSave('cam2', 'rec', cam.snap2, 640, 480, 10, false, false)} )
		$('#camSp3Btn').btn(function(){ $('#vidTst3').camSave('cam3', 'stop')} )
		$('#camRc3Btn').btn(function(){ $('#vidTst3').camSave('cam3', 'rec', 'http://admin:solrac@192.168.1.36/snapshot?strm=0', 640, 360, 10, false, true)} ) // cam.strm3
	}
	//-------------------- sliders (CPslider aplicado em 02/02/15)
	// barra/slider de tempo:
	$("#a112").CPslider({
		max: 1000,
		step: 2,
		start: function(e){ $('#timeBar').fadeIn(); mostreTimeBar(e.value); kd.seekDown = true },
		slide: function(e){ mostreTimeBar(e.value); if (kd.seekEnable) kd.seek(e.value) },
		stop:  function(e){ $('#timeBar').fadeOut(); kd.seek(e.value); kd.seekDown = false }
	});
	// HMS da barra de tempo:
	function mostreTimeBar(value){
		if(curPag == "xbmcmainMblPage")	var ctePos = -4,  hmsPos = value * 32 / 100
		else							var ctePos = -27, hmsPos = value * 55 / 100;
		C$("#timeBar1").style.left = ctePos + hmsPos +		'px';	// posicione imagem de fundo HMS
		C$("#timeBar2").style.left = ctePos + hmsPos + 4 +	'px';	// posicione texto HMS
		$("#timeBar2").texto(cp.StoHMS(parseInt(kd.secTime * value / 1000, 10)))	// mostre HMS da barra de tempo
	}
	// teste:
	if(!mobile) $("#a115").CPslider({
		value: 30,
		max: 100,
		step: 4,
		start:	function(e){ txtSld("start: " + e.value); cp.setLoading(true);	$('#a116').CPslider({value: e.value}) },
		slide:	function(e){ txtSld("slide: " + e.value);						$('#a116').CPslider({value: e.value}) },
		stop:	function(e){ txtSld("stop: "  + e.value); cp.rstLoading();		$('#a116').CPslider({value: e.value}) }
	});
	var tmrSl
	function txtSld(a){ $('#v115').texto(a); clearTimeout(tmrSl); tmrSl = setTimeout(function(){ $('#v115').texto("") }, 200) }
	// volume:
	$("#a114").CPslider({
		orientation: "vertical",
		max: 100,
		step: 5,
		start: function(e){ kd.volume(e.value); kd.volDown = true },
		slide: function(e){ if (kd.volEnable && !sys.name != "WEB") kd.volume(e.value) },
		stop:  function(e){
					kd.volume(e.value); kd.volDown = false;
					if (sys.server){
						dadoMem.locVol = cam.locVol;
						cp.dataStore(dadoMem, function(){})
					}
				}
	});
	// progresso:
	$("#a116").CPslider({
	//	orientation: "horizontal",	// def.: horizontal
	//	range:	"min",				// def.: "min"
	//	min: 1,						// def.: 1
	//	value: 1,					// def.: min (1)
	//	step: 1,					// def.: 1
	})

	//-------------------- controle de scroll de listas (inicio/fim) bloqueia tela
	$(document).on('touchmove', function(e){
		e.preventDefault();	// iOS, desabilita scroll da página
	}).ready(function(){
		$('.scrollable').blockList()	// jquery.carlos.js
	})

	//-------------------- touch events de listas
	$('#l22005')					 						// Botão-lista "video"
	.tap  (function(x){ var e = x.path; if (e) vi.library(cp.UTF8(e))} )// Botão-lista mostra dados do filme
	.dbtap(function(x){ var e = x.path; som.ding(); kd.play(e) })		// Botão-lista toca o filme

	$('#l12002').tap(function(x){							// Botão-lista "fontes"
		fi.btnSources(x.path)
	})

	$('#l12005').tap(function(x){							// Botão-lista "files"
		var e = x.path;
		if (e.substr(0, 1) == "["){	// path-array
			var array = $.parseJSON(cp.decChar(e)), a0 = array[0], a1 = array[1];
			if (a0 == "addAll")		pl.addAll(a1);
			if (a0 == "setAll")		pl.setAll(a1);
			if (a0 == "manualAdd")	sino.manualAdd(a1, array[2], array[3]);
			if (a0 == "match")		sino.matchList(a1, array[2], array[3], array[4]);
		}else fi.btnFiles(e)
	})

	$('#l25005').tap(function(x){							// Botão-lista "files-music"
		var e = x.path;
		if (e.substr(0, 1) == "["){	// path-array
			var array = $.parseJSON(cp.decChar(e)), a0 = array[0], a1 = array[1];
			if (a0 == "addAll")		pl.addAll(a1);
		}else fi.btnFiles(e)
	})

	$('#l24005').tap(function(x){ fi.btnFiles(x.path) })	// botão-lista thumbs de música

	$('#l12007').tap(function(x){							// Botão-lista "playlist"
		var e = x.path;
		if (e.substr(0, 1) == "["){	// path-array
			var array = $.parseJSON(cp.decChar(e)), a0 = array[0], a1 = array[1];
			if (a0 == "delItem")	pl.delItem (a1, x.index);
			if (a0 == "movItem")	pl.moveItem(a1, array[2], x.index);
		}else pl.listBtn(e, x.index)

		return
		if (e.substr(0, 11) == 'pl.delItem(' || e.substr(0, 11) == 'pl.delMemo(') { e = e.substr(0, e.length - 1) + ',' + x.index + ')'; (Function(e))() }
		else	if (e.substr(0, 12) == 'pl.moveItem(') { e = e.substr(0, e.length - 1) + ',' + /*x.idx*/x.index + ')'; (Function(e))() }
				else pl.listBtn(e, x.index)
	})

	$('#l20013').tap(function(x){ dispAtor(x) })			// Botão-lista "atores"

	$('#ldir').tap(function(x){ dir.idxLin = x.index; dir.exeItem(x.name, x.lang, x.path) })	// Botão-lista "diretório"	( "dir.exeItem("ldir","dir","..")" )

	$('#l20005').tap(function(x){ onBtnl20005(x.path) })	// botão-lista arquivos procurados

	$('#l20014').tap(function(x){})							// botão-lista sinopse (video pag)

	$('#l12006').tap(function(x){ onBtnl12006(x.name) })	// botão-lista 1a fila de letras (main pag)

	$('#l12008').tap(function(x){ onBtnl12008(x.name) })	// botão-lista 2a fila de letras (main pag)

	$('#l22007').tap(function(x){ onBtnl22007(x.path) })	// botão-lista letras (music pag)

	$('#l22006').tap(function(x){ onBtnl22006(x.name) })	// botão-lista letras (video pag)

	$('#l23005').tap(function(x){ onBtnl23005(x.path) })	// botão-lista menu explorer (video pag)

	//-------------------- controle de scroll dos thumbs das listas (arquivo, musica e video)
	$('#l22005').on('scroll', function(){ scrollImages(1) });	// inicialize eventos-scrolling na lista de thumbs de vídeo (videoPag)
	$('#l24005').on('scroll', function(){ scrollImages(2) })	// inicialize eventos-scrolling na lista de capas de música (musicPag)
	$('#l12005').on('scroll', function(){ scrollImages(3) })	// inicialize eventos-scrolling na lista de arquivos (mainPag)
	$('#l25005').on('scroll', function(){ scrollImages(4) })	// inicialize eventos-scrolling na lista de arquivos (musicPag)
	var tmrSc;
	function scrollImages(func){
		cp.jsnReqBsy = true;
		clearTimeout(tmrSc); tmrSc = setTimeout(function(){
			func == 1 ? scrl.video() : func == 2 ? scrl.music() : func == 3 ? scrl.file("l12005") : func == 4 ? scrl.file("l25005") : "";
			cp.jsnReqBsy = false
		}, 300);	// scroll parou, execute func
	}
	//-------------------- swipe mouse
	$('#btnHand').btn(function(){ $('#swpMouse').fadeIn(300); $('#a114').hide() })
	// swipe mouse
	cp.hide(['swpMouse', 'arrowDm', 'arrowUm', 'arrowLm', 'arrowRm', 'btn_OK', 'btn_ESC'])

	$('#swpMouse')
	.dtap(function(ev){ shCmd(ev, 'btn_OK',  'OK'	)})
	.htap(function(ev){ shCmd(ev, '',		 'HOLD'	)})
	.drgr(function(ev){ shCmd(ev, 'arrowRm', 'RIGHT')})
	.drgl(function(ev){ shCmd(ev, 'arrowLm', 'LEFT' )})
	.drgu(function(ev){ shCmd(ev, 'arrowUm', 'UP'	)})
	.drgd(function(ev){ shCmd(ev, 'arrowDm', 'DOWN'	)})
	.drot(function(ev){ shCmd(ev, 'btn_ESC', 'ESC'	)})

	function shCmd(ev, elem, cmd){
		if (ev.pageX > (mobile ? 310 : set.tabDev ? 804 : 955) && ev.pageY < (mobile ? 270 : set.tabDev ? 239 : 415)) return;	// área do botão "cancel"
		if (elem){
			kd.input(cmd); /*cp.msgErr(cmd, false, true)*/
			$('#' + elem).show(1).delay(500).hide(1)
		}else{	// 'Hold'
		}
	}

	//-------------------- outros botões gerais
	$('.explorer_up').btn(function(){ fi.btnFiles(fi.backMenu) })	// botões lista back  (classe .explorer_up)
	$('.video')		 .btn(function(){ fi.getSource("video") })		// botão video source
	$('.music')		 .btn(function(){ fi.getSource("music") })		// botão music source
	$('#logClr')	 .btn(function(){ li.clear("l50000") })			// limpa lista log (xbmcip page)
	$('#d48')		 .btn(function(){ kd.mute() })

	// pages navigation
	$('#d8') .btn(function(){  showPage(mobile ? 'camMblPage' : 'camPage') })						// seleciona pag. cam
	$('#d9') .btn(function(){  inoutPageLoaded=!0; $('#inout').fadeIn(); rx.releStatus() })		// .. in/out
	$('#d14').btn(function(){  $('#arcondPage').fadeIn() })										// .. ar-condicionado
	$('#d10').btn(function(){  showPage(mobile ? 'xbmcipMblPage' : 'xbmcipPage') })				// .. ips
	$('#d13').btn(function(){  sys.loaded(!0, function(s){ if(s)showPage(mobile ? 'xbmcmainMblPage' : 'xbmcmainPage') }) })	// files (main)
	if (!mobile){
		$('#d15').btn(function(){  $('#luzesPage').fadeIn() })										// luzes
		$('#d12').btn(function(){  sys.loaded(!0,function(s){if(s)showPage('xbmcmusicPage')}) })	// music
		$('#d11').btn(function(){  sys.loaded(!0,function(s){if(s)showPage('xbmcvideoPage')}) })	// video
		$('#d16').btn(function(){  showPage('canvasPage') })	// teste
	}
	$('#d7').btn(function(){
		som.swsh()
		$('#d1311').toggleClass('on')			// recolhe/libera menu de navegação
	})
	$("#aviso").btn(function(){ $('#aviso').fadeOut() })
})

//==================================================== biblioteca dv (devices)
var dv = {
  //------------------------ leitura do status dos dispositivos (receiver, projetor e pc)
  tmrS: 0,
  status: function(){	// le ciclicamente entradas power sense do PC, do Receiver e info do Projetor ON/OFF
//	clearTimeout(dv.tmrS); dv.tmrS = setTimeout(dv.status, 1000)
	cp.ledOnOff("ledInput", false);
	$('#showRfxRes').texto("")
	if (!ipPag || (!sys.ht && !sys.sala)) { statusLoop(); return };
	if (rx.inEnable) rx.cmd(rx.sys, 3, 1, '', 0, function(dado){	// le entrada 1 (PC power sense)
		cp.btnLedOnOff("ledOnOff4", dado);							// se ON ascenda led do botão HTPC (ledOnOff4)
		if (rx.inEnable) rx.cmd(sys.sala ? 4 : 1, 3, 2, '', 0, function(dado){		// le entrada 2 (Receiver power sense)
			cp.btnLedOnOff("ledOnOff2", dado);	
			cp.ledOnOff("ledInput", true)							// se ON ascenda led do botão RECVER (ledOnOff2)
			if (sys.sala) { clearTimeout(dv.tmrS); dv.tmrS = setTimeout(dv.status, 300); return }	// se sistema "sala", não leia serial
			if (rx.inEnable) dv.prjPowerStatus(function(){			// le porta serial do projetor e se on ascenda led
				clearTimeout(dv.tmrS); dv.tmrS = setTimeout(dv.status, 150)
			})
			else statusLoop()
		})
		else statusLoop()
	})
	else statusLoop()
	function statusLoop(){ clearTimeout(dv.tmrS); dv.tmrS = setTimeout(dv.status, 1000) } 
  },
  //------------------------ Receiver ON e OFF
  rcvOn: function(callback){
	dv.pcRcvStatus("Receiver", "power sense do Receiver", 2, "ON", function(dado){		// se desligado ligar
		if (dado){ sys.ht	?	rx.sendIR(1, 1, pan.power, 0, 1, callback)	:	rx.sendIR(4, 1, pio.on, 0, 1, callback) }	// liga receiver
		else callback(dado)
	})
  },
  rcvOff: function(callback){
	dv.pcRcvStatus("Receiver", "power sense do Receiver", 2, "OFF", function(dado){		// se ligado desligar
		if (dado){ sys.ht	?	rx.sendIR(1, 1, pan.power, 0, 1, callback)	:	rx.sendIR(4, 1, pio.off, 0, 1, callback) }	// desliga receiver
		else callback(dado)
	})
  },
  //------------------------ PC ON e OFF
  pcOn: function(callback){
	dv.pcRcvStatus("PC", "12v do PC", 1, "ON",function(dado){					// se desligado ligar, senão desligar
		if (dado) rx.pulsoRele(rx.sys, 1, 800, callback)	// pulso de 800ms no relé 1 (PowerON CPU)
		else callback(dado)
	})
  },
  pcOff: function(callback){
	dv.pcRcvStatus("PC", "12v do PC", 1, "OFF", function(dado){					// se desligado ligar, senão desligar
		if (dado) rx.pulsoRele(rx.sys, 1, 800, callback)// pulso de 800ms no relé 1 (PowerOFF CPU)
		else callback(dado)
	})
  },
  pcWON: function(){ sys.wakeOnLan(sys.macadd) },
  //------------------------ verifica status de entrada (ligado/desligado), mensagem: ligar/desligar  PC/Receiver/Projetor
  pcRcvStatus: function(equipamento, errMsg, entrada, status, callback){
	rx.cmd(rx.sys, 3, entrada, '', 0, function(dado){	// lê "entrada"
		if (dado === null){ cp.msgErr("erro leitura " + errMsg, true); callback(false) }
		else{
			if (status == "ON"){
				if (!dado)	{ cp.msgStart("Ligar " + equipamento, true);				callback(true) } 
				else		{ cp.msgStart(equipamento + " já estava ligado", true);		callback(false) }
			}else{
				if (dado)	{ cp.msgStart("Desligar " + equipamento, true);				callback(true) }
				else		{ cp.msgStart(equipamento + " já estava desligado", true);  callback(false) }	
			}
		}
	});
  },
  //------------------------ Projetor ON e OFF
  prjPower: function(x, callback){	// se x = "0" desligar projetor ("~0000 0"+CR); se x = "1" ligar projetor ("~0000 1"+CR)
	if (rx.serialRfx)
		rx.cmd(1, 5, 1, "\x7E\x30\x30\x30\x30\x20" + x + "\x0D", "", callback)	// via RFX9600
	else
		rs.cmd("\x7E\x30\x30\x30\x30\x20" + x + "\x0D", callback)				// via RS232-TCPIP módulo
  },
  prjOn: function(callback){
	dv.prjPowerStatus(function(dado){
		if (dado != null){
			if (dado === false) { cp.msgStart("Ligar Projetor", true); dv.prjPower("1", callback) }	// ligar projetor (se ligou = PINFO1)
			else				{ cp.msgStart("Projetor já estava ligado", true); callback(dado) }
		}else callback(dado)
	})
  },
  prjOff: function(callback){
	dv.prjPowerStatus(function(dado){
		if (dado != null){
			if (dado === true)	{ cp.msgStart("Desligar Projetor", true); dv.prjPower("0", callback) } // desligar projetor (se desligou = PINFO2)
			else				{ cp.msgStart("Projetor já estava desligado", true); callback(dado) }
		}else callback(dado)
	})
  },

  prjPowerStatus: function(callback){	// se powerON = true, powerOFF = false, sem dado = null
	if (rx.serialRfx){
		rx.cmd(1, 5, 1, "\x7E\x30\x30\x31\x32\x34\x20\x31\x0D", "", function(){  // "~00124 1"+CR (Power State) - solicita informação ao projetor
			rx.cmd(1, 10, 1, "", "", function(x){	// le serial buffer do RFX9600, resposta da solictação de informação
				if (x){
					if (x.substr(0, 2) != "OK"){ 
						cp.msgErr("erro dado serial projetor: " + x, true); x = null }
					else cp.btnLedOnOff("ledOnOff5", x = x.substr(2, 1) == "1")	// verifica 'a'(3º byte) de OKn, onde n = 0/1 = Off/On
				};
				callback(x)
			})
		})
	}else{
	var code = "\x7E\x30\x30\x31\x32\x34\x20\x31\x0D";
		rs.cmd(code, function(x){	// "~00124 1"+CR (Power State) - solicita informação ao projetor
			if (x){
				if (ipPag) $('#showRfxRes').text('cmd: ' + code + '\nTCP232\n==> ' + x);
				if (x.substr(0, 2) != "OK"){ if (ipPag) cp.msgErr("erro dado serial projetor: " + x, true); x = null }
				else cp.btnLedOnOff("ledOnOff5", x = x.substr(2, 1) == "1")	// verifica 'a'(3º byte) de OKn, onde n = 0/1 = Off/On
			};
			callback(x)
		})
	}
  },
  //------------------------ receiver input set
  rcvIn: function(callback){
	rx.sendIR(rx.sys, 1, sys.ht ? pan.dvd : pio.vcr, '', 1, callback)
  },
  //------------------------ parâmetros 3D para o projetor
  mode3D: false,
  chk3D: function(fileName){
	if (fileName.search(/(3DSBS)/) != -1)	{ setTimeout(function(){ prjSerial("405 1") }, 1000); dv.mode3D = true; return };	// 3D, SBS
	if (fileName.search(/(3DOU)/ ) != -1)	{ setTimeout(function(){ prjSerial("405 2") }, 1000); dv.mode3D = true; return };	// 3D, OU
	if (dv.mode3D) 							{ setTimeout(function(){ prjSerial("405 0") }, 1000); dv.mode3D = false }			// 2D
	function prjSerial(cmd){
		if (kd.playTime == "00:00:00") kd.input("ESC");	// apaga msg-box "select 3D playback mode"
		if (rx.serialRfx)
			rx.cmd(1, 5, 1, "\x7E" + "00" + cmd + "\x0D", "", function(){})
		else
			rs.cmd("\x7E" + "00" + cmd + "\x0D", function(){})
  	}
  },
}




//==================================================== biblioteca bt (botões)
var bt = {
  //------------------------ comandos/botões dispositivos multimidia (receiver, projetor, pc...)
  volUp:	function(){ sys.ht	?	rx.sendIR(1, 1, pan.volUp, 0)	:	rx.sendIR(4, 1, pio.volUp, 0) },
  volDn:	function(){ sys.ht	?	rx.sendIR(1, 1, pan.volDn, 0)	:	rx.sendIR(4, 1, pio.volDn, 0) },
  chnUp:	function(){ rx.sendIR(1, 1, pan.up, '') },
  chnDn:	function(){ rx.sendIR(1, 1, pan.Dn, '') },
  rcvPower: function(){ sys.ht	?	rx.sendIR(1, 1, pan.power, 0)	:	rx.sendIR(4, 1, pio.power, 0) },
  pcPower:	function(){
	rx.inEn(0);
	rx.pulsoRele(rx.sys, 1, 800, function(){ rx.inEn(1) })	// pulso no relé 1, rfx 1 ou 4
  },
  prjPower:	function(){
	rx.inEn(0);
	setTimeout(function(){
		dv.prjPowerStatus(function(dado){
			if (dado === false) dv.prjPower("1", function(){ rx.inEn(1) });
			if (dado === true ) dv.prjPower("0", function(){ rx.inEn(1) })
		})
	}, 500)
  },
  //------------------------ Botão "PC OFF" / desligue PC
  pcSusp: function(callback){
	cp.msgStart("Suspendendo servidor...", true);
	cp.jsonRequest("System.Suspend", "", callback)
  },
  //------------------------ Botão "XBMC ON"
  kodiOn: function(callback){
	cp.msgStart("Carregando XBMC...", true);
	cp.eventGhost(ip.xbmc, "XBMC_ON", function(x){
		x = (/\"999.txt\"/.test(x) || x == "") ? "OK" : null
		cp.msgStart(x);
		callback(x)
	})
  },
  //------------------------ Botão "XBMC OFF"
  kodiOff: function(){
	cp.jsonAjax("JSONRPC.Version", "{}", wan ? 9999 : 2000, '', function(x){
		if ( x && x != 'timeout' && !/Connection refused/.test(x) ){
			kd.jsonVer = $.parseJSON(x)["result"]["version"]["major"];		// Frodo
			if (!kd.jsonVer) cp.msgStart("Versão do XBMC não é Frodo !", true);// Dharma e Eden
			cp.msgStart("Desligando XBMC...", true);
			cp.jsonRequest('Application.Quit', "", function(x){ cp.jsonResMsg(x) })
		}else cp.msgStart("XBMC já estava desligado", true);
	})
  },
  //------------------------ bouncing effect dos botões de mídia "video" e "musica"
  bounce: function(){
	som.popy()

	$('#d30001')
	.bub('', 	'on1',	100)
	.bub('on1',	'on',	300)
	.bub('on',	'on2',	450)
	.bub('on2',	'on3',	600)
	.bub('on3',	'', 	750)

	$('#d30002')
	.bub('', 	'on1',	200)
	.bub('on1', 'on',	400)
	.bub('on',	'on2',	550)
	.bub('on2', 'on3',	700)
	.bub('on3', '', 	850)
  }
}