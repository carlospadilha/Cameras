// setup de variáveis do sistema:
var wan, relSta, mobile=true, sinopse=false, xbmcPage=false, inoutPageLoaded=!1, curPag=oldPag='xbmcipMblPage', camPag=true, ipPag=false, mainPag=false, musicPag=false, videoPag=false,
	chromeApp = false;

$(document).ready(function(){
	$('#rstImg').div([
	'txt5','pl5 pt30',,,,
	'aud5','pl5 pt5 oh',,,,
	'img5','pl5',,60,,
	])

	for(var i=1,j=11,k=8;i<7;i++,j+=52){
		if(i==4){k=206;j=11}
		$('#ipBtns')[0].innerHTML+=
		'<div class="abs b1" style="left:'+k+'px;top:'+j+'px"><div id="ip'+i+'" class="button"><div class="height"><div id="ipB'+i+'" class="inner"></div><span></span></div></div></div>';
	}

	var volElmt=$("#vol");
	volElmt.fadeOut(200);
	function showVolBut(){
		var volElmt=$("#vol");
		if (!volElmt.is(':visible')) volElmt.fadeIn(200) // se elemento visível,...
		else						 volElmt.fadeOut(200);
	}

	$('#swm').img([
	'arrowUm','img/arrow-5-up_w.png','abs',50,0,,,
	'arrowRm','img/arrow-5-right_w.png','abs',135,50,,,
	'arrowDm','img/arrow-5-down_w.png','abs',50,135,,,
	'arrowLm','img/arrow-5-left_w.png','abs',0,50,,,
	'btn_OK','img/btn_OK_w.png','abs',57,54,70,70,
	'btn_ESC','img/btn_ESC_w.png','abs',44,56,100,70
	])

	$('#sw').img([
	,'img/hand_drag.png','abs',61,10,80,90,
	,'img/hand_tap.png','abs',151,10,80,90,
	,'img/hand_pinch.png','abs',241,10,80,90
	])

	for(var i=11,j=10;i<23;i++,j+=20)$('#leds')[0].innerHTML+='<div id="d20'+i+'" class="led" style="left:'+j+'px"></div>'

	// ajusta a largura do documento
	if(!/(iPad|Windows)/g.test(navigator.userAgent)){		// screenWidth:	400 (Samsung Note) no Safari, 980 (Samsung Note 3)
		$('meta[name=viewport]').attr('content', 'width='+$(window).width())
	}
	var e=C$("#d1306"), i=1;
	for(;i<9;i++)e.innerHTML+='<div class="blockG" id="rotateG_0'+i+'"></div>';
	$('#d1306').hide();	// esconda "loading"
//	document.form1.elements['user'].focus()	// posiciona cursor no campo usuário

})
// levanta tela 10 pixels no tablet
//if(/Android/g.test(navigator.userAgent)) window.addEventListener('load', function(e){setTimeout(function(){ window.scrollTo(0, 20)}, 1)}, false);

function showPage(shown){
	if(shown==curPag)return;
	$('#'+shown).fadeIn();
	oldPag=curPag;
	$('#'+oldPag).fadeOut();
	curPag=shown;

	cp.remOn(['d8', 'd10', 'd13']);
	$("#d34").hide();	// esconda sinalizador kd.refreshInfo()

	var loadng=C$("#d1305");	// loading

	if(camPag=shown=='camMblPage'){
		if (cam.com) cam.show(cam.curr);	// mostre a camera corrente (apagada qdo. mudou de página)
		cp.addOn(['d8'])	// ative ícone da página "camPage"
		$('#d1330').css({left:8, top:536});	// box mensagem de erro: posicione
		$('#d1305').hide()	// esconda "loading"
	};
	if(ipPag=shown=='xbmcipMblPage'){
		$('#d10').addClass("on");	// ative ícone da página "xbmcipMblPage"
		$('#d1330').css({left:8, top:102});
		$('#d1305').hide();	// esconda "loading"
		sys.inicXbmcip()	// reinicie "xbmcip.js"
	};
	if(mainPag=shown=='xbmcmainMblPage'){
		kd.lastFile="x";	// faça kd.refreshInfo atualizar status
		$('#d13').addClass("on");	// ative ícone da página "xbmcmainMblPage"
		$('#d1330').css({left:8, top:102});
		loadng.style.left="270px"; loadng.style.top="450px";
		inicCamMainPag()	// inicializa as câmeras de mainPag e kd.refreshInfo
	}else xbmcOn=false;
	if(musicPag=shown=='xbmcmusicMblPage'){};
	if(videoPag=shown=='xbmcvideoMblPage'){};
	if(shown!="camMblPage"){
		sys.pages();	// mostre/esconda HT buttons
		fi.inicMain()
	}
}

$(document).ready(function(){	// 1ª vez rodando...
	cp.hide([
		'xbmcipMblPage','xbmcmainMblPage', 'arcondPage', 'inout',
		'd2405',	// botões "transport" e barra de tempo
		'd1330',	// box da mensagem de erro
		'aviso',
		'd1304',	// lista playlist
		'timeBar', // HMS da barra de tempo
		'camImg', 'vlc', 'vidCam',	// câmeras
		'login'	// pág. login
	]);
})
