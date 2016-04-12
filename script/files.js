$(document).ready(function(){
	if (!mobile) dir.vidLeftPos = C$('#camP') ? C$('#camP').style.left : "";	// salve pos. esq. da subpág. das cams 

	if (!mobile && C$('#aud5')){
		C$('#aud5').innerHTML = '<audio id="audDir0" src="#" title="" controls style="width:565px"></audio><div id="audTit0">canal 0</div>' +
								'<audio id="audDir1" src="#" title="" controls style="width:565px"></audio><div id="audTit1">canal 1</div>';
		C$('#img5').innerHTML = '<img	id="imgDir" src="#" alt="" height=350/>';
		C$('#txt5').innerHTML = '<div	id="vidTit" style="width:400px"></div>' +
								'<ul	id="lstTit" class="scrollable listaTxt"></ul>';
		$('#aud5').hide();

		dir.clr()
	}

	$("#audDir0, #audDir1")
	.bind("canplaythrough", function(e){
//		cp.rstLoading()
	})
	.bind("ended pause", function(e){
		if (!sv.pauseBtn){	// botão pausa não acionado
			if ("audDir" + dir.chanow != e.target.id) sv.audioInfo = sv.clearAudioInfo();	// canal desligado é o mesmo que está tocando, limpe infos
			C$("#" + e.target.id).src = "#";
		}
	})
	.bind("play", function(e){
		if (camPag) cam.vidState(true); 	// mostre barra de tempo

		sv.pauseBtn = false;
		sv.audioInfo.Src = e.target.id;
		$("#" + e.target.id)										.audFade("in" , 5000)
		$("#" + (e.target.id == "audDir0" ? "audDir1" : "audDir0")) .audFade("out", 5000)
		clearTimeout(sv.audTmr); audioTimeLoop(e.target.id)
		$("#d37, #d38").texto(0)	// apague botões "CR" e "CF"
	})
	.bind('loadedmetadata', function(e){
		cp.rstLoading()
	})

	function audioTimeLoop(id){
		var el = C$("#" + id);
		if (/#/.test(el.src)) return;	// se source == "#", retorne
		clearTimeout(sv.audTmr); sv.audTmr = setTimeout(audioTimeLoop, 500, id);

		var totalTime = el.duration, playTime = el.currentTime;
		sv.audioInfo["Player.Duration"] = cp.StoHMS(totalTime);
		sv.audioInfo["Player.Time"] 	= cp.StoHMS( playTime);

		if (totalTime - playTime < sv.nextTime) sv.playMusic("next")

		if (!mainPag){
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
				$("#a114").CPslider({ value: cam.locVol })	// posicione cursor do volume
				C$("#" + sv.audioInfo.Src).volume = cam.locVol / 100;
			}
		}
	}
});

function iSpy(el){	// http://www.videolan.org/doc/play-howto/en/ch04.html#id590873
//	var a = cp.f();

/*	var t = cp.timeDate(), a = "", i = 30000000, s = "";
	while (i--) a += s;
	var b = cp.timeDate() - t;*/

//	blurBack(".fndPag")

/*	id3Info(
	//	"//WD3/Pub/MP3-All/- Caribe/01-Mr. Chris - Cosa Bonita.mp3"
	//	"//WD3/Pub/MP3-All/- Caribe/Cosa Bonita Picture.jpg"
		 "//WD3/Pub/MP3-All/- Coletânea News/Taio.bmp", function(x){
//		var a = flatArray(x.image)
//		var src = (window.URL || window.webkitURL).createObjectURL(x);	// x = blob
		var src = x.image64;
//		var src = 'php/streamRead.php?file=' + "//WD3/Pub/MP3-All/- Caribe/Cosa Bonita Picture.jpg";
		C$("#imgDir").src = src;
	})*/

/*	cp.eventGhost(ip.xbmc, "APACHE_STOP_START", function(x){
		cp.msgErr("Apache start/stop "+ (x == "" ? "com sucesso" : "erro"), true)
	})*/

/*	cp.postForm('php/smb/exemplo.php', { }, 5000, false, false,
		function(x){	// directory.php: em uso a rotina #3b
			var a = x;
		},
		function(status){ 
			cp.msgErr('directoryList.php êrro: ' + status); cp.rstLoading()
		}
	)*/

/*	cp.postForm('php/http_request.php', { url: "10.22.22.1:1900/", postData: "ON" }, "", false, false,
	function(x){
		x = x;
	},
	function(er){
		er = er; 
	})*/

/*	api.fileRemove("data", function(x){
	})
	api.fileRemove("sinopse", function(x){
	})
	api.fileRemove("videoFile", function(x){
	})
	api.fileRemove("memoFile", function(x){
	})
	api.fileRemove("musicFile", function(x){
	})
	api.fileRemove("playlist", function(x){
	})
	api.fileRemove("sinopseFilmes", function(x){
	})
	api.fileRemove("songsFile", function(x){
	})
*/


//	bell_.stop();
//	bell_.play();

      // Send the command!
/*	if (window.tcpClient) {
		tcpClient.sendMessage(this.value);
	}*/

//	tcpClient.disconnect();

//	var app = new chrome.WebApplication(/*{ host:"127.0.0.1", port:8887 }*/)


	cp.proxyAjax("http://192.168.1.22:3000", null, '', '', function(x){
		x = x
	})

}



