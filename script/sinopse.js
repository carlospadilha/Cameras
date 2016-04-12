//-------------------------  será usado em sino.replaceObj
var mapObj = {
	"&ecirc;":	"ê", "&#234;":	"ê",
	"&eacute;": "é", "&#233;":	"é",
	"&egrave;":	"è",
	"&Eacute;": "É", "&#201;":	"É",
	"&iacute;": "í", "&#237;":	"í",
	"&iuml;":	"ï",
	"&Iacute;": "Í",
	"&aacute;": "á", "&#225;":	"á",
	"&agrave;": "à", "&#224;":	"à",
	"&acirc;":	"â",
	"&atilde;": "ã", "&#227;":	"ã",
	"&auml;":	"ä",
	"&aring;":	"å",
	"&Aacute;": "Á",
	"&Acirc;":	"À",
	"&oacute;": "ó", "&#243;":	"ó",
	"&ograve;": "ò",
	"&ocirc;":	"ô",
	"&otilde;": "õ", "&#245;":	"õ",
	"&ouml;":	"ö",
	"&Oacute;":	"Ó", "&#211;":	"Ó",
	"&uacute;": "ú",
	"&ucirc;":	"ù",
	"&ccedil;": "ç", "&#231;":	"ç",
	"&nbsp;":	" ", "&#10;":	" ",
	"&ndash;":	"ñ",
	"&mdash;":	"ó",
	"&ordf;":	"ª", "°":		"º",
	"&amp;":	"&",
	"&rsquo;":	"'",
	"&quot;":	'"',					// aspa dupla
	"&ldquo;":	'"', "&#8220;":	'"',	// aspa esquerda
	"&rdquo;":	'"', "&#8221;": '"'		// aspa direita
  },
//---------------------------------------------------- será usado em sino.reLabelMap()
  filmMapObj = {
	" EP":		"",	// audio inglês/português
	" PP":		"",	// audio portugues somente
	" 3DSBS":	"",	// filme 3D SBS
	" 3DOU":	""	// filme 3d OU
  };


//==================================================== biblioteca sino (sinopses)


