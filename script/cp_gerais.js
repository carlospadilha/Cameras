//==================================================== biblioteca som
var clicMp3;
$(document).ready(function(){
	cp.postForm('php/streamRead.php?file=../sound/clic.mp3', null, 15000, false, true,
		function(blob){
			if (blob && blob != "timeout"){
				clicMp3 = (window.URL || window.webkitURL).createObjectURL(blob)/* 'data:audio/mp3;base64,' + btoa(blob); */;
			}else	{ cp.msgErr("clic.mp3 erro"); }
		}, 
		function()	{ cp.msgErr("clic.mp3 timeout"); }
	);
});



//------------------ cria variável-som
  function Sound(opt_loop/*, callback*/) {
	var self_ = this, context_ = null, source_ = null, loop_ = opt_loop || false;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if (window.AudioContext) context_ = new window.AudioContext();

	this.load = function(url, mixToMono/*, opt_callback*/){	// mixToMono: true, If the sound should be mixed down to mono
		if (context_) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = function() {
				context_.decodeAudioData(this.response, function(audioBuffer){
					self_.sample = audioBuffer;
					/*callback && callback();*/
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

var som = {
  clic_: new Sound(false),
//------------------ carrega elem.src com "sound/...mp3"
  aud: function(src, vol){
	var aud = new Audio();
	aud.src = src;
	if (!isSafari) aud.volume = vol;
	return aud;
  },
  swsh: function() { som.aud("sound/swoosh.mp3",	0.5).play() },
  popy: function() { som.aud("sound/pop1.mp3",		0.3).play() },
  spon: function() { som.aud("sound/SpeechOn.mp3",	0.7).play() },
  ding: function() { som.aud("sound/Ding.mp3",		0.9).play() },
  err:	function() { som.aud("sound/Notify2.mp3",	0.5).play() },
  er:	function() { som.aud("sound/Notify.mp3",	0.3).play() },
  clic: function() { som.aud(clicMp3,		0.3).play() }
};

som.clic_.load('sound/clic.mp3', false)



//==================================================== biblioteca img (imagens)
var img = {
  error:	' onerror=this.src="img/blank.png"',
  blank:	"img/blank.png",
  hand:		"img/hand.png",
  folder:	"img/folder2.png",
  mus:		"img/music.png",
  vid:		"img/menu_cam_on.png",
  plOff:	"img/disc_31_off.png",
  plOn:		"img/disc_31_on.png",
  plOffMoOn:"img/disc_31_off_blue.png",
  plOnMoOn: "img/disc_31_on_blue.png",
  memo:		"img/disc_40_blue.png"
};




//------------------ status de browsers e dispositivos
var dadoMem = {},
	nav			= navigator.userAgent.toLowerCase(),
	ipadWin		= /ipad|windows/g.test(nav),
	touchDev	= /ipad|iphone|android/g.test(nav),
	bigDev		= /mac|windows/g.test(nav),	// aparelhos grandes (PC, iPad)
	winDev		= /windows/g.test(nav),
	ipadDev		= /ipad/g.test(nav),
	android		= /android/g.test(nav),
	isOpera		= !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,	// converte anything para Boolean:	!!anything
	isFirefox	= typeof InstallTrigger !== 'undefined',
	isSafari	= Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,	// At least Safari 3+: "[object HTMLElementConstructor]"
	isChrome	= !!window.chrome && !isOpera,
	isIE		= /*@cc_on!@*/false || !!document.documentMode;	// At least IE6





//==================================================== biblioteca cp (gerais)
var cp = {
  mediaFilter:	function(x){ return /(.*)(\.mkv|\.mp3|\.MP3|\.mp4|\.avi|\.wma|\.VOB)/.exec(x) },
  encChar:		function(x){ return x.replace(/\'/g, 'zoZ').replace(/\"/g, 'zaZ') },						// encode json e HTML chars	(aspas simples e duplas)
  decChar:		function(x){ return x.replace(/zoZ/g, "'").replace(/zaZ/g, '"') },							// decode json e HTML chars
  timeDate:		function( ){ return +new Date() },															// = return (new Date()).getTime()
  secTime:		function( ){ return cp.timeDate() / 1000 },
  isIdClass:	function(e){ return $(e.substr(0, 1) == "." ? e : "#" + e) },
  UTF8_encode:  function(x){ return unescape(encodeURIComponent(x)) },
  UTF8_decode:  function(x){ return decodeURIComponent(escape(x)) },
  bar1to2:		function(a){ return a.replace(/\\\\/g, "\\").replace(/\\/g, "\\\\") },						// converte "\" para "\\"
  delUltBar:	function(p){ var len = p.length - 1, b = p.substr(len); return (b == "/" || b == "\\") ? p.substr(0, len) : p },	// elimina última barra do path
  pathFolder:	function(p){ return p.substr(0, Math.max(p.lastIndexOf('\\'), p.lastIndexOf('/')) + 1) },	// extraia path do folder
  getJoin:		function(e){ return $('#' + e).attr("class").match(/on/i) == 'on' },						// capture classe 'on' do elemento
  hexToDec:		function(x){ return parseInt(x, 16) },
  isArray:		function(x){ return x && typeof x === 'object' && x.constructor === Array },				// retorna true se x é array
  fadeOutAll:	function(x){ x.forEach(function(item){ $('#' + item).fadeOut() }) },						// fadeOut itens
  hide:			function(x){ x.forEach(function(item){ $('#' + item).hide() }) },							// hide itens
  show:			function(x){ x.forEach(function(item){ $('#' + item).show() }) },							// hide itens
  remOn:		function(x){ x.forEach(function(item){ $('#' + item).removeClass('on') }) },				// removeClass('on') itens
  addOn:		function(x){ x.forEach(function(item){ $('#' + item).addClass('on') }) },					// addClass('on') itens
  clrImg:		function(x){ x.forEach(function(item){ cp.isIdClass(item).attr('src', /*"#"*/"../" + img.blank).hide() }) },	// limpa/esconde imagens	
  blkImg:		function(x){ x.forEach(function(item){ cp.isIdClass(item).attr('src', img.blank).hide() }) },	// blank/esconde imagens
  clrTxt:		function(x){ x.forEach(function(item){ cp.isIdClass(item).texto("") }) },					// limpa campo texto: cp.clrTxt(['..', '..'])
//------------------
  charToHex: function(x){ if (!x) return x; for (var res = "", i = 0, j = x.length; i < j;)			res += cp.decToHex(x.charCodeAt(i++)) + " ";				return res },
//------------------
  charHex:	 function(x){ if (!x) return x; for (var res = "", i = 0, j = x.length; i < j;)			res += cp.decToHex(x.charCodeAt(i++));						return res },
//------------------
  hexToChar: function(x){ if (!x) return x; for (var res = "", i = 0, j = x.length; i < j; i += 2)	res += String.fromCharCode(parseInt(x.substr(i, 2), 16));	return res },
//------------------
  decToHex: function(dec){
	var hex = Number(dec).toString(16).toUpperCase();
	while (hex.length < 2) hex = "0" + hex;
	return hex
  },
//------------------ calcula check sum
  checkSum: function(x){
	for (var i = 2, soma = 0; i < x.length; i++) soma += x.charCodeAt(i);
	return String.fromCharCode(soma % 256)
  },
//------------------ HH:MM:SS ==> segundos
  HMStoS: function(c){
	if (c){
		var H = 0;
		if (c.substr(-6, 1) == ":") H = parseInt(c.substr(-8, 2), 10) * 3600; // (horas)
		c = 						H + parseInt(c.substr(-5, 2), 10) * 60 + parseInt(c.substr(-2, 2), 10)
	}
	return c
  },
//------------------ segundos ==> HH:MM:SS
  StoHMS: function(c){
		c = parseInt(c);
	var h = parseInt(c / 3600) % 24,
		m = parseInt(c /   60) % 60,
		s = c % 60;
	return (h > 0 ? h + ':' : '') + cp.numTo2(m) + ':' + cp.numTo2(s)
  },
//------------------ formata x em duas casas, ex.: x = 3 ==> return 03
  numTo2: function(x){
	  x = parseInt(x);
	  return x < 10 ? '0' + x : x
  },
//------------------ decodifica formato UTF8
  UTF8: function(c){
	if (!c) return c;
	for (var i = -1, found = c.search(/[\xC2-\xF4][\x80-\xBF]/); found >= 0; found = c.substr(i + 1).search(/[\xC2-\xF4][\x80-\xBF]/)){
		i += found + 1;
		if (c.charCodeAt(i) < 224)
			 c = c.substr(0, i) + String.fromCharCode((64	* (c.charCodeAt(i) & 31) +		(c.charCodeAt(i + 1) & 63))								 &  4095) + c.substr(i + 2);
		else c = c.substr(0, i) + String.fromCharCode((4096 * (c.charCodeAt(i) & 31) + 64 * (c.charCodeAt(i + 1) & 63) + (c.charCodeAt(i + 2) & 63)) & 65535) + c.substr(i + 3)
	}
	return c
  },
//------------------ codifica no formato UTF8
  encodeUTF8: function(string){
	string = (string + '').replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	var utftext = "", start = 0, end = 0, stringl = string.length;
	for (var n = 0; n < stringl; n++){
		var c1 = string.charCodeAt(n), enc = null;
		if (c1 < 128) end++
		else 
			if ((c1 > 127)&&(c1 < 2048)) enc = String.fromCharCode((c1 >> 6)|192)  + String.fromCharCode((c1 & 63)|128)
			else						 enc = String.fromCharCode((c1 >> 12)|224) + String.fromCharCode(((c1 >> 6) & 63)|128) + String.fromCharCode((c1 & 63)|128);
		if (enc != null){
			if (end > start) utftext += string.substring(start, end);
			utftext += enc;
			start = end = n + 1
		}
	}
	if (end > start) utftext += string.substring(start, string.length);
	return utftext
  },
//-------------------------- embaralha array
  shuffleArray: function(x){ return x.sort(function(){ return Math.random() > 0.5 ? -1 : 1 }) } ,
//-------------------------- idem, método Durstenfeld ou Fisher-Yates (aka Knuth) (mais eficiente)
  shuffleArray2: function(x){
	var i = x.length, j, aux;
	while (i--){
		j = Math.floor(Math.random() * (i + 1));
		aux  = x[i];	// x[i] <==> x[j]
		x[i] = x[j];
		x[j] = aux;
	}
	return x;
  },
//-------------------------- deleta tag, por ex.:	texto:..<p>xxx</p>..	tag:p	return:..xxx..
  delTag: function(texto, tag){
	var re = new RegExp("<" + tag);
	if (re.exec(texto)){
		if (tag == "br")
			var tagTxt = "<br>"
		else{
			var idxTagFin = texto.indexOf("</" + tag) + 3 + tag.length, tagTxt = texto.substr(0, idxTagFin), idxTag;
			while((idxTag = tagTxt.indexOf("<" + tag)) != -1) tagTxt = tagTxt.substr(idxTag + 1)
			tagTxt = "<" + tagTxt;
		}
		texto = texto.replace(tagTxt, "")
		return cp.delTag(texto, tag)	// recursivo/recorrência, caso haja mais de um elemento <span...></span>
	}else
		return texto;
  },
//-------------------------- deleta multiplos tags (veja cp.deltag())
  delMultiTag: function(texto, tags){
	tags.forEach(function(tagItem){
		texto = cp.delTag(texto, tagItem)
	})
	return texto;
  },
//-------------------------- substitui conteúdo de tag, por ex.:	texto:..<p>xxx</p>..	novoCont:yyy	tag:p	return:..<p>yyy</p>..
  changeContentTag: function(texto, newContent, tag){	// foi implementada em nfo_plot_cont_change.php
	var re = new RegExp("<" + tag); 
	if (re.exec(texto)){
		var idxIni = texto.indexOf("<" + tag),
			idxFin = texto.indexOf("</" + tag),
			texIni = texto.substr(0, idxIni),
			texFin = texto.substr(idxFin)/*,
			tagIni = texto.substr(texto.idxIni)*/;
		return texIni + "<" + tag + ">" + newContent + texFin;
	}else
		return texto;
  },
//-------------------------- formata dados
  // padBeg(6,"0","7a8") will return "0007a8"
  // padBeg(4,"0","Hello") will return "ello" (truncate front)
  // padBeg(6,"-","") will return "------"
  padBeg: function(len, fill, str){
	var l = str.length, cache = {};
	if (l < len){
		if (!cache.hasOwnProperty(fill)) cache[fill] = {};
		return (cache[fill][len - l] || (cache[fill][len - l] = (Array(len - l + 1).join(fill)))) + str
	}
	return (l === len) ? str : str.substring(l - len)
  },
//------------------ verifica se objeto não possui properties
  isObjEmpty: function(obj) {
	for (var p in obj) return false;
	return true;
  },
//------------------
  FindCRC: function(data){
	var CRC = 0xffffffff, chars = "";
	for (i = 0; i < data.length;){
		var char = data.charAt(i++);
		if (char <= "z") chars += char.toLowerCase()
		else 			 chars += char
	}
	data = chars;
	for (var j = 0; j < data.length; j++){
		CRC ^=data.charCodeAt(j) << 24;
		for (var i = 0; i < 8; i++){
			if (unsign(CRC) & 0x80000000) CRC = (CRC << 1) ^ 0x04C11DB7
			else 			     		  CRC <<= 1;
		}
	}
	if (CRC < 0) CRC >>>= 0;
	CRC = CRC.toString(16); while (CRC.length < 8){ CRC = "0" + CRC }
	return CRC

	function unsign(data){ return data >= 0 ? data : data >>>= 0 }
  },
//------------------ ordena por label (do menor para o maior)
  sortByLabel: function(a, b){
	var x = a.label.toUpperCase(),
		y = b.label.toUpperCase();
		x = cp.retiraAcentoW(x);	// tire acentos palavra a
		y = cp.retiraAcentoW(y); 	// tire acentos palavra b
	return ((x < y) ? -1 : ((x > y) ? 1 : 0))	// retorna:	-1 se a < b, 1 se a > b, 0 se a == b
  },
//------------------ ordena por file (do menor para o maior)
  sortByFile: function(a, b){
	var x = cp.fileOfPath(a.file.toLowerCase()),
		y = cp.fileOfPath(b.file.toLowerCase());
	return ((x < y) ? -1 : ((x > y) ? 1 : 0))	// idem
  },
//------------------ ordena por k (do maior para o menor)
  sortByK: function(a, b){
	var x = a.k,
		y = b.k;
	return ((x < y) ? 1 : ((x > y) ? -1 : 0))	// idem invertido
  },
//------------------ ordena por id (do menor para o maior)
  sortById: function(a, b){
	var x = a.id,
		y = b.id;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  },
//------------------ compara strings a e b, se mode==true usa fraseArrayComp(), se mode==false usa strSimilarity(), retorna com "match factor"
  fraseCompare: function(a, b, mode, filme){
	var re = filme ?	/([^ \\,\/&=?.():\[\]-][a-z0-9áàâãäéèêíìóòõúùüç'!º°]*)/g :	// g: filtre todas palavras que começam com [..], exceto [^..]
	  					/([^_ 0-9\\,\/&=?.():\[\]-][a-záàâãäéèêíìóòõúùüç'!º°]*)/g,	// se musica, elimine números também
	filterSplitWordRepeatDelete = function(frase){	// separa e filtra as palavras e elimina palavras em sequencia repetidas
		frase = frase.toLowerCase();
		var aux = cp.mediaFilter(frase); frase = aux ? aux[1] : frase;	// elimina ".mp3", ".mp4", etc..., se houver
		var fraseArray = [], item = [], lastWord = "";
		while (item = re.exec(frase))	// filtre e separe todas palavras conforme re ([..], exceto [^..])
			if (item[1] != lastWord) fraseArray.push(lastWord = item[1]);	// palavra em sequência não é repetida
		return {array: fraseArray, string: fraseArray.join(" ")}
	},
	// criado por Carlos, retorna com valor de similaridade de 0 (totalmente diferente) a 1 (100% similar)
	fraseArrayComp = function(a, b){	// a e b são arrays
		var al = 0, bl = 0;
		a.forEach(function(x){ al += x.length })	// al = nº de letras de a
		b.forEach(function(x){ bl += x.length })	// bl idem b
		if (Math.max(al, bl) == 0) return 1;		// a e b iguais a zero

		var aMai = a.length > b.length, frase1 = aMai ? b : a, frase2 = aMai ? a : b, letSumLen = 0, letTotLen = al < bl ? bl : al, idxWord2 = 0, j = 0;

		frase1.forEach(function(word1){
			j = idxWord2;
			while (j < frase2.length){
				if (word1 == frase2[j++]){
					letSumLen += word1.length;
					idxWord2 = j;
					break
				}
			}
		})
		return letSumLen / letTotLen;
	},
	// obtido de http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
	levDist = function(s, t) {	// http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
		var d = [] /*2d matrix*/, n = s.length, m = t.length;
		if (!n || !m) return m || n;	// se s ou t == nulo, retorna com o comprimento do outro
		for (var i = n; i >= 0; i--) d[i] = [];	//Create an array of arrays in javascript (a descending loop is quicker)
		for (var i = n; i >= 0; i--) d[i][0] = i;
		for (var j = m; j >= 0; j--) d[0][j] = j;

		for (var i = 1; i <= n; i++){	// Step 3
			var s_i = s.charAt(i - 1);
			for (var j = 1; j <= m; j++) {	// Step 4
				if (i == j && d[i][j] > 4) return n;	//Check the jagged ld total so far
				var t_j = t.charAt(j - 1), cost = (s_i == t_j) ? 0 : 1; // Step 5	
				//Calculate the minimum:
				var mi = d[i - 1][j] + 1, b  = d[i][j - 1] + 1, c  = d[i - 1][j - 1] + cost;
				if (b < mi) mi = b;
				if (c < mi) mi = c;
				d[i][j] = mi; // Step 6
				//Damerau transposition:
				if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
			}
		}
		return d[n][m];	// Step 7
	},
	strSimilarity = function(a, b){		// retorna com valor de similaridade de 0 (diferente) a 1 (100% similar)
		var al = a.length, bl = b.length, aMin = al < bl, maior = Math.max(al, bl);
		if (maior == 0) return 1;	// a e b iguais a zero
		return (maior - levDist(aMin ? b : a, aMin ? a : b)) / maior;
	};
/*	if (a == "KC & The Sunshine Band - Shake Your Booty_.mp3" && b == "KC And The Sunshine Band - [Shake, Shake, Shake] Shake Your Booty.mp3")
		var a = a;	// debug*/
	var fraseA = filterSplitWordRepeatDelete(a).string, fraseB = filterSplitWordRepeatDelete(b).string;
	return mode ? fraseArrayComp(filterSplitWordRepeatDelete(a).array,  filterSplitWordRepeatDelete(b).array)
		 		: strSimilarity (filterSplitWordRepeatDelete(a).string, filterSplitWordRepeatDelete(b).string);
/*
												filmes WD2/ (383)		MP3-All/Discothec/Anos 70 & 80/Médias (93)		tempo process. (por item)
	return 0										0,072s							0,015s										   0 us									  
	loop e filterSplitWordRepeatDelete(x) x 2		0,113s							0,032s												(0,140-0,072)/(383*57)
	fraseArrayComp									0,140s							0,041s										 1,3 us	(0,140-0,113)/(383*57)
	strSimilarity									1,565s							0,472s										66,5 us (1,565-0,113)/(383*57)
																												onde: 383 itens da lista de filmes WD2, 57 itens da memolist
*/
  },
//------------------ mostra mensagem na lista l50000
  msgIdx: 1,
  msgStart: function(mensagem, ding){
	li.addScroll('l50000', (cp.msgIdx++) + ". " + mensagem)
  },
//------------------ log
  logIdx: 1,
  msgLog: function(mensagem){
	li.add("l50000", (cp.logIdx++) + ".  " + mensagem)
  },
//------------------ extraia file do path
  fileOfPath: function(path){
	return path ? cp.UTF8(path.substr(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1)) : path;
  },
//------------------ mostra mensagem de retorno: "OK"
  jsonResMsg: function(x){
	cp.msgStart(cp.jsonRes(x), true)
  },
//------------------ JSON "result"
  jsonRes: function(x){
	return JSON.parse(x)["result"];
  },
//------------------ JSON "result"
  jsonResOK: function(x){
	return cp.jsonRes(x) == "OK";
  },
//------------------ mostre mensagem de erro por 5 seg.
  msgArray: [], msgSent: true, msgTmr: 0,
  msgErr: function(texto, logD, clrMsg){
	if (clrMsg) cp.msgErrClr();
	var msgArrayLen = cp.msgArray.length;
	if (msgArrayLen > 1 && texto == cp.msgArray[msgArrayLen - 1].texto) { cp.msgArray[msgArrayLen - 1].repetida++; return }
	cp.msgArray[msgArrayLen] = {
		texto: cp.UTF8(texto),
		logD: logD,
		repetida: 1
	};
	sndMsg()

	function sndMsg(){
		if (!cp.msgSent || !cp.msgArray.length) return;	// mensagem(s) ainda não enviada(s)		ou		acabou mensagens
		cp.msgSent = false;	// msg será enviada
		som.er();

		var msgVar	= cp.msgArray[0],
			rept	= msgVar.repetida,
			texto	= msgVar.texto,
			logD	= msgVar.logD;

		if (texto == 1) texto = "1";
		if (texto && typeof texto == 'object') texto = "== objeto ==";
		if (!texto) texto = "== nulo ou indefinido ==";
		texto = (rept > 1 ? "(" + rept + "X) " : "") + texto

		var el = $("#d1330")
		setTimeout(function(){
		  el
			.texto(texto)
			.fadeIn()
			.append('<a id="cancelMsg" class="xcancel abs" style="left:333px;top:3px"></a>')
			.css('line-height', '50px');										// ajuste para mostrar 1 linha
			if (el.isTextOverflow().ovflHeight)	el.css('line-height', '25px');	// ajuste para mostrar 2 linhas
			if (el.isTextOverflow().ovflHeight)	el.css('line-height', '16px');	// ajuste para mostrar 3 linhas
			$('#cancelMsg').btn(function(){ cp.msgErrClr() })
		}, 100)
		if (logD) cp.msgStart(texto);
		clearTimeout(cp.msgTmr); cp.msgTmr = setTimeout(function(){ el.fadeOut(function(){
			cp.msgSent = true;			// msg foi enviada
			cp.msgArray.splice(0, 1)	// delete do array msg enviada
			sndMsg()
		})}, 5000)	// 5 seg
	}
  },
//------------------ capture classe 'on' do elemento
  msgErrClr: function(){
	cp.msgSent = true;
	cp.msgArray = [];
	$('#d1330').fadeOut();
  },
//------------------
  aviso: function(left, top, txt){
	$("#aviso")
	  .sty([left, top, 250, 100])
	  .texto(txt)
	  .fadeIn()
	  .append('<a class="xcancel abs" style="left:202px;top:52px"></a>')
  },
//------------------ verifica se é barra normal (/) ou invertida (\)
  barNorInv: function(path){
	var aux1 = /(.*)(\\)/.test(path);
	var aux2 = /(.*)(\/)/.test(path);
	if (aux1 && aux2) return null;
	if (aux1)		  return false;
	if (aux2)		  return true;
  },
//------------------ normalize barras de x conforme barras de y
  barNormalize: function(x, y){
	if (cp.barNorInv(y) === null || !y)	return x;
	if (cp.barNorInv(y) === true)		return x.replace(/[\\]/g, '/');
	if (cp.barNorInv(y) === false)		return x.replace(/[\/]/g, '\\');
  },
  //------------------ substitui caracter em reJson por ""
  jsonCharFilter: function(x){
	var reJson = /[^ -ÿ–—‘’‚“”„€•…‰™łŞşığœİšƚėć\"\\\/\b\f\n\r\t]/g;
	if (x && typeof x === 'object')
		x.forEach(function(item){
			for (var q in item){
				var content = item[q];
				if (content !== parseInt(content, 10)){
					var m = reJson.exec(content);
					if (m){
						var re = new RegExp(m[0], "g"), r = m.input;
						item[q] = r.replace(re, "")
					}
				}
			}
		})
	else{
		var m = reJson.exec(x)
		if (m){
			var re = new RegExp(m[0], "g"), r = m.imput;
			x = r.replace(re, "")
		}
	}
	return x
  },
//------------------ grava dados em "data.txt"
  dataStore: function(data, callback){
	if (chromeApp){
/*		cp.xhrSend("../txt/data.txt", JSON.stringify(data), "", false, "data.txt write", false,
			function(x){
				callback(x)
			},
			function() { cp.msgErr("Erro gravação data.txt"); callback(null) }
		);*/
/*		chrome.storage.sync.set({ 'data': data }, function(x) {
			callback(true)
		});*/
		cp.readWrite("../txt/data.txt", JSON.stringify(data), "w", "", function(x){
			callback(true)
		})
	}else
		$.ajax({
			url: 'php/data.php',
			type: 'POST',
			data: { data: JSON.stringify(data), file: "../txt/data.txt", type: 'w' },
			error: function(xhr, sta) { cp.msgErr("Erro gravação data.txt"); callback(null) },
			success: callback
		})
  },
//------------------ lê dados armazenados em "data.txt"
  dataRead: function(callback){
	if (chromeApp){
/*		cp.xhrSend("../txt/data.txt", null, "", false, "data.txt read", false,
			function(x){
				callback(!x ? $.parseJSON('{}') : $.parseJSON(x))
			},
			function() { cp.msgErr("Erro leitura data.txt, remontando..."); callback($.parseJSON('{}')) }
		);*/
/*		chrome.storage.sync.get('data', function(x) {
			console.log(x.data)
			callback( x.data == [] || x.data == {} || x.data == "[]" ? {} : x.data )
		});*/
		cp.readWrite("../txt/data.txt", "", "r", "json", function(x){
			callback(x)
		})
	}else
		$.ajax({
			url: 'php/data.php',
			type: 'POST',
			data: { data: '', file: "../txt/data.txt", type: 'r' },
			cache: false,
			dataType: "json",
			error: function(xhr, sta) { cp.msgErr("Erro leitura data.txt, remontando..."); callback($.parseJSON('{}')) },
			success: function(x){
				callback(!x ? $.parseJSON('{}') : x)
			}
		})
  },
//------------------ le/grava dados genericamente
  readWrite: function(file, data, rw, datatype, callback){
	if (datatype == "json" && rw == "w"){
		data = cp.jsonCharFilter(data);
		data = JSON.stringify(data);
		datatype = "text";
	}
	if (chromeApp){
		var fileStg = cp.fileOfPath(file).replace(".txt", "");
		api.fileRW(fileStg, data, false, function(dado){
			if (!dado){
				console.log(file + " lido")
				cp.xhrSend(file, data ? data : null, "", false, "", false,
					function(x){
						api.fileRW(fileStg, x, false, function(){})
						callback( datatype == "json" ? $.parseJSON(x) : x )
					},
					function() { cp.msgErr("Erro readWrite() " + file); callback(null) }
				)
			}else{
				if (rw == "r") callback( datatype == "json" ? $.parseJSON(dado) : dado )
				else  callback(dado)
			}
		})
/*		var fileStg = cp.fileOfPath(file).replace(".txt", "");
		if (rw == "r")
			chrome.storage.sync.get(fileStg, function(x){
				var dado = x[fileStg];
				if ( !dado )
					cp.xhrSend(file, data ? data : null, "", false, "", false,
						function(x){
							var obj = {}; obj[fileStg] = x;
							chrome.storage.sync.set(obj, function(){});
							callback( datatype == "json" ? $.parseJSON(x) : x )
						},
						function() { cp.msgErr("Erro readWrite() " + file); callback(null) }
					);
				else
					callback( datatype == "json" ? $.parseJSON(dado) : dado )
			});
		else
			chrome.storage.sync.set({ file: data }, function(x) {
				callback(true)
			});*/
	}else
		$.ajax({
			url: 'php/readWrite.php',
			type: 'POST',
			data: { file: file, data: data, type: rw },
			dataType: datatype,
			error: function(xhr, sta){ cp.msgErr(sta); callback(null) },
			success: callback
		});
  },
//------------------ le/grava dados em arquivo txt
  rwFile: function(file, data, rw, callback){
	if (chromeApp){
		if (file == "../txt/phpReturn.txt") { callback(); return };
		cp.readWrite(file, data, rw, "", callback)
	}else
		$.ajax({
			url: 'php/data.php',
			type: 'POST',
			data: { file: file, data: data, type: rw },
			error: function(xhr, sta){ cp.msgErr(sta); callback(null) },
			success: callback
		});
  },
//------------------ salva "dado" em "data.txt"
  salvaDado: function(onde, dado, callback){
	cp.dataRead(function(data){ data[onde] = dado; cp.dataStore(data, callback) })
  },
//------------------ recupera "dado" de "data.txt"
  recuperaDado: function(onde, callback){
	cp.dataRead(function(data){ callback(data[onde]) })
  },
//------------------ codifica url para php
  phpGetEncode: function(url){
	return url.replace(/[&]/g, 'ziZ').replace(/[?]/g, 'zuZ').replace(/[%]/g, 'zoZ')
  },



 
//------------------ jsonRequest
  idIdx: 1, jsnReqBsy: false,
  jsonRequest: function(method, params, callback){
	if (!mobile && !set.tabDev && mainPag){
		var m = method.replace("XBMC.", "").replace("Application.", "");
		$('#jsonTeste').texto(m).css({left: m == "GetInfoLabels" ? 380 : m == "SetVolume" ? 500 : 620})
	}
	cp.jsnReqBsy = true;
	cp.jsonAjax(method, params, 13000, '', function(x){
	  if (!mobile) $('#jsonTeste').texto("");
	  if (x){
		if (x == 'timeout') { cp.msgErr("Erro jsonRequest: " + x); x = null }
		else
		  if (/\"error\"/.test(x)) { cp.msgErr('JSON ' + JSON.parse(x)["error"]["message"] + ': ' + method + ', idx:' + cp.idIdx, true); x = null }
		  else
			if (x.substr(0, 1) != "{") { cp.msgErr(x, true); x = null }
	  } else cp.rstLoading();
	  cp.jsnReqBsy = false;
	  callback(x)
	})
  },
//------------------
  jsonAjax: function(method, params, timeout, msgDis, callback){
	if (params) params = ',"params":' + params;
	$("#s9995").texto(cp.idIdx = cp.idIdx < 999 ? ++cp.idIdx : 1);
	var dados = '{"jsonrpc":"2.0","method":"' + method + '"' + params + ',"id":' + cp.idIdx + '}';
	cp.proxyAjax(sys.host + "/jsonrpc", dados, timeout, msgDis, callback)
  },
//------------------ comunicação via http_request.php
  proxyAjax: function(url, dadoPost, tempoEspera, msgDis, callback){
	cp.postForm(chromeApp ? url : 'php/http_request.php', chromeApp ? dadoPost : {url: url, postData: dadoPost}, tempoEspera, false, false, callback, function(x){ if (!msgDis) cp.msgErr("xhr Erro: " + x + "\nurl: " + url); callback(null) })
  },
//------------------ comunicação via http_request.php blob
  proxyAjaxBin: function(url, elem, callback){
	cp.postForm(url, "", "", false, true,
		function(x){
			try		{ callback({ data: window.URL.createObjectURL(x), elem: elem }) }
			catch(e){ callback(null) }
		},
		function(x){
			cp.msgErr("xhr Erro: " + x + "\nurl: " + url); callback(null)
		}
	)
  },
//------------------  envia pacote UDP para o RFX9600
  sendUdpRfx: function(ipP, porta, dado, modo, tempoEspera, callback){
	if (chromeApp){
		var scts = 6, res = [];
		res.data = "";
		res.id	 = 0;
		$.when(sendUDP(dado))
			.fail(function(){ cp.msgErr("UDP erro"); callback(null) })	// falha de recepção
			.done(function(){
				chrome.sockets.udp.close( res.id, function(){
					callback(res.data)
				})
			})
		function sendUDP(dado){
			var d = jQuery.Deferred();
			cp.stringToArrayBuffer(dado, function(x){
				cp.udpSendData(ipP, porta, x, function(x){
					if (x){ 
						res.data += x.data;
						res.id	  = x.id;
						if (!--scts) d.resolve();
					}else d.reject();
				})
			})
			return d.promise()
		}
	}else
		cp.postForm('php/udprfx.php', {ip: ipP, port: porta, data: cp.charHex(dado), modo: modo}, tempoEspera, false, false, function(x) { callback(cp.hexToChar(x)) }, function(x){ callback(x) })
  },
//------------------  envia pacote UDP para o RFX9600
  sendUdp: function(ip, porta, dado, modo, callback){

	$.ajax({
		url: 'php/udp.php',
		type: 'POST',
		data: {ipsend: ip, port: porta, data: cp.charHex(dado), mode: modo},
		timeout: 6000,
		error: function(xhr, sta)	{ callback(sta) },
		success: function(x)		{ callback(cp.hexToChar(x)) }
	}) // http://us3.php.net/manual/en/function.stream-socket-server.php
  },
//------------------ UDP send
  udpSendData: function(ip, port, data, callback){
	chrome.sockets.udp.create({}, function(socketInfo){
		var socketId = socketInfo.socketId;
		chrome.sockets.udp.bind(socketId, "0.0.0.0", 0, function(res){
			/*chrome.sockets.udp.getInfo(socketId, function(res) { console.log(res) });*/
			if(res < 0) console.log("Socket creation error", chrome.runtime.lastError.message);
			else
				chrome.sockets.udp.send(socketId, data, ip, port, function(sendInfo){
					if (sendInfo.resultCode < 0)
						console.log("Socket sending error", chrome.runtime.lastError.message);
					else
						chrome.sockets.udp.onReceive.addListener(function(x){
							callback({ data: cp.uintToString(x.data), id: x.socketId })
						})
				});
		});
	});
  },
//------------------  envia pacote TCP
  sendTcp2: function(url, porta, dado1, dado2, dado3, dado4, dado5, callback){
	cp.postForm('php/tcpIO.php', { ip: url, port: porta, data1: dado1, data2: dado2, data3: dado3, data4: dado4, data5: dado5 }, 40000, false, false, callback, function(x){ callback("status:" + x) })
  },
//------------------  recebe pacote TCP
/*  recTcp: function(url, porta, dado1, dado2, dado3, dado4, dado5, callback){
	$.ajax({
		url: 'php/tcp_read.php',	// tcp2.php
		type: 'POST',
		data: {ip: url, port: porta, data1: dado1, data2: dado2, data3: dado3, data4: dado4, data5: dado5},
		error: function(xhr, sta)	{ callback(sta) },
		success: callback
	})
  },*/
//------------------ ajax post - send
  doPost: function(url, params, callback){
	cp.proxyAjax(url, params, '', '', callback)
  },
//------------------ eventghost - send
  eventGhost: function(ip, comando, callback){
	cp.proxyAjax("http://" + ip + ":" + sys.eventGhostPort + "/?" + comando, '', 20000, true, function(x){
		if (x == 'timeout') { x = null; cp.msgErr("Erro de Comunicacao EventGhost: timeout", true) };
		callback(x)
	})
  },
//------------------ video blob send (blobfile, filename, chunk?, show_progress?, callback)
  saveBusy: false,
  videoBlobSave: function(blob, path, fileName, chunk, progress, callback){
	$.when(chkBusy()).done(function(){
		postForm(blob, path, fileName, chunk, progress, callback)
	})

	function chkBusy(){
		var dfd = jQuery.Deferred();
		bsyLoop()
		return dfd.promise();
		function bsyLoop(){
			if (!cp.saveBusy) return dfd.resolve();
			setTimeout(bsyLoop, 100);
		}
	}

	function postForm(blob, path, filename, chunk, progress, callback){
		cp.saveBusy = true;
		cp.postForm(chunk ? 'php/chunkBlob.php' : 'php/saveBlob.php', { video_blob: blob, path: path, video_filename: fileName }, "", progress, false, function(x){ cp.saveBusy = false; callback(x) }, function(x){ cp.msgErr(x) })
	}
  },	// mudar em php.ini: [upload_max_filesize = 2M para 600M]    [post_max_size = 8M para 600M]		[memory_limit = 600M]
//------------------ prepara post formData para cp.xhrSend
  postForm: function(url, obj, tempoEspera, progress, binary, callback, error){	// (php address, input object, progress, callback function, error function)
  	if (obj){
		if (typeof obj === "object"){
			var formData = new FormData();
			for (var key in obj) formData.append(key, obj[key] || "");	// se obj[key] == null, ""
		}else var formData = obj;
	}else	  var formData = null;
	cp.xhrSend(url, formData, tempoEspera, progress, obj, binary, callback, error);
  },
//------------------ xhr post - send
  xhrBuffer: [],
  xhrSend: function(url, data, tempoEspera, progress, obj, binary, callback, error){
	cp.xhrBuffer.push(obj); if (cp.xhrBuffer.length > 6) cp.msgErr("xhr buffer: " + cp.xhrBuffer.length);

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
	  if (xhr.readyState == 4/* || xhr.readyState == 3*/){
		cp.xhrBuffer.splice(0, 1)
		if (xhr.status == 200 || xhr.status == 304){
			if (binary) callback(xhr.response)
			else{
				var res = xhr.responseText; if (/Warning/.test(res)) error(res)
				else
					callback(res)
			}
		}
		else
			( xhr.status == 0 || xhr.status == 415 ) ? callback(null) : cp.msgErr("xhr erro " + xhr.status + " url: " + url);
	  }
	};

	xhr.timeout = tempoEspera || 5000;
	xhr.ontimeout = function() { callback("timeout") }
	xhr.responseType = binary ? "blob" : "";	// "blob", "arraybuffer", "document", "json", "text", "moz-blob"
	xhr.upload.addEventListener("progress", uploadProgress,   false); function uploadProgress  (e){ showProgress(e) }
	xhr.addEventListener	   ("progress", downloadProgress, false); function downloadProgress(e){ showProgress(e) }
//	xhr.onload = function(e) { callback(e.target.response) }
	xhr.open(data === null ? 'GET' : 'POST', url, true);
	xhr.setRequestHeader( chromeApp ? "Content-Type" : "encoding", chromeApp ? "application/json" : "utf-8")
	xhr.send(data);

	function showProgress(e){
		if (e.lengthComputable && progress){
			var x = Math.round(e.loaded / e.total); x ? x == 1 ? setTimeout(cp.rstLoading, 500) : cp.setLoading(x) : cp.setLoading();
		}
	}
  },
//------------------ converte string em arrayBuffer
  stringToArrayBuffer: function(x, callback){
	var bb = new Blob([x]), f = new FileReader();
	f.onload = function(e) { callback(e.target.result) };
	f.readAsArrayBuffer(bb);
  },
//------------------ converte arrayBuffer em string
  arrayBufferToString: function(x, callback){
	var reader = new FileReader();
	reader.onload = function(e) { callback(e.target.result) };
	var blob = new Blob( [ x ], { type: 'application/octet-stream' } );
	reader.readAsText(blob);
  },

  uintToString: function(buf){
	return String.fromCharCode.apply(null, new Uint8Array(buf));
  },
//------------------ chrome.extension.sendRequest
  chromeSend: function(ip, port, data, callback){
	chrome.sockets.tcp.create({}, function(createInfo){
		chrome.sockets.tcp.connect(createInfo.socketId, ip, port, function(x){
			x = x;
		});
	});
  },
//------------------ jsonp - send
  jsonpSend: function(url, callback){
	var tempCallback = 'jsonp_callback_' + Math.round(1e5 * Math.random());
	window[tempCallback] = function (data){
		delete window[tempCallback];
		document.body.removeChild(script);
		callback(data);
	};
	var script		= document.createElement('script');
	script.onerror	= function(e){ var a = e };
	script.onload	= function(e){ var a = e };
	script.src		= url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + tempCallback;
	document.body.appendChild(script);
  },
//------------------ cross domain proxy (http://stackoverflow.com/questions/2558977/ajax-cross-domain-call)
  crossDomain: {
	initialize: function(_url, _callback){
		this.url = _url;
		this.callback = _callback;
		this.connect()
	},
	connect: function(){
		var script = document.createElement('script'), script_id = document.getElementById('xss_ajax_script');
		if (script_id) document.getElementsByTagName('head')[0].removeChild(script_id);	// se já está inserido na página, remova-o
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', this.url);
		script.setAttribute('id', 'xss_ajax_script');
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	process: function(x){ this.callback(x) }
  },
//------------------ cross window open
  corsWindow: function(url, callback){
	win2 = window.open(url, "cam3window", "height=100,width=100")
	setTimeout(function(){ var a = win2 }, 3000)
  },
//------------------ pageName  
  pageName: function(){
	var sPath = window.location.pathname;
	return sPath.substring(sPath.lastIndexOf('/') + 1)
  },
//------------------ acende / apaga led
  ledOnOff: function(led, status, cor){	// led: elemento	status: false / true, importante: classe do elemento deve ser "led" (class="led")
	if (status != null){
		if (!cor) cor = "bl";	// cor default: azul; 	r: vermelho, y: amarelo, g: verde, bl: azul
		$('#' + led).removeClass('r').removeClass('y').removeClass('g').removeClass('bl');
		if (status) $('#' + led).addClass(cor)
	}
  },
//------------------ acende / apaga led do botão (class="btnled")
  btnLedOnOff: function(led, status){	// led: elemento	status: false / true, importante: classe do elemento deve ser "led" (class="led")
	status != null && status ? $('#' + led).addClass('on') : $('#' + led).removeClass('on')
  },
//------------------ mostra "loading"
  progressTime: 0, loadingTmr: 0,
  setLoading: function(progValue, progMax, msg, elem){
	if (progValue && !elem){
		if (cp.timeDate() > cp.progressTime + 50){	// tempo de atualização barra progresso: 50 ms
			cp.progressTime = cp.timeDate();
			$('#f116').show()	// mostre barra de progresso
			$("#a116").CPslider({value: progValue * 100 / (progMax || 1)})
		}else return
	}else $('#f116').hide();
	$('#m116').texto(msg || "")
	$('#' + (elem ? elem : 'd1305')).show()	// mostre spin rotativo
	clearTimeout(cp.loadingTmr); cp.loadingTmr = setTimeout(cp.rstLoading, 15000, elem)	// loading não deve demorar mais que 10 seg
  },
//------------------ esconde "loading"
  rstLoading: function(elem){
	$('#' + (elem ? elem : 'd1305')).hide()
	$('#d37').texto(0); $('#d38').texto(0)	// desative botões CR e CF
  },
//------------------ adiciona elemento de imagem dentro de uma div
  imgAdd: function(divId, imgId, src, w, h, l, t, cor){ // <div id="id"><img src=src alt="" class="abs" style="left:lpx;top:tx;width:wpx;height:hpx"></div>
	C$('#' + divId).innerHTML = '<img id="' + imgId + '" src="' + src + '" alt="" class="abs" style="left:' + l + 'px;top:' + t + 'px;width:' + w + 'px;height:' + h + 'px;' + cor + '">'
  },
//------------------ toca arquivo de som
  playSound: function(id){
	C$('#' + id).play()
  },
//------------------ retira acento de uma letra
  retiraAcento: function(x){
	return (
		x == "À" || x == "Á" ? "A" :
		x == "É" || x == "Ê" ? "E" :
		x == "Ó" || x == "Ô" ? "O" :
		x == "Ú" ? "U" :
		x )
  },
//------------------ retira acento de uma palavra
  acentos: { "À":"A", "Á":"A", "à":"a", "á":"a", "É":"E", "Ê":"E", "é":"e", "ê":"e", "Ó":"O", "Ô":"O", "ó":"o", "ô":"o", "Ú":"U", "ú":"u" },
  retiraAcentoW: function(x){
	var reAcentos = new RegExp(Object.keys(cp.acentos).join("|"), "g");
	return x.replace(reAcentos, function(matched){ return cp.acentos[matched] })	// retire acentos
  },
//------------------
  checkUser: function(dado){
	if (chromeApp) { dadoMem = dado; set.inic(true); return };
	$.ajax({
		url: 'php/getipclient.php',
		success: function(data){
			ip.local = data;
			dadoMem = dado;
			var aux = data.substr(0, 9);
			if (aux == "127.0.0.1" || aux == "192.168.1" || aux == "10.10.10." || aux == "172.25.0." || aux == "::1") set.inic(true)	// rede local
			else{
				set.inic(false);
/*				cp.msgErr("IP client: " + (ip.client = data), true);
				if (data != dado.ipLocal || (cp.timeDate() - dado.userTime) > 360000){ // se IP client diferente ou tempo de login > 1 hora...
					dadoMem.ipLocal = ip.local = data;
					$("#login").fadeIn();	// ...carregue a tela de login
				//	document.form1.elements['user'].focus();	// posiciona cursor no campo usuário
					return false;
				}else set.inic(false)	// rede externa, dentro do período válido*/
			}
		}
	})
  },
//------------------
  checkPass: function(form){
	$('#d1306').fadeIn();	// mostre "loading" em login.html
	var usuario = form.user.value.toLowerCase();
	if (dadoMem[usuario] == form.pass.value){
		dadoMem.userTime = cp.timeDate();
		$("#login").fadeOut();	// esconda login
		$('#d1306').fadeOut();	// esconda "loading" em login.html
		set.inic(false);	// rede externa, usuário/senha ok
	}else{
		form.pass.value = "";	// limpe o campo da senha
		$('#d1306').fadeOut();
		alert("Usuário e/ou Senha errados");
		return cp.checkUser(dadoMem);
	}
  },
//------------------ javascript minifier
  minifier: function(path, callback){
	$.ajax({
		url:	'php/minifier.php',
		type:	'POST',
		data:	{file: path},
		error:	function(xhr, sta)	{ callback(sta) },
		success: callback
	})
  },
//------------------ se var a = cp.f	a.xxx é o mesmo que cp.xxx
  f: function(){
	return this
  }
}




var api = {
  fileRW: function(file, data, createFile, callback){	// modo read: write == false	write: write == true
	function onInitFs(fs){
		var write = data ? true : false;
		fs.root.getFile(file, { create: createFile }, function(x){
			if (createFile) { callback(""); return }	// arquivo não existia, foi criado
			if (data && x.isFile){
				// file write, remove first
				x.remove(function(){	// remove
					fs.root.getFile(file, { create: true }, function(x){
						x.createWriter(function(fileWriter){
							fileWriter.seek(fileWriter.length); // Start write position at EOF.
							var blob = new Blob([data], {type: 'text/plain'});
							fileWriter.write(blob);
							callback(true)
						}, function(e){ console.log('api file write (create) error: ' + e.name + " (" + file + ")"); callback(null) });
					}, function(e){ console.log('api file create error: ' + e.name + " (" + file + ")"); callback(null) });
				}, function(e){ console.log('api file remove: ' + e.name + " (" + file + ")"); callback(null) });
			}else
				// file read
				x.file(function(f){
					var reader = new FileReader();
					reader.onloadend = function(e) {
						callback(this.result)
					}
					reader.readAsText(f);
				}, function(e){ console.log('api file read error: ' + e.name + " (" + file + ")"); callback(null) });
		}, function(e){ 
			if (!createFile) api.fileRW(file, data, true, function(x){	// arquivo não existe, crie-o
				console.log('api file: arquivo criado (' + file + ")");
				callback(x)
			})
			else{
				console.log('api file error (criação): ' + e.name + " (" + file + ")");
				callback(null)	// erro de leitura/gravação
			}
		});
	}

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, api.errorHandler);
  },

  fileRemove: function(file, callback){
	function onInitFs(fs){
		fs.root.getFile(file, { create: false }, function(x){
			x.remove(function(){
				console.log('File removed (' + file + ")");
			}, function(e){ console.log('api file remove: ' + e.name); callback(null) });
		}, function(e){ console.log('api file remove: ' + e.name + " (" + file + ")" ); callback(null) });
	}

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.TEMPORARY, 1024*1024*5, onInitFs, api.errorHandler);
  },
//------------------ mensagens de erro
  errorHandler: function(e) {
	console.log('api error: ' + e.name);
  },
}




var li = {
   addArqArray: [], addMusArray: [], addVidArray:[],
//------------------ adiciona na lista de menu
  addMenu: function(lista, texto, path){
	if (!path) path = "";
	var e_li  = document.createElement('li'),
		e_a   = '<a title="' + path + '" name="' + texto + '">',
		e_img = '<img lang="' + li.idCount + '" title="';

	e_a += cp.UTF8(texto);
	if (path) e_a += e_img + path + '" name="' + texto + '" src="../img/blank.png" class="abs" style="width:' + 25 + 'px;height:30px;">';
	e_li.innerHTML = e_a;
	C$('#' + lista).appendChild(e_li)
  },
//------------------ adiciona na lista
/*  add_: function(lista, texto, path, imgPath, path2, imgPath2){
	var e_li = document.createElement('li'),
		href = "javascript:onBtn" + lista + "('" + cp.bar1to2(path || "") + "')",
		innerHtml = '<a href="' + href + '">';

	if (imgPath) innerHtml += '<img src="' + imgPath + '"' + img.error + '> ';
	innerHtml += texto + '<img src="../img/blank.png" class="abs" style="left:2px;width:' + (ipadWin || set.tabDev ? 395 : 250) + 'px">';	// toda a linha ativa ao toque
	e_li.innerHTML = innerHtml;
	if (path2){
		innerHtml = '<a href="' + path2 + '" ';
		if (imgPath) innerHtml += '<img src="' + imgPath2 + '" class="abs" style="left:' + (ipadWin || set.tabDev ? 440 : 283) + 'px"	>';
		e_li.innerHTML = innerHtml;
	}
	C$('#' + lista).appendChild(e_li)	// <ul>...</li><a><img>texto<img></a><a><img></a>...</ul> idem, cima p/baixo
  },
*/
  add: function(lista, texto, path, imgPath){
	var e_li  = document.createElement('li'),
		e_a   = imgPath ? '<pre>' : '<a>',
		e_img = '<img lang="' + li.idCount + '" title="';

	if (imgPath) e_a += e_img		 + '" name="' + imgPath + '" src="' + (chromeApp ? "img/blank.png" : imgPath) + '" class="imgPath"' + img.error + '>'; // imagem do icone da linha
	e_a += (imgPath ? (set.tabDev ? "         " : "       ") : " ") + cp.UTF8(texto);
	if (path)    e_a += e_img + path + '" name="' + texto	+ '" src="../img/blank.png" class="abs" style="left:2px;width:' + (ipadWin || set.tabDev ? 395 : 250) + 'px">';
	e_li.innerHTML = e_a/* + (imgPath ? (set.tabDev ? "         " : "       ") : " ") + cp.UTF8(texto)*/; // espaço para o icone + texto:
	C$('#' + lista).appendChild(e_li)	// <ul>...</li><a><img>texto<img></a><a><img></a>...</ul> idem, cima p/baixo
  },
//------------------ adiciona na lista plus
  idCount: 0,
  addArq: function(lista, texto, path, imgPath, lstLng, cmd2, imgPath2, cmd3, imgPath3, cmd4, imgPath4){
	var e_li  = document.createElement('li'),
		e_pre = '<pre>',
		e_img = '<img lang="' + li.idCount + '" title="';

	if (path && path.substr(0, 1) == "[") path = cp.encChar(path);	// path-array

	if (imgPath) e_pre += e_img + '" name="' + imgPath + '" src="' + (lstLng || chromeApp ? "img/blank.png" : imgPath) + '" class="imgPath"' + img.error + '>'; // imagem do icone da linha
	// imagem contem path (title), texto (name) e blank (src) com largura (width) ativa ao toque:
	if (path)    e_pre += e_img + path + '" name="' + texto + '" src="../img/blank.png" class="blankLine" style="width:' + (ipadWin || set.tabDev ? 395 : 250) + 'px">';

	if (cmd2 || cmd3 || cmd4){
		var classSty = '" class="imgPath2" style="left:';
		if (cmd2) e_pre += e_img + cp.encChar(cmd2) + '" src="' + imgPath2 + classSty + (ipadWin || set.tabDev ? 440 : 283) + 'px">'; // último botão [cmd2 + path] e sua imagem (src)
		if (cmd3) e_pre += e_img + cp.encChar(cmd3) + '" src="' + imgPath3 + classSty + (ipadWin || set.tabDev ? 400 : 243) + 'px">'; // penúltimo botão
		if (cmd4) e_pre += e_img + cp.encChar(cmd4) + '" src="' + imgPath4 + classSty + (ipadWin || set.tabDev ? 360 : 203) + 'px">'; // antepenúltimo botão
	}

	if (chromeApp && lista == "l12005") li.addArqArray[li.idCount] = { ele: lista + "_" + li.idCount, img: imgPath }	// array de icon-images da lista de arquivos (main pag)

	e_li.innerHTML = e_pre + (imgPath ? (set.tabDev ? "         " : "       ") : " ") + cp.UTF8(texto); // espaço para o icone + texto:
	li.idCount++;
	// acrescente na lista:		<ul>...<li><pre><img><img><img>texto</pre></li>...</ul>
	C$('#' + lista).appendChild(e_li)	//  de cima p/baixo ou....		ul.insertBefore(e_li, ul.firstChild)	de baixo p/cima
  },
//------------------ o mesmo que li.addArq, para listas longas (apaga icones)
  addLng: function(lista, texto, path, imgPath, cmd2, imgPath2){ 
	li.addArq(lista, texto, path, imgPath, true, cmd2, imgPath2)
  },
//------------------ o mesmo que li.addArq, para listas pequenas (mostra icones)
  addSml: function(lista, texto, path, imgPath, cmd2, imgPath2, cmd3, imgPath3, cmd4, imgPath4){
	li.addArq(lista, texto, path, imgPath, false, cmd2, imgPath2, cmd3, imgPath3, cmd4, imgPath4)
  },
//------------------ adiciona na lista l12005
  addL12005: function(texto, path, imgPath, cmd2, imgPath2){
	li.addArq("l12005", texto, path, imgPath, true, cmd2, imgPath2)
  },
//------------------ adiciona na lista-objeto
  add2: function(lista, dado){
	var listObj = JSON.parse(cp.UTF8(dado));
//	if (!listObj.img) listObj.img = '';
	li.addArq(lista, listObj.txt, listObj.pth, listObj.img)
  },
//------------------ adiciona na lista de vídeo thumbs
  addVideo: function(lista, texto, path, imgPath){
	var e_li  = document.createElement('li');
	e_li.innerHTML = '<img name="' + imgPath + '" title="' + path + '" src="">' + '<div>' + texto + '</div>';
	if (chromeApp) li.addVidArray[li.idCount] = { ele: lista + "_" + li.idCount++, img: imgPath }	// array de path-imagens das capas de vídeos
	C$('#' + lista).appendChild(e_li)		// <ul>...<li><img><div>texto</div>...</ul>
  },
//------------------ adiciona na lista de thumbs de música, usa: href link
  addMusic: function(lista, texto1, path1, imgPath1, texto2, path2, imgPath2, texto3, path3, imgPath3, texto4, path4, imgPath4){
	var e_li		= document.createElement('li'),	// <li>...
		add_a_elem	= function(texto, path, imgPath){
			path = cp.encChar(cp.bar1to2(path));
			return '<a><img title="' + path + '" name="' + imgPath + '" src=""' +/* img.error + */'><div>' + texto + '</div></a>'
		};

	e_li.innerHTML  = add_a_elem(texto1, path1, imgPath1);
	e_li.innerHTML += add_a_elem(texto2, path2, imgPath2);
	e_li.innerHTML += add_a_elem(texto3, path3, imgPath3);
	if (!set.tabDev) e_li.innerHTML += add_a_elem(texto4, path4, imgPath4);
	if (chromeApp){
		li.addMusArray[li.idCount] = { ele: lista + "_" + li.idCount++, img: imgPath1 }	// array de path-imagens das capas de "CDs' de músicas
		li.addMusArray[li.idCount] = { ele: lista + "_" + li.idCount++, img: imgPath2 }
		li.addMusArray[li.idCount] = { ele: lista + "_" + li.idCount++, img: imgPath3 }
		li.addMusArray[li.idCount] = { ele: lista + "_" + li.idCount++, img: imgPath4 }
	}
	C$('#' + lista).appendChild(e_li);
  },
//------------------ limpa lista
  clear: function(lista){
	$('#' + lista).empty()
	li.idCount = 0;
  },

  clrArq: function(lista){
	li.clear(lista);
	li.addArqArray = [];	// array de icon-images de li.addArq
  },

  clrMus: function(lista){
	li.clear(lista);
	li.addMusArray = [];	// array de icon-images de li.addArq
  },

  clrVid: function(lista){
	li.clear(lista);
	li.addVidArray = [];	// array de icon-images de li.addArq
  },
//------------------ insere item na "lista" após a "linha"
  itemIns: function(lista, linha, conteudo){
	var ul = C$("#" + lista);
	ul.insertBefore(conteudo, ul.childNodes[linha]);
  },
//------------------ remove linhas de listas
  linRem: function(lista, linIni, linFim){
	var lin = 2; linFim = linFim ? linFim + 2 : linIni + 2;
	$$("#" + lista + " li").each(function(){
		if (lin > linIni && lin < linFim) $(this).empty()
		lin++
	})
  },
//------------------ remove item da "lista" da "linha"
  itemRem: function(lista, linha){
	$("#" + lista + " li:eq(" + linha + ")").remove()
  },
//------------------ move item na "lista" da "linha1" para a 'linha2"
  itemMov: function(lista, linha1, linha2){
	var item = $("#" + lista + " li:eq(" + linha1 + ")")[0];
			   $("#" + lista + " li:eq(" + linha1 + ")").remove()
	li.itemIns(lista, linha2, item)
  },
//------------------ le itens (path) da lista e põe em array
  itensRead: function(lista){
	var ul = $('#' + lista + ' > li > pre > img.blankLine'), array = [];
	ul.each(function(idx){
		array[idx] = ul.eq(idx).slice(0, 1).attr("title")
	})
	return array
  },
//------------------ procura posicão da lista e retorna texto e path da posição
  posSrch: function(lista, posicao, callback){
	var path = null, texto = null;
	$('#' + lista + ' li').each(function(index){
		if (posicao == index){
			path  = $(this).find('a').slice(0, 1).attr('href')
			texto = $(this).text()
		}
	})
	callback(texto, path)
  },
//------------------ procura path da lista e retorna índice da posição
  pathSrch: function(lista, path, callback){
	var aux = null;
	$('#' + lista + ' li').each(function(index){
		if ($(this).find('img').slice(1).attr('title') == path) aux = index
	})
	callback(aux)
  },
//------------------ adiciona em lista com/sem scroll
  addScroll: function(lista, x){
	li.add(lista, x);
	$('#' + lista).scrollTop($('#' + lista).scrollTop() + 30)	// +30, é altura de 1 linha de 30 pixels
  },
  addScrollInOut: function(x) { if (inoutPageLoaded) li.addScroll("l60000", x) },
  addInOut:		  function(x) { if (inoutPageLoaded) li.add("l60000", x) },
  clrInOut:		  function( ) { li.clear("l60000") },
//------------------ rola lista para cima
  scrollList: function(lista){
	var list	  = C$('#' + lista), 
		listItems = list.getElementsByTagName("li");
	list.appendChild(listItems[0])
  },
//-------------------------- controle de loop em listas
  loopTime: 0, idxAnterior: 0/*, loopTmr: 0*/,
  loopCtrl: function(arrayLen, idx, msg){
	var step = (idx - li.idxAnterior) / (arrayLen - 1);
	if ((cp.timeDate() > li.loopTime + 100) && step > 0.1 || idx < 3){	// a cada 100 ms ou idxdelta > 10 % desbloqueia loop
		li.loopTime = cp.timeDate();
		cp.setLoading(li.idxAnterior = idx, arrayLen - 1, msg || "")	// atualize barra de progresso
		return true
	}else
		return false
  }
}