/*
function connect(host, port, callback) {
	tcpClient = new TcpClient(host, port);
	tcpClient.connect(function(x) {
		callback(x);
		tcpClient.addResponseListener(function(data) {
			log(data)
		});
	});
}
if (chromeApp){
	connect('192.168.1.31', 8080, function(x){
		x = x
	});

	tcpClient._onConnectComplete(function(x){
		x = x
	})
	
	tcpClient.addResponseListener(function(x){
		x = x
	})
	
	tcpClient._onReceive(function(x){
		x = x
	})
	
	tcpClient._onReceiveError(function(x){
		x = x
	})
	
	tcpClient._onSendComplete(function(x){
		x = x
	})
}*/


/*function showServices( services ) {
  // Show a list of all the services provided to the web page
  for(var i = 0, l = services.length; i < l; i++) console.log( services[i].name );
}

function error( e ) {
  console.log( "Error occurred: " + e.name );
}

navigator.getNetworkServices('upnp:urn:schemas-upnp-org:service:ContentDirectory:1').then(showServices, error);
*/



//==================================================== biblioteca dir (diretório)
var dir = {

  obj: "", nivel: 0, fileArray: [], path: "", path0: "", time: 0, camCurr: "",
  //------------------------- botão "servidores"
  srv: function(){
	dir.set()

	dir.list('ldir', 'Gravações cam  4 (NUC)',			'E:/Record/Camera 4/Local/Schedule', 'dir')
	dir.list('ldir', 'Gravações cams 1, 2 e 3',			'C:/webserver/webroot/buffer/gravCams', 'dir')
	dir.list('ldir', 'WD3/Pub via IP',					'http://192.168.1.102', 'dir')
	dir.list('ldir', 'WD3/Pub',							'//WD3/Pub', 'dir')
	dir.list('ldir', 'Clips',							'//WD3/Pub/MKV-Musicais/Musicais/Clips Pops', 'dir')
	dir.list('ldir', 'SD card (T230)',					'/mnt/extSdCard', 'dir')
	dir.list('ldir', 'MP3-All (T230)',					'/mnt/extSdCard/MP3', 'dir')
	dir.list('ldir', 'Memolist',						'../txt/memo', 'dir')
	dir.list('ldir', 'Disco C:',						chromeApp ? 'file://C:/cerr.txt' : 'C:/', 'dir')
	dir.list('ldir', 'Disco E:',						'E:/', 'dir')
	dir.list('ldir', 'Seagate Wireless',				'F:', 'dir')
	dir.list('ldir', 'server',							'..', 'dir')
	dir.list('ldir', 'MP3-All (NUC)   - comparar',		'D:/MP3/', 'cmp')
	dir.list('ldir', 'WD3/Pub/MP3-All - comparar',		'//WD3/Pub/MP3-All', 'cmp')
  },
  //------------------------- prepara para mostrar lista de diretório
  on: false,
  set: function(){
	dir.on = true;
	if (set.tabDev) $('#d1311').addClass('on');	// recolha menu das pags.
	cp.remOn(['swpCam'])	// desative sweep cam
	sys.outRls()		// recolha subpágs. botão wan/lan e relés
	$('#camP').css({left:5})// desloque subpág. cams para esquerda
	dir.camCurr = cam.curr;	// salve camera atual
	li.clear('ldir')
	cp.hide([
		'camsBtn',		// esconda botões das câmeras
		'botCam1',		// botões cam1
		'botCam3',		// botões cam3
		'd2316',		// campo texto de procura de arquivos (camPage)
		'd2311',		// lista de dados achados
		'dirTeste',		// status de RS232tcp
		'camNavi'		// cam navigation
	])
	dir.nivel = 0;
	$('#dir').show()
  },
  //------------------------- limpa lista de diretórios e arquivos, fecha mídias
	vidLeftPos: 0,
  clr: function(){
	dir.on = false;
	sys.inPag('on_off')		// retorna botão lan/wan
	sys.inPag('btnReles')	// retorna sub-pag relés
	cam.vidState(false)		// recolha barra de tempo e menu lateral
	$('#camP').css("left", dir.vidLeftPos)	// retorna subpág. cams p/ pos. original
	$("#clock").show();
	$('#camsBtn').show()
	$('#dirTeste').show()
	cam.show(dir.camCurr)	// mostre a camera corrente e seus botões
	cp.hide([
		'd2311',		// esconda lista de dados achados
		'dir'			// lista diretório
	])
	C$("#imgDir").src = ""; li.clear("lstTit"); $("#vidTit").texto(""); cp.addOn(['swpCam'])
	if (android || isSafari){ /*C$('#vidCam').pause();*/ $('#vidCam').attr('src','#') }
	if (set.tabDev) $('#d1311').removeClass('on')	// retorna navigation menu
  },
  //------------------------- lê diretório
  call: function(lista, path, arrayReturn, callback){
	cp.rwFile("../txt/phpReturn.txt", "", "w", function(){
		dir.phpReturn();
		dir.time = cp.timeDate()
		path = cp.delUltBar(path);	// elimine a última barra, se houver
		cp.setLoading()
		dir.path = path;
		if (dir.nivel == 0) dir.path0 = path;
		$('#dirTime').texto('')
		if (false){
			chrome.runtime.getPackageDirectoryEntry(function(x){
				x.getDirectory("_locales", {}, function(x) {
					var reader = x.createReader();
					// Assumes that there are fewer than 100 locales; otherwise see DirectoryReader docs
					reader.readEntries(function(y) {
						y = y
					});
				}, errorHandler);
			})


/*			chrome.runtime.getPackageDirectoryEntry(function(x){
				root.getFile("myfile.html", {}, function(fileEntry) {
					fileEntry.file(function(file) {
						var reader = new FileReader();
						reader.onloadend = function(e) {
						// contents are in this.result
						};
						reader.readAsText(file);
					}, errorHandler);
				}, errorHandler);
			})*/

		}
		else
			cp.postForm(chromeApp ? path : 'php/directoryList.php', chromeApp ? "" : { dir: path }, 5000, false, false,
				function(data){	// directory.php: em uso a rotina #3b
					if (data){
						$('#dirTime').texto((cp.timeDate() - dir.time) / 1000 + 's')
				//		cp.rstLoading()
						var func = data.substr(0, 3);
						if (func == "dir"){
							dir.obj = data.substr(3);
							dir.nivel++;
							callback(dir.exeItem(lista, true, '', arrayReturn))
						} else cp.msgErr(data);
					}else { cp.msgErr('directoryList.php êrro: ' + data); cp.rstLoading() }
				},
				function(status) { cp.msgErr('directoryList.php êrro: ' + status); cp.rstLoading() }
			)
	})
  },
  phpReturn: function(){
		cp.rwFile("../txt/phpReturn.txt", "", "r", function(x){
			if (x) cp.setLoading(x)
		//	$('#dirTime').texto(x)
			if (x < 1) setTimeout(dir.phpReturn, 200)
			else cp.rstLoading();
		})
  },
  //------------------------- lê arquivos em pasta de diretório
  file: function(lista, path){
	dir.time = cp.timeDate()
	path = cp.delUltBar(path);	// elimine a última barra, se houver
	cp.setLoading()
	dir.path = path;
	$('#dirTime').texto('')
	$.ajax({
		url: 'php/directoryFileList.php',
		type: 'POST',
		data: {dir: path},
		success: function(data){
			$('#dirTime').texto((cp.timeDate() - dir.time) / 1000 + 's')
			cp.rstLoading()
			var func = data.substr(0, 3);
			if (func == "dir"){
				dir.fileArray = [];
				getFileFromDirArray(dir.path, JSON.parse(data.substr(3)))	// carrega dir.fileArray com arquivos e paths
				dir.fileArray = dir.fileArray.sort(cp.sortByLabel)			// ordene dir.fileArray alfabeticamente
		//		sk.lupa()
				$("#s61").val('');		// apague campo texto de procura de arquivos
				$("#d2316").show();		// mostre caixa com o campo
				C$("#s61").focus()
				$("#d2311").show();		// mostre lista de dados achados
			}else cp.msgErr(data);

			var a;
			function getFileFromDirArray(pathDir, array){
				for (var prop in array){
					var x = array[prop];
					if (x && typeof x === 'object')	// prop é objeto (pasta)
						getFileFromDirArray(pathDir + "/" + prop, x)
					else
						if (a = /(.*)(\.mp3)/.exec(x)) dir.fileArray.push({label: a[1], file: pathDir + "/" + x});
				}
			}
		}
	})
  },
  //------------------------- pesquisa de arquivos de um diretório definido
  search: function(e){	// enter em "s61"
	sk.enterKey = false;
	if (e.keyCode != 13) return;	// enter não foi apertado
	sk.enterKey = true;
	$("#d2316").show()		// mostre campo texto de procura de arquivos (camPage)
	$("#d2311").show()		// mostre caixa da lista
	li.clear("l20005")		// limpe a lista
	$("#serRes").texto("")
	var texto = $("#s61").val(), j = 0, array = [];

	for (var i = 0; i < dir.fileArray.length; i++){
		var label = dir.fileArray[i].label, k = cp.fraseCompare(texto, label, false);	// k = fator de strSimilarity()
		if (k > 0.3){
			j++
			array.push({label: label, file: dir.fileArray[i].file, k: k})
		}
	}

	array = array.sort(cp.sortByK)		// ordene fator k

	for (var i = 0; i < array.length; i++){
		var label = array[i].label;
		li.add("l20005", label + '<a class="fndPag red" style="left:430px">' + Math.round(array[i].k * 100) + '%</a>', array[i].file, img.mus);
	}
	$("#serRes").texto(j)
  },
  //------------------------- item da lista de diretório apertado/acionado
  exeItem: function(lista, folder, itens, arrayReturn){
	if (!lista) return;
//	dir.msg('f: '+folder+' i: '+itens)
	if (folder == "false") dir.playFile(itens)
	else{
		if (folder == 'dir') { dir.call(lista, itens, arrayReturn, function(){}); return }	// leia pasta do diretório
		if (folder == 'cmp') { dir.file(lista, itens); return }	// leia pasta do diretório
		if (itens == '..'){
			dir.path = cp.pathFolder(dir.path);
			dir.path = cp.delUltBar(dir.path);	// elimine a última barra
			dir.nivel -= 2;
			if (dir.path.length >= dir.path0.length) {dir.call(lista, dir.path, arrayReturn, function(){})}	// leia pasta do diretório um nível acima
			else dir.srv();
			return
		}
		if (/box/.test(folder)){	// usado com mp4_Info
			if (/\[.*?\]/.exec(itens)){
				var iconSrc =  C$("#ldir").children[dir.idxLin].children[0].children[0]/*ldir > li[clicado] > a > img(icon)*/, folderExpand = /folder2/.test(iconSrc.src);
				iconSrc.src = folderExpand ? "../img/folder4.png" : "../img/folder2.png";
				if (folderExpand){
					var array = JSON.parse(itens);
					if (array.length > 100)					  { dir.list("ldir", "[array > 100]", "", "box"); return }													// folder é array > 100, mostre "[array > 100]"
					if (array.length < 2 && array[0].prop == 0) dir.list("ldir", array[0].prop, array[0].obj ? JSON.stringify(array[0].value) : array[0].value, "boxB")	// folder é array de um item obj[0], gera lista
					else 		array.forEach(function(item)  { dir.list("ldir", item.prop, item.obj ? JSON.stringify(item.value) : item.value, "box") })				// folder é array > 1 item, gera lista
				}else			 								dir.list("ldir", "", "", "box");																		// folder não é objeto, comprime (recolha diretórios)
			}
			return
		}

		var aux = JSON.parse(dir.obj), dirArray = [];
		aux.forEach(function(x){
			var folder = false;
			if (x.substr(0, 2) == "f:"){
				x = x.substr(2);
				folder = "dir";
			}
			var lbl = x, size = /\(.*?\)/.exec(x.substr(-12));	// se /\((.*?)\)/	[0] = "(xxx)" e [1] = xxx
			if (size) lbl = x.replace(" " + size[0], "");		// filtre " (xxx)"
			if (sys.server && mainPag) dirArray.push({label: lbl, file: dir.path + "/" + lbl + (folder == "dir" ? "/" : ""), filetype: folder == "dir" ? "directory" : "file"})
			else 								 dirArray.push({label: x  , path: dir.path + "/" + x, folder: folder})
		})
		dirArray = dirArray.sort(cp.sortByLabel)	// ordene dirArray alfabeticamente
		if (arrayReturn) return dirArray;			// saída em array

		li.clear(lista)
		if (dir.nivel > 0) dir.list(lista, '..', '..', true)
		dirArray.forEach(function(item){			// gera lista de pastas/arquivos
			dir.list(lista, item.label, item.path, item.folder)
		})
	}
	return false;
  },
  //-------------------------
  msg: function(msg){
	  if (!mobile && !set.tabDev) $('#dirTeste').texto(msg)
  },
  //------------------------- executa arquivo de mídia de diretório
  chanow: 0, chanext: 1,
  playFile: function(itens){
	var path = cp.phpGetEncode(itens)/* codifique "&" e "?" para streamRead.php */, src = 'php/streamRead.php?file=' + path, pathLow = path.toLowerCase();

	if (/(.*)(\.mp4|\.mkv|\.webm|\.avi)/.test(pathLow)){
		$("#vidTit").texto(cp.fileOfPath(itens))
		cam.video = src; cam.show(9); C$("#imgDir").src = "";
	}else

	if (/(.*)(\.jpg|\.png)/.test(pathLow)){ C$("#imgDir").src = src; }
	else

	if (/(.*)(\.mp3)/.test(pathLow)){
		$("#audTit" + dir.chanow).texto(cp.fileOfPath(itens))

		var el = C$("#audDir" + dir.chanow); dir.chanow = dir.chanow == 0 ? 1 : 0;
		el.src = src; el.play();/* el.title = cp.fileOfPath(itens);*/

		$(el).analyser($('#escBtn').hasClass('on'))

		id3Info(path, function(x){ 
			if (x){
				var aux;
				sv.audioInfo["MusicPlayer.Title"]			= x.title || (aux = itens.replace(fi.curPath, "")).substr(0, aux.length - 4);
				sv.audioInfo["MusicPlayer.Album"]			= x.album;
				sv.audioInfo["MusicPlayer.Artist"]			= x.artist;
				sv.audioInfo["MusicPlayer.Genre"]			= x.genre;
				sv.audioInfo["MusicPlayer.TrackNumber"]	= x.track;
				sv.audioInfo["MusicPlayer.Year"]			= x.year;
				sv.audioInfo["Picture.Type"]				= x.picType;
				sv.audioInfo["Picture.Image64"]			= x.image64;
				sv.audioInfo["AudElement"]					= el;

			//	el.src = x.mp3; el.play();/* el.title = cp.fileOfPath(itens);*/
			} else { sv.audioInfo = sv.clearAudioInfo(); sv.audioInfo["MusicPlayer.Title"] = itens };
			sv.audioInfo["Player.Folderpath"]		= fi.curPath;
			sv.audioInfo["Player.Filenameandpath"] = kd.currFile = itens;
			kd.loopInfo()
		})
	}else

	if (/(.*)(\.txt|\.xml)/.test(pathLow)){
		cp.postForm('php/streamRead.php?file=' + path, {}, "", false, false, function(x){
			C$("#imgDir").src = ""; li.clear("lstTit")
			li.add("lstTit", x)
		}, function(x){})
	}else{
		cp.msgErr(path.substr(-3) + ' : mídia não suportada !')
		cp.rstLoading()
	}
  },
  //------------------------- gera lista de diretórios
  idxLin: 0,
  list: function(lista, texto, path, folder){
	if (!lista) return;
	var objPath = /\[.*?\]/.exec(path);

	if (!/box/.test(folder)){
		var size = /\(.*?\)/.exec(path.substr(-12)), txt = texto;	// se /\((.*?)\)/	[0] = "(xxx)" e [1] = xxx
		if (size){
			path = path.replace(" " + size[0], "");	// filtre " (xxx)"
			txt = texto.replace(" " + size[0], "");
		}
	}else{
		if (objPath){	// array?
			var objIdx = JSON.parse(path), obj = dir.objBox[objIdx[0]], objAnterior, array = [];
			for (var key = 1; key < objIdx.length; key++) { objAnterior = obj; obj = obj[objIdx[key]]; }	// indexador de objetos em path
			if (cp.isObjEmpty(obj)){	// objeto vazio, não possui properties
				objPath = false;
				if (obj.constructor.name == "Array" && !obj.length) return;
				texto += " : " + objAnterior[objIdx[objIdx.length - 1]] + " (" + obj.constructor.name + ")";
			}else{
				for (var prop in obj){
					var val = obj[prop], pathIdx = JSON.parse(path);
					if (typeof val === "function" || dir.excludeProps(prop)) continue;
					if (typeof val !== "object") array.push({prop: prop, value: val,	 obj: false})
					else   { pathIdx.push(prop); array.push({prop: prop, value: pathIdx, obj: true }) };
				}
				path = JSON.stringify(array);
				if (folder == "boxB"){
				//	dir.exeItem(lista, "boxF", path)
					var array = JSON.parse(path);
/*					if (array.length < 2) 
						if (array[0].prop == 0) 
							dir.list("ldir", array[0].prop, array[0].obj ? JSON.stringify(array[0].value) : array[0].value, "boxB");*/
					array.forEach(function(item) { dir.list("ldir", item.prop, item.obj ? JSON.stringify(item.value) : item.value, "box") })	// gera lista
					return
				}
			}
		}else{
			texto += " : " + path;
		}
		var txt = texto;
	}

	var ul		= C$('#' + lista),
		e_li	= document.createElement('li'),
		e_a		= document.createElement('a'),
		e_img	= document.createElement('img'),
		tagImg	= img.blank,
		f		= folder == 'dir' || folder == 'cmp' || /box/.test(folder) ? '"' : '',
		aspas	= /box/.test(folder) ? "'" : '"';	// se box, aspas simples:	'{"porperties":"value".....}'
		aux		= txt.substr(-3, 3).toLowerCase(),
		style	= '"> ';	// fechamento <img...

	if (aux == 'jpg' || aux == 'png')	tagImg = "img/jpg_35x35.png";
	if (aux == 'mp3')					tagImg = img.mus;
	if (aux == 'mp4' || aux == 'mkv' ||
		aux == 'avi' || aux == 'ebm')	tagImg = img.vid;
	if (aux == 'nfo')					tagImg = "img/nfo_icon.png";
	if (aux == 'm3u')					tagImg = "img/m3u_icon.png";
	if (aux == 'exe')					tagImg = "img/exe_icon.png";
	if (aux == 'txt' || aux == 'xml')	tagImg = "img/txt_icon.png";
	if (folder == 'box'){
		tagImg = objPath ? img.folder : "img/txt_icon.png";
		var paddLeft = ul.children[dir.idxLin].children[0].children[0].style.paddingLeft;		// valor do deslocamento da linha clicada
		if (paddLeft) style = '" style="padding-left:' + (parseInt(paddLeft, 10) + 8) + 'px">';	// se linha clicada está deslocada, acresc. 8 pontos de desloc. na próx. linha
		else		  style = '" style="padding-left:8px">';
	}else if (folder)					tagImg = img.folder;

	/*var aux = '["' + lista + '","' + folder + '","' + path + '"]';*/
	e_a.innerHTML = '<img src="' + tagImg + style + texto;	// icon-image + ...> + texto
	e_a.innerHTML += '<img src="../img/blank.png" title="' + path/*aux*/ + '" name="' + lista + '" lang="' + folder + '" class="abs" style="left:3px;width:265px;"> '; // toda a linha ativa ao toque
	e_li.appendChild(e_a)
	if (folder == 'box'){
		var idxNextLin = dir.idxLin + 1, iconImgLin = ul.children[dir.idxLin].children[0].children[0], paddLeft = parseInt(iconImgLin.style.paddingLeft) || 0/*valor do deslocamento da linha clicada*/;
		if (/folder4/.test(iconImgLin.src)){// insira sub-grupo, se folder vermelho na linha clicada
			// procure fim do sub-grupo, ou seja, não tenha próx. linha ou até que o desloc. da próx. linha seja <= que o desloc. da linha clidada
			while ( ul.children.length/*núm de linhas da lista*/ > idxNextLin && !((parseInt(ul.children[idxNextLin].children[0].children[0].style.paddingLeft) || 0) <= paddLeft) ) idxNextLin++;
			li.itemIns(lista, idxNextLin, e_li)		// insira linha no fim do sub-grupo
		}else								// remova sub-grupo
			// remova linha se tiver linha após e se seu desloc. esq. for > que desloc. da linha clicada
			while ( ul.children.length/*núm de linhas da lista*/ > idxNextLin && parseInt(ul.children[idxNextLin].children[0].children[0].style.paddingLeft) > paddLeft )
				li.itemRem(lista, dir.idxLin + 1);	// remova linha no início do sub-grupo, que é após linha cliclada
	}else
		ul.appendChild(e_li)	// adiciona linha no final da lista
  },
  //------------------------- lê arquivos (modo arquivo)
  fileRead: function(path, callback){
	dir.time = cp.timeDate()
	/*C$('#vidCam').pause();*/ $('#vidCam').attr('src','#')	// limpe buffer de vídeo
	if (C$("#audDir")) { if (C$("#audDir").paused == false) C$("#audDir").pause() }	// pare de tocar música
	dir.fileMode(path, '', function(x){
		$('#dirTime').texto((cp.timeDate() - dir.time) / 1000 + ' s - modo arquivo')
		callback(x)
	})
  },
  //------------------------- deleta arquivos
  delFile: function(path, callback){
	dir.fileMode(path, 'delete', function(x){
		if (x != 'deleted' && x != 'nex') cp.msgErr('arquivo não foi deletado');
		callback(x)
	})
  },
  //------------------------- usado por dir.fileRead(..) e dir.delFile(..)
  fileMode: function(path, modo, callback){
	$.ajax({
		url: 'php/fileRead.php',
		type: 'POST',
		data: { file: path, mode: modo },
		error: function(xhr, status) { cp.msgErr('fileRead.php ' + status); callback(null) },
		success: callback
	})
  },
  //------------------------- mostra resultado da análise de mp4Box
  objBox: {},
  objList: function(obj){
	dir.objBox = obj;
	var dirArray = [];
	for (var prop in obj){	// {box, info}
		if (prop == "box"){
			var objBox = obj["box"]
			for (var prop in objBox)	// {box}
				if (subBox(objBox, prop)) dirArray.push({label: prop, path: JSON.stringify(["box", prop]), folder: "boxF"});
		}else	if (subBox(obj,    prop)) dirArray.push({label: prop, path: JSON.stringify([	   prop]), folder: "boxF"});
	}
	dirArray.forEach(function(item) { dir.list("ldir", item.label, item.path, item.folder) })	// gera lista

	function subBox(obj, prop){	// true/false = instanceof BoxParser.Box
		var res = hasBox(obj, prop); if (res !== "sub") return res;
		var subobj = obj[prop];
		for (var subprop in subobj){
			res = hasBox(subobj, subprop);
			if (res === true ) return true;
		//	if (res === false) continue;
			if (res === "sub") subBox(subobj, subprop)
		}
	}

	function hasBox(objSub, prop){	// true = [has Box...]		false = [no Box...]		"sub" = [object to test]
		var val = objSub[prop];
		if (dir.excludeProps(prop)) return false
		else
			if (typeof val === "function" || typeof val !== "object") return false
			else
				if (val instanceof BoxParser.Box || val instanceof clpParse) return true
				else return "sub";
	}
  },
  //-------------------------
  excludeProps: function(prop){	// retorna true se prop in ["hdr_size", "start",...]
	  return (["hdr_size", "start", "boxes", "subBoxNames", "entries", "samples", "references", "items", "item_infos", "extents"].indexOf(prop) > -1);
  }
}