var sino = {
  array: [],
  //------------------------- insere novo título de www.adorocinema.com
  add: function(e){
	if (e.keyCode != 13) return;	// enter não foi apertado
	fi.backMenu = "sinops2";
	var idx = $("#s71").val();
	if (!idx){ sino.manualAdd($("#s81").val()); return }
	sino.addMsg("conectando com www.adorocinema.com");
	addSinFilmesOuSeries("filmes/filme-")

	function addSinFilmesOuSeries(filmesOuSeries){

		var filtreAdorocinema = function(x){
			var diretIdx = x.indexOf('itemprop="director"'), diretor = "";
			if (diretIdx != -1){
				var	diretTxt = x.substr(diretIdx), diretIdx2 = diretTxt.indexOf('title="'), diretTxt2 = diretTxt.substr(diretIdx2 + 7), diretFim = diretTxt2.indexOf('"'); diretor = diretTxt2.substr(0, diretFim)
			}
			var labelIdx = x.indexOf('"titleFormed":"'), label = "";
			if (labelIdx != -1){
				var	labelTxt = x.substr(labelIdx + 15), labelFim = labelTxt.indexOf('"'); label = labelTxt.substr(0, labelFim); label = sino.delTags(label)
			}
			var sinopseIdx = x.indexOf('itemprop="description"'), sinopse = "";
			if (sinopseIdx != -1){
				var	sinopseTxt	= x.substr(sinopseIdx + 24), sinopseFim = sinopseTxt.indexOf('</p>'), sinopse = sinopseTxt.substr(0, sinopseFim); sinopse = sino.delTags(sinopse)
			}
			if (/http:\/\//.exec(sinopse)) /*sinopse = "";*/alert("sinopse com http://");
			return { "label": label, "diretor": diretor, "sinopse": cp.UTF8(sinopse) }
		}

		sino.readS(function(x){	// leia "sinopse.txt"
			if (!x) return;
			sino.array = x

			cp.proxyAjax("http://www.adorocinema.com/" + filmesOuSeries + idx + "/", "", 15000, "", function(dado){
				if (!dado) { sino.addMsg("www.adorocinema.com fora do ar"); return };
				if (/Erro interno do servidor/.exec(dado) || /The service is unavailable/.exec(dado) || /Bad Gateway/.exec(dado) || /timeout/.exec(dado) || !dado){
					if (filmesOuSeries == "filmes/filme-")	{ sino.addMsg("tentando ver se é série"); addSinFilmesOuSeries("series/serie-"); return }
					else									{ sino.addMsg("filme/série não encontrado!"); return }
				};

				var x = filtreAdorocinema(dado) /* extraia {label, diretor, sinopse} */, idxExiste = false;
				x.idx = idx = idx + (filmesOuSeries == "series/serie-" ? "s": "");
				sino.setInputFields(x);

				// verifica se ID já existe (sinopse existe):
				for (var i = 0; i < sino.array.length; i++) if (sino.array[i]["idx"] == idx) idxExiste = true;
				idxExiste ? sino.addMsg("sinopse já existe", "modificar") : sino.addMsg("nova sinopse", "gravar")
			})
		})
	}
  },
  //------------------------- compara nomes de filmes dos servidores com www.adorocinema.com
  compFilmes: function(){
	sino.setList()
	li.addL12005("==== comparar filmes com banco de sinopses ====")
	sino.readS(function(sinArray){
		if (!sinArray) return;
		li.addL12005("arquivo sinopse.txt, lido")

		sinArray.forEach(function(item, i){
			var sinopse = item.sinopse, label = item.label;
			if ((/&/.exec(label) && !/& /.exec(label)) || /&/.exec(sinopse) && !(/& /.exec(sinopse) || /R&B/.exec(sinopse)))	// verifique se ainda existe simbolos &xxx;
				var a = a;	// debug
			if (/</.exec(sinopse) || />/.exec(sinopse))	// idem elementos
				li.addL12005("sinopse <..> " + item.label)
		})

		sinArray.sort(cp.sortByLabel)	// ordene para facilitar a procura adiante em "Binary Search algorithm"

		cp.readWrite("../txt/videoFile.txt", "", "r", "json", function(x){
			if (x == "parsererror") { li.addL12005("erro leitura do arquivo videoFile.txt"); return };
			li.addL12005("arquivo videoFile.txt, lido")
			sk.videoArray = x; sk.lstVidRdy = true
			sk.videoArray.sort(cp.sortByLabel);	// ordene alfabeticamente

			dir.time = cp.timeDate()
			sino.array = [];
			sinFilCmp(0)
			var blankSinopse = [];

			var compMode = true;
			li.idxAnterior = 0; li.loopTime = 0;

			function sinFilCmp(i){
				if (i < sk.videoArray.length){
					var matchBest = 0/*fator de maior semelhança do videoArray.label com sinoArray.label*/, matchIdx, filme = sk.videoArray[i]["label"], path = sk.videoArray[i]["file"];
					filme = sino.normLabel(filme);	// elimine .. =, EP, PP, 3DSBS e 3DOU; ano no fim; reposicione artigo no início;

/*					// Binary Search Algorithm, itens devem estar ordenados:
					var upperBound = sinArray.length - 1, lowerBound = 0, found = false, aux = "";
					while (lowerBound <= upperBound){
						var mid = Math.floor((upperBound + lowerBound) / 2);
						if (sinArray[mid]["label"] < filme) lowerBound = mid + 1
						else if (sinArray[mid]["label"] > filme) upperBound = mid - 1
							 else { found = true; matchIdx = mid; matchBest = 1; break };
					}*/
					// Sequential Search:
					var j = -1, found = false;
					while (j++ < sinArray.length - 1) if (filme == sinArray[j]["label"]) { found = true; matchIdx = j; matchBest = 1; break };
					
					if (!found){ 
						var j = -1, matchFactor = 0;
						while (j++ < sinArray.length - 1){
							matchFactor = cp.fraseCompare(filme, sinArray[j]["label"], compMode, true);
							if (matchFactor > matchBest) { matchIdx = j; if ((matchBest = matchFactor) == 1) break }
						}
						if (matchBest == 0) { compMode = false; sinFilCmp(i); return };	// se com fraseArrayComp() não encontrou, tente comparar com strSimilarity()
					}
					compMode = true;
					matchBest = Math.round(matchBest * 100);
					var sinopse = sinArray[matchIdx]["sinopse"];
					if (!sinopse) blankSinopse[blankSinopse.length] = sinArray[matchIdx]["label"];

					sino.array.push({ "label": filme, "path": path, "title": sinArray[matchIdx]["label"], "sinopse": sinopse, "match": matchBest, "idx": matchIdx })

					if (matchBest == 100){ var item = sinArray[matchIdx]; sinArray.splice(matchIdx, 1); sinArray.push(item) }	// jogue o item encontrado para o fim de sinArray

					li.linRem("l12005", 4, 2000)	// remova 2000 linhas a partir da linha 4
					li.addL12005('filme: ' + i++)
					if (li.loopCtrl(sk.videoArray.length, i, "compara filmes")) setTimeout(function(){ sinFilCmp(i) }, 0)	// control loop da lista
					else sinFilCmp(i);
				}else{
					cp.rstLoading()
					li.addL12005("tempo: " + (cp.timeDate() - dir.time) / 1000 + " s")
					cp.readWrite("../txt/sinopseFilmes.txt", sino.array, "w", "json", function(x){
						if (x == "true") li.addL12005("arquivo de sinopses, gravado")
						li.addL12005("sinopses em branco: " + blankSinopse.length)
						for (var i = 0; i < blankSinopse.length; i++) li.addL12005(" = " + blankSinopse[i], '["manualAdd", "' + blankSinopse[i] + '", "", true]'/*, "sino.manualAdd('" + blankSinopse[i] + "','',true)"*/)
					})
				}
			}
		})
	})
  },
  //------------------------- ordena e organiza sinopse.txt
  compact: function(){
	sino.setList()
	li.addL12005("==== compactar sinopse.txt ====")
	sino.readSf(function(x){	// leia "sinopseFilmes.txt"
		if (!x) return;
		var sinoFilmeArray = x;
		sino.readS(function(x){	// leia "sinopse.txt"
			if (!x) return;
			var sinoarray = /*sino.textConv*/(x), arrayFinal = [];
			// compacta sinopses:
			li.addL12005("compactando...")
			for (var i = 0; i < sinoFilmeArray.length; i++){
				var item1 = sinoFilmeArray[i], existe = false;
				for (var j = 0; j < sinoarray.length; j++){
					var item2 = sinoarray[j];
					if (item1.title == item2.label){ arrayFinal.push({ "label": item2.label, "diretor": item2.diretor, "sinopse": item2.sinopse, "idx": item2.idx }); existe = true; break }
				}
				if (!existe) li.addL12005("* não existe: " + item1.title)
			}
			// ordena sinopses:
			li.addL12005("ordenando...")
			sinoarray = arrayFinal; arrayFinal = [];
			arrayFinal[0] = sinoarray[0];
			for (var i = 1; i < sinoarray.length; i++){
				var item1 = sinoarray[i], idx1 = + item1.idx;
				for (var j = 0; j < arrayFinal.length; j++){
					var item2 = arrayFinal[j], idx2 = + item2.idx;
					if (idx2 > idx1) break; 
				}
				arrayFinal.splice(j, 0, { "label": item1.label, "diretor": item1.diretor, "sinopse": item1.sinopse, "idx": item1.idx })	// substitua item
			}
			// elimina duplicatas:
			li.addL12005("eliminando duplicatas...")
			for (var i = 0; i < arrayFinal.length; i++){
				var item1 = arrayFinal[i];
				for (var j = i + 1; j < arrayFinal.length; j++){
					var item2 = arrayFinal[j];
					if (item2.idx == item1.idx)
						if (item1.label == item2.label) arrayFinal.splice(i, 1)	// deleta duplicata
				}
			}
			sino.writeS(arrayFinal, function(x){ if (x === "true") li.addL12005("Compactação de sinopse.txt completa !") })	// grava "sinopse.txt"
		})
	})
  },
  //------------------------- substitua símbolos &xxx; por caracteres e elimine tags
  delTags: function(texto){
	texto = sino.replaceObj(texto);		// substitua símbolos &xxx (mapObj) e outros símbolos; por caracteres normais
/*	texto = cp.delTag(texto, "span");	// elimine elementos <span..> </span>
	texto = cp.delTag(texto, "p");		// elimine elementos <p..>
	texto = cp.delTag(texto, "u");
	texto = cp.delTag(texto, "br");
	texto = cp.delTag(texto, "b");
	texto = cp.delTag(texto, "!--");
	texto = cp.delTag(texto, "i");
	texto = cp.delTag(texto, "div");
	texto = cp.delTag(texto, "strong");
	texto = cp.delTag(texto, "em");
	texto = cp.delTag(texto, "address");*/

	texto = cp.delMultiTag(texto, ["span", "p", "u", "br", "b", "!--", "i", "div", "strong", "em", "address"])
	return texto
  },
//-------------------------- filtra e substitui caracteres especiais: &...;
  reMap: new RegExp(Object.keys(mapObj).join("|"), "g"),	// o mesmo que /&ecirc;|&eacute;|&aacute;|&iacute;|&atilde;|&otilde;|&ccedil;|&nbsp;/g
  replaceObj: function(x){
		return x.replace(sino.reMap, function(matched){ return mapObj[matched] })
  },
  //------------------------- idem sino.delTags para todas as sinopses da array
  textConv: function(array){
	array.forEach(function(item, i){
		var sinopse = item.sinopse, label = item.label;
		array[i]["sinopse"] = sino.delTags(sinopse);
		if (/&/.exec(label)) array[i]["label"] = sino.replaceObj(label);	// corrija símbolos &xxx
	})
	return array
  },
  //------------------------- insere manualmente sinopses
  manualAdd: function(label, id, renew){	// se label em sinopse.txt, preenche os campos "Título", "Diretor" e "Sinopse" com dados.
  	var x = "";
	if (id) x = $("#s71").val();
	sino.readS(function(array){
		if (!array) return;
		sino.array = array;
		if (renew){
			li.clear("l12005");
			li.addL12005('<a id="sinoGrav" class="abs btnled w1" style="left:375px;top:0">gravar</a>');
			sino.inputFields();
			$("#sinoGrav").btn(function(){ sino.itemWrite() })
		}
		if (x)     sino.existe(sino.array, "", x);
		if (label) sino.existe(sino.array, label)
	})
  },
  //------------------------- lista da sinopse
  inputFields: function(){
	li.addL12005("Título:")
	li.addL12005('<input id="s81" onkeypress="sino.add(event)" type="text" class="inputTitle" style="height:20px"/>')
	li.addL12005("Diretor:")
	li.addL12005('<input id="s82" type="text" class="inputTitle" style="height:20px"/>')
	li.addL12005('<pre class="abs" style="top:186px">  Sinopse:<input id="s84" type="text" class="inputTitle abs" style="left:397px;width:65px;height:20px"/></pre>')
	li.addL12005('<textarea id="s83" class="inputTitle" style="height:220px"/></textarea>')
  },
  //------------------------- grava/modifica sinopse
  itemWrite: function(force){	// force:	false(gravar)	true(modificar)
	if (sino.array == []) return;
	var label = $("#s81").val(), diretor = $("#s82").val(), sinopse = $("#s83").val(), idx = $("#s84").val();
	if (!idx) idx = "m";
	if (!label || !sinopse) return;
	/*if (!force && sino.existe(sino.array, label)) return;	// se force == true, força a gravação, mesmo que a sinopse já exista*/
	// se título ou id existe, localiza posição em sino.array:
	var labelExiste = false, iIns = sino.array.length;
	if (force)	// modificar
		for (var i = 0, insDel = 1; i < sino.array.length; i++){
			var txt = sino.array[i]["label"], id = sino.array[i]["idx"];
			if (idx == id || txt == label) { labelExiste = true; iIns = i; var idx = sino.array[i]["idx"]; break }
		}
	else{		// gravar
		for (var i = 0, insDel = 0; i < sino.array.length; i++){
			var id = sino.array[i]["idx"];
			if (+id > +idx) { iIns = i; break }
		}
	}

	sino.array.splice(iIns, insDel, {"label": label, "diretor": diretor, "sinopse": sinopse, "idx": idx})	// deleta e insere nova sinopse

	sino.writeS(sino.array, function(x){ 
		if (x === "true" || x === true) sino.addMsg("sinopse gravada!", "gravar")	// "true": resposta de php		true: resposta x.createWriter
		else							sino.addMsg("erro de gravação: " + x, "gravar")
	})
  },
  //------------------------- verifica se sinopse já existe. Se label ou id, preenche campos com dados
  existe: function(array, label, id){
	var labelExiste = false
	array.forEach(function(item){
		if ((label && (label == item.label)) || (id && (id == item.idx))) { labelExiste = true; sino.setInputFields(item) }
	})
	labelExiste ? sino.addMsg("sinopse já existe", "modificar") : sino.addMsg("nova sinopse", "gravar")
	return labelExiste
  },
  //------------------------- campos de entrada de dados de sinopses
  setInputFields: function(x){
	$("#s81").val(x.label)
	$("#s82").val(x.diretor)
	$("#s83").val(x.sinopse)
	$("#s84").val(x.idx)
  },
  //------------------------- mostra mensagens na tela de inserção de sinopse e define botão "gravar" ou "modificar"
  tmr: 0,
  addMsg: function(msg, botao){
	msg = msg || "";
	var cmd = 1;
	if (msg) { clearTimeout(sino.tmr); sino.tmr = setTimeout(function(){ sino.addMsg("", botao) }, 3000) }
	if (!botao) { C$("#l12005 li").innerHTML = '<pre>  <pre class="abs" style="top:0">  ' + msg + '</pre>'; return }
	if (botao == "modificar") var cmd = 2;
	C$("#l12005 li").innerHTML = '<pre>  <pre class="abs" style="top:0">  ' + msg + '</pre><a id="sinoBtn" class="abs btnled w1" style="left:375px;top:0">' + botao + '</a></pre>';
	$("#sinoBtn").btn(function(){
		if (cmd == 1) sino.itemWrite(false);
		if (cmd == 2) sino.itemWrite(true);
	})
  },
  //------------------------- normaliza label do filme, elimina " EP", " PP", " 3DSBS", " 3DOU", ano do final, move artigo do final para início (ex: "..., As" ==> As ...) etc...
  reLabelMap: new RegExp(Object.keys(filmMapObj).join("|"), "g"),	// filmMapObj: {" EP": "", " PP": "", " 3DSBS":	"", " 3DOU": ""}
  normLabel: function(x){
	x = x.replace(sino.reLabelMap, function(matched){ return filmMapObj[matched] })	// elimine EP, 3DSBS e 3DOU

	if (x.length < 5 && !/ /.exec(x)) return x;						// label tem menos de 5 letras e não tem espaço, retorne

	if (/#/.exec(x)) x = x.substr(0, x.indexOf("#") - 1);			// ... # ... por ex.: "Ben Hur 1959 # 1ª parte"		elimina " # 1ª parte"

	var ano = x.substr(x.length - 4);
	if (ano > 1900 && ano < 2030) x = x.substr(0, x.length - 5);	// tem ano no final? elimine

	if (/=/.exec(x)) x = x.substr(x.indexOf("=") + 2);				// ... = ..., por ex.: Riddick 1 = Eclipse Mortal EP	elimina "Riddick 1 = "

	if (/,/.exec(x)){												// reposicione artigo no início
		var idx = x.indexOf(","), art = x.substr(idx + 2);
		if (art.length < 4){										// se menos de 3 caracteres: "As " ou "Os "
			var artIdx = art.indexOf(" ");
			art = artIdx == -1 ? art : art.substr(0, artIdx)
			if (/[AOs]/g.exec(art)) x = art + " " + x.substr(0, idx)
		}else{
			var artIdx = art.indexOf("-");							// se "Crônicas de Nárnia, As - A Viagem"
			if (artIdx != -1 && artIdx < 4){
				art = art.substr(0, artIdx)
				if (/[AOs]/g.exec(art)) x = art + x.replace(", " + art, " ");	// "As Crônicas de Nárnia - A Viagem"
			}
		}
	}
	return x
  },
  //------------------------- gerenciar sinopses - listas
  lista: function(){
	fi.backMenu = "sinops1";
	fi.setSrcList()
	fi.listAddSrc("sinops2", "1. adicionar sinopse de adorocinema.com")
	fi.listAddSrc("sinops5", "2. gerar arquivo sinopseFilmes.txt")
	fi.listAddSrc("sinops7", "3. compactar arquivo sinopse.txt")
	fi.listAddSrc("sinops3", "4. listar sinopses e fatores de igualdade")
	fi.listAddSrc("sinops4", "5. alterar sinopse de arquivos.nfo")
	fi.listAddSrc("sinops6", "6. Limpar arquivo sinopseFilmes.txt")
  },
  //------------------------- adiciona/consulta/modifica sinopse
  addMod: function(){
	fi.backMenu = "sinops1";
	sino.setList()
	li.addL12005('<input type="text" id="s71" class="input"/><div class="abs" style="left:210px;top:0px">Id do filme (adorocinema.com)</div>')
	$("#s71").keypress(function(e){	sino.add(e) })
	sino.inputFields()
	C$("#s71").focus()	// posicione cursor dentro do input field
//	setCaretToPos(elem, 0)
  },
  //------------------------- lista grau de igualdade das sinopses
  list: function(){
	fi.backMenu = "sinops1";
	cp.setLoading()
	sino.readSf(function(x){
		if (!x) return;
		sino.array = x;
		sino.setList()
		var match1 = 0, match2 = 0, match3 = 0, match4 = 0, match5 = 0, match6 = 0;
		sino.array.forEach(function(item){
			if (item.match == 100) match1++;
			if (item.match > 89 && item.match < 100) match2++;
			if (item.match > 79 && item.match < 90)  match3++;
			if (item.match > 69 && item.match < 80)  match4++;
			if (item.match > 49 && item.match < 70)  match5++;
			if (item.match < 50)					 match6++;
		})
		li.addL12005("itens        100 %: "		+ match1, '["match", "==", 100]')
		li.addL12005("itens de 90 - 99 %: "		+ match2, '["match", ">", 89, "<", 100]')
		li.addL12005("itens de 80 - 89 %: "		+ match3, '["match", ">", 79, "<", 90]')
		li.addL12005("itens de 70 - 79 %: "		+ match4, '["match", ">", 69, "<", 80]')
		li.addL12005("itens de 50 - 69 %: "		+ match5, '["match", ">", 49, "<", 70]')
		li.addL12005("itens         < 50 %: "	+ match6, '["match", "<", 49]')
		cp.rstLoading()
	})
  },

  matchList: function(a, b, c, d){
	fi.backMenu = "sinops7";
	li.clrArq("l12005")
	sino.array.forEach(function(item){
		var test = false;
		if (a == "==") test = item.match == b;
		if (a == ">" ) test = item.match > b && item.match < d;
		if (a == "<" ) test = item.match < b;
			
		if (test){
			li.addL12005(item.label, /*"sino.manualAdd('" + item.label + "','',true)"*/'["manualAdd", "' + item.label + '", "", true]')
			li.addL12005(item.title)
			li.addL12005("match: " + item.match + "%")
			li.addL12005("-----------------------")
		}
	})
  },

  setList: function(){
	$("#d1302").hide();	// lista fontes
	$("#d1303").show();	// lista arquivos
	li.clrArq("l12005")
  },
  //------------------------- le arquivo sinopse.txt, callback(array de sinopses),	se erro callback(false)
  readS: function(callback){
	cp.readWrite("../txt/sinopse.txt", "", "r", "json", function(x){
		if (x == "parsererror") { cp.msgErr("arquivo sinopse.txt inexistente"); x = false }
		else x = sino.textConv(x);
/*		x.forEach(function(item, i){
			var sinopse = item.sinopse, label = item.label;
			if ((/&/.exec(label) && !/& /.exec(label) && !/R&B/.exec(label)) || (/&/.exec(sinopse) && !(/& /.exec(sinopse) || /R&B/.exec(sinopse))))	// verifique se ainda existe simbolos &xxx;
				var a = a;	// debug
			if (/</.exec(sinopse) || />/.exec(sinopse))	// idem elementos
				var a = a;	// debug
		})*/
		callback(x)
	})
  },
  //------------------------- grava arquivo sinopse.txt, se sucesso callback(true)
  writeS: function(x, callback){
	if (x == []) { cp.msgErr("sinopse array vazia"); return };
	cp.readWrite("../txt/sinopse.txt", x, "w", "json", callback)	// sinopse.txt > 8MB, alterar em PHP.ini: de post_max_size = 8M para post_max_size = 16M
  },
  //------------------------- le arquivo sinopsesinopseFilmes.txt.txt, callback(array de sinopses),	se erro callback(false)
  readSf: function(callback){
	cp.readWrite("../txt/sinopseFilmes.txt", "", "r", "json", function(x){
		if (x == "parsererror") { cp.msgErr("erro leitura sinopseFilmes.txt"); x = false };
		callback(x)
	})
  },
  //------------------------- modifica sinopse (em português) de arquivos .nfo
  nfoChange: function(){
	sino.setList()
	li.addL12005("====== alteração de arquivos .nfo ======")
	var nfoModif = [], j = 0;
	sino.readSf(function(x){
		if (!x) return;
		li.addL12005("arquivo sinopseFilmes lido")
		nfoChangeLoop(x, 0, 0)
	})
	function nfoChangeLoop(array, idx){
		if (idx < array.length){
			cp.jsnReqBsy = true;		// bloqueia kd.loopInfo()
			var item = array[idx], path = item.path.replace("mkv", "nfo").replace("smb:", "");
			if (item.match == 100){
				nfoPlotContChange(path, item.sinopse, function(x){
					if (x == "true" || x == "igual"){
						li.linRem("l12005", 3, 9999)
						li.addL12005("filme nº " + (idx + 1))
						li.addL12005("Arquivos .nfo modificados: " + j)
						if (x == "true") nfoModif[j++] = idx;	// nfo modificado, salve index do filme
					}
					
					if (li.loopCtrl(array.length, idx)) setTimeout(function(){ nfoChangeLoop(array, ++idx) }, 1)	// control loop da lista
					else nfoChangeLoop(array, ++idx);
				})
			}else nfoChangeLoop(array, ++idx)
		}else{
			for (var i = 0; i < nfoModif.length; i++) li.addL12005(array[nfoModif[i]]["label"])
			cp.jsnReqBsy = false
		}
	}
	function nfoPlotContChange(file, sinopse, callback){
		$.ajax({
			url: 'php/nfo_plot_cont_change.php',
			type: 'POST',
			data: { 'file': file, 'newContent': sinopse },
			error: function(xhr, sta){ callback(sta) },
			success: callback
		})
	}
  }
}