//==================================================== Audio - Server




var sv = {
  audioInfo: {}, playlist: [], isPlaying: {pos: null, id: 0}, pauseBtn: false, audTmr: 0,
  nextTime: 10, // tempo final para troca p/ próx. música

  clearAudioInfo: function(){
	return{
		"MusicPlayer.Album": "",
		"MusicPlayer.Artist": "",
		"MusicPlayer.Title": "",
		"MusicPlayer.Genre": "",
		"MusicPlayer.TrackNumber": "",
		"MusicPlayer.Year": "",
		"Player.Duration": "",
		"Player.Time": "",
		"Player.Filenameandpath": "",
	//	"Player.Folderpath": "",
		"Playlist.Position": "0",
		"VideoPlayer.Title": "",
		"Src": "audDir0",
		"Picture.Type": "",
		"Picture.Image64" : "",
		"AudElement": "#audDir0"
	}
  },
//------------------ toca próxima música da playlist (server mode)
  playMusic: function(modo){
	if (sv.isPlaying.pos === null) { $("#d37, #d38").texto(0); return }	// não toque playlist, apague botões transport
	else
		if ( modo == "next" && (sv.isPlaying.pos < (sv.playlist.length - 1)) ) sv.isPlaying.pos++;
		else
			if ( modo == "prev" && (sv.isPlaying.pos > 0) ) sv.isPlaying.pos--;
			else
				if ( modo != "play" ) { $("#d37, #d38").texto(0); return };

	sv.isPlaying.id = sv.playlist[sv.isPlaying.pos]["id"]
  	dir.playFile(sv.playlist[sv.isPlaying.pos]["file"]);
  }
}


sv.audioInfo = sv.clearAudioInfo();

// le arquivo mp3 e decodifica ID3 tag:
function id3Info(path, callback){
	if (!mobile && !set.tabDev && mainPag) $('#jsonTeste').texto("id3 Info").css({left: 380})
//	var time1 = cp.timeDate();
	cp.postForm(chromeApp ? '' : 'php/id3read.php?file=' /*'php/streamRead.php?file='*/ /*'php/id3read2.php?file='*/ + path, null, 15000, false, true,
		function(blob){
			if (!mobile) $('#jsonTeste').texto("");
//			var time2 = cp.timeDate() - time1;
			if (blob && blob != "timeout"){

				var fileString = new FileReader();
				fileString.onload = function(e){
					var id3 = id3_decode(e.target.result/*.substr(0, 1024)*/)
					id3.mp3 = (window.URL || window.webkitURL).createObjectURL(blob);/* 'data:audio/mp3;base64,' + btoa(blob); */;
					callback(id3)
				//	callback(e.target.result.substr(0, 1024))
				//	callback(id3_show(e.target.result/*.substr(0, 500)*/))
				};
				fileString.readAsBinaryString(blob);

/*				var fileArray = new FileReader();
				fileArray.onload = function(e){
					$("").audMp3(e.target.result)
				};
				fileArray.readAsArrayBuffer(blob);*/ // readAsArrayBuffer(blob); readAsBinaryString(blob); readAsDataURL(blob); readAsText(blob, [optional] in DOMString encoding);
			}else	{ cp.msgErr("ID3 timeout"); callback({}) };
		}, 
		function() { cp.msgErr("ID3 timeout"); callback({}) }
	)

	// ID3 decode via PHP (id3read2.php)
	function id3_show(txt){
	//	var id3_array = flatArray(txt);	// só para debug
		var id3infoSize  = txt.charCodeAt(3) * 256 + txt.charCodeAt(4),
			id3infoTxt   = txt.substr(5, id3infoSize),
			id3info		 = JSON.parse(id3infoTxt),
			id3imageSize = txt.charCodeAt(id3infoSize + 5) * 65536 + txt.charCodeAt(id3infoSize + 6) * 256 + txt.charCodeAt(id3infoSize + 7),
			id3image	 = txt.substr(id3infoSize + 8, id3imageSize);
		id3info.image64  = 'data:' + id3info.picType + ';base64,' + btoa(id3image);
		id3info.imagesize = id3imageSize;
		return id3info;
	}

	// ID3 decode via javascript
	function id3_decode(txt){
	//	return flatArray(txt);	// só para debug
		var id3ver = findFrame("ID3"),
			genreCode = [ 'Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge', 'Hip-Hop', 'Jazz', 'Metal', 'New Age', 'Oldies', 'Other', 'Pop', 'R&B', 'Rap', 'Reggae', 'Rock', 'Techno',
				'Industrial', 'Alternative', 'Ska', 'Death Metal', 'Pranks', 'Soundtrack', 'Euro-Techno', 'Ambient', 'Trip-Hop', 'Vocal', 'Jazz+Funk', 'Fusion', 'Trance', 'Classical', 'Instrumental', 'Acid',
				'House', 'Game', 'Sound Clip', 'Gospel', 'Noise', 'Alternative Rock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative', 'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 'Darkwave',
				'Techno-Industrial', 'Electronic', 'Pop-Folk', 'Eurodance', 'Dream', 'Southern Rock', 'Comedy', 'Cult', 'Gangsta', 'Top 40' ];	// http://www.multimediasoft.com/amp3dj/help/index.html?amp3dj_00003e.htm
		if (!android) cp.msgErr("ID3 ver.: " + (id3ver ? id3ver : 1));
		if (!id3ver){
			var id3v1 = txt.substr(-128);
		//	return flatArray(id3v1);	// só para debug
			if (id3v1.substr(0, 3) == "TAG"){
		// ID3v1:
				return {	// info em https://en.wikipedia.org/wiki/ID3, seção ID3v1
					title:	id3v1.substr(3 , 30),
					artist:	id3v1.substr(33, 30),
					album:	id3v1.substr(63, 30),
					year:	id3v1.substr(93,  4),
					comm:	id3v1.substr(97, 28),
					track:	id3v1.charCodeAt(125) == 0 ? id3v1.charCodeAt(126) : "",
					genre:	genreCode[ id3v1.charCodeAt(127) ]
				}
			} else { cp.msgErr("erro ID3: sem informações"); return {} }
		};
		var picType = "";
		if (id3ver == 2){
		// ID3v2.2:
			var image = btoa(findFrame("PIC"));
			return {	// info em http://id3.org/id3v2-00
				title:	findFrame("TT2"),
				artist: findFrame("TP1"),
				band:	findFrame("TP2"),
				track:	findFrame("TRK"),
				year:	findFrame("TYE"),
				album:	findFrame("TAL"),
				genre:	findFrame("TCO"),
				disco:	findFrame("TPA"),
				comm:	findFrame("COM"),
				image64: picType ? 'data:' + picType + ';base64,' + image : "",
				picType: picType,
			}
		}
		if (id3ver == 3 || id3ver == 4){
		// ID3v2.3 e ID3v2.4:
			var image = btoa(findFrame("APIC")), geN, gen, tx = [], txAutor = "", txStart = 0, inx;

			while ((inx = txt.indexOf("TXXX", txStart)) != -1){ // text information ?
				var size = frameSize(inx);
				if (txt.substr(inx += 11, 2) == "\xFF\xFE") { inx += 2; size -= 2 };
				var aux = txt.substr(txStart = inx, size); txAutor = /author/.test(aux) ? aux.substr(7, size - 7) : "";
				tx.push(aux);
			}
			return {	// info em http://id3.org/id3v2.4.0-frames	
				title:	findFrame("TIT2"),
				artist: findFrame("TPE1") || txAutor,
				band:	findFrame("TPE2"),
				track:	findFrame("TRCK"),
				year:	findFrame("TYER"),
				album:	findFrame("TALB"),
				comm:	findFrame("TIT1"),
				genre:	(geN = /\(\d+\)/.exec(gen = findFrame("TCON"))) ? genreCode[ /\d+/.exec(geN)[0] ] + " " + gen : gen,	// "(xxx)" ? genCode[xxx] : gênero
				txxx:	tx,	// "text information" array
				image64: picType ? 'data:' + picType + ';base64,' + image : "",
				picType: picType,
				picSize: image.length,
		//		picArray: flatArray(txt.substr(0, 500))	//# teste
		//		mp3: 'data:audio/mp3;base64,' + btoa(txt)
			}
		}

		function findFrame(frame){
			function imgSep(x){
				var pictyp = /png|jpg|jpeg/.exec(picType); if (!pictyp) { cp.msgErr("ID3 picture error: " + picType); return "" };
				for (var i = x; i < idx + 100; i++) if ( txt[i] == (pictyp[0] == "png" ? "\x89" : "\xFF") ) break;	// localize byte início da imagem-header (veja abaixo tabela)
				return txt.substr(i, size - i + idx)
			}
			var idx = txt.indexOf(frame);
			if (idx != -1){
				if (frame == "ID3") return idx < 10 ? txt.charCodeAt(idx + 3) : false;	// se "ID3" se encontra dentro dos 10 primeiros bytes, 2 (ID3v2.2)	ou	3 (ID3v2.3/ID3v2.4)
				var size = frameSize(idx);
				if (frame == "APIC"){	// picture frame ID3v2.3: "APIC" (frame) + $xx xx xx xx (frame size) + "image/jpeg" $00 (image format) + $xx (picture type) + <string> $00 + <binary data>
					for (var i = idx += 11; i < idx + 50; i++) if (txt.charCodeAt(i) == 0) break;		// detecta $00 (fim de string)
					picType = txt.substr(idx, i - idx).toLowerCase();	// picture type: "image/png",	"image/jpg"	ou	"image/jpeg"
					if (!picType){
						for (var i = idx += 2; i < idx + 50; i++) if (txt.charCodeAt(i) == 0) break;	// detecta $00 (fim de string)
						picType = txt.substr(idx, i - idx);
						if (/bmp/.test(picType)) picType = "image/bmp";
						return txt.substr(++i, size - i + idx)	// image binary data
					}
					return imgSep(idx + picType.length + 1)		// image binary data
				};
				if (frame == "PIC"){	// picture frame ID3v2.2: "PIC" (frame) + $xx xx xx (frame size) + "PNG" (image format) + $xx (picture type) + <string> $00 + 	<binary data>
					picType = "image/" + txt.substr(idx += 7, 3).toLowerCase();	// picture type: "image/png",	"image/jpg"	ou	"image/jpeg"
					return imgSep(idx + 3 + 1)					// image binary data
				};
				// id3v2.2: $xx xx xx    (frame) + $xx xx xx    (string size) + $xx       (text encoding) + <string> $00
				// id3v2.3: $xx xx xx xx (frame) + $xx xx xx xx (string size) + $xx xx xx (text encoding) + <string> $00
				if (txt.substr(idx + 11, 2) == "\xFF\xFE") { idx += 2; size -= 2 };		// formatação pré-string, somente para id3v2.3
				return txt.substr(idx + (id3ver == 2 ? 7 : 11), size).replace(/\x00/g, "");
			} else return "";
		}

		function frameSize(x){
				if (id3ver == 2) return										txt.charCodeAt(x + 3) * 65536 + txt.charCodeAt(x + 4) * 256 + txt.charCodeAt(x + 5) - 1
				else			 return	 txt.charCodeAt(x + 4) * 16777216 + txt.charCodeAt(x + 5) * 65536 + txt.charCodeAt(x + 6) * 256 + txt.charCodeAt(x + 7) - 1;
		}
	}
}
/*
ID3 ver. 1: Ace of Base - Cruel Summer.mp3
			Avril Lavigne - Complicated.mp3 (não tem nenhuma informação)
ID3 ver. 3: Taio Cruz - Dynamite.mp3 (bmp image)
			Meghan Trainor - All About That Bass.mp3 (png image)
			Gino Vannelli - Black Cars (Special Dance Mix).mp3 (não mostra nada)
			Atfc f. Lisa Millett - Sleeptalk.mp3 (ID3 picture error)
ID3 ver. 4: Ashford & Simpson - Found A Cure.mp3
			Colbie Caillat - Begin Again (Reggae Version).mp3

image headers:
jpeg/jpg:	0xff + 0xd8 + 0xff + 0xe0
bmp:		"BM" +  4 bytes  (Total size included "BM" magic)
gif:		"GIF" + "87a" or "89a" + 2 bytes  (Logical Screen Width) + 2 bytes  (Logical Screen Height)
png:		0x89 + "PNG" + 0x0D + 0x0A + 0x1A + 0x0A
*/

function flatArray(arr){
	var outBuffer = [];
	for (var i = 0; i < arr.length; i++){
		var char = arr[i];
		if (/[A-Za-z0-9]|[-.()]/.test(char)) outBuffer.push(char)
		else								 outBuffer.push(": " + arr.charCodeAt(i) + " : " + char);
	}
	return outBuffer;
}