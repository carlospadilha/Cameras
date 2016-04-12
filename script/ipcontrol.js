//==================================================== biblioteca io (módulo tcp in/out)
var io = {
  ip: "", port: "",
  login: "", senha: "", cmd1: null, cmd2: null,
  dtaRcvd: false, dblRead: null, status: true, pooling: false,
  releStatus: [],
  //-------------------------- envia comando para o módulo ip control (TCP)
  sndTmr: 0,
  send: function(){
	var tcpTime = cp.timeDate();
	if (io.pooling) io.cmd1 = io.cmd2 = null;
	io.status = io.dtaRcvd = false;		// limpe status de resposta do IP Controller e dado recebido
	cp.sendTcp2(io.ip, io.port, cp.charHex(io.login), cp.charHex(io.senha), cp.charHex(io.cmd1), cp.charHex(io.cmd2), io.dblRead, function(dado){	// codifica comun. ajax
		if (dado == "timeout" || cp.timeDate() > (tcpTime + 31000)){
			cp.ledOnOff("tcpLed", true, "r"); $("#tcpStatus").texto("TCP tmout"); som.er();
			sndTmt(5000); return
		};
		if (/Warning|Notice/.test(dado)){
			if (inoutPageLoaded){
				cp.msgErr(dado);
				$('#s1111').texto("IO TCP msg.: "+dado); setTimeout(function(){ $('#s1111').texto("") }, 10000); // mostre erro, depois de 10 seg. apague
				li.addScrollInOut("= TCP erro (" + (cp.timeDate() - tcpTime) + " ms) =")
			}
			cp.ledOnOff("tcpLed", true, "r"); $("#tcpStatus").texto("TCP erro"); som.er();
			sndTmt(5000); return
		}
		dado = cp.hexToChar(dado);	// decodifica comun. ajax
		if (dado && (dado.length == 78 || dado.length == 156)){
				io.status = io.dtaRcvd = true; io.cmd1 = io.cmd2 = null;
										io.disp("rcvd: ", dado.substr(0, 78));	// mostre/execute 1º dado recebido
				if (dado.length == 156) io.disp("rcvd: ", dado.substr(78, 78));	// mostre/execute 2º dado recebido
				if (!io.pooling) li.addScrollInOut("tempo de resposta: " + (cp.timeDate() - tcpTime) + " ms")
			}
		if (io.pooling) sndTmt(500);
		if (!io.dtaRcvd){
			cp.ledOnOff("tcpLed", true, "y"); $("#tcpStatus").texto("TCP pend.");
			if (io.cmd1) sndTmt(5000)
			else x = x
		}
		function sndTmt(x){ clearTimeout(io.sndTmr); io.sndTmr = setTimeout(io.send, x) }
	})
  },
  //-------------------------- monta código para ser enviado
  cmd: function(endereco, comando, data){
	if (!io.status) { cp.ledOnOff("tcpLed", true, "y"); $("#tcpStatus").texto("TCP ocup."); li.addScrollInOut("* TCP ocupado *"); return }
	li.clrInOut();
	io.cmd2 = io.dblRead = null; io.dtaRcvd = false;
	io.cmd1 = io.enc(String.fromCharCode(endereco) + (comando ? "\x01" : "\x00") + String.fromCharCode(data));
	if ((endereco > 99) && (endereco < 108)) io.cmd2 = io.enc("\x6C\x00");	// se comando em relé (100 a 107), leia seu estado também
	if (endereco == 108){ io.dblRead = true; io.cmd2 = io.enc("\xA2\x00") };// se leitura de estado de relés, leia estado das entradas também (2 leituras)
	cp.ledOnOff("tcpLed", true, "y"); $("#tcpStatus").texto("TCP -)-)");	// sinalização "enviando"
	io.send()	// envie comando
  },	// estrutura: "AVR_ETHERNET" (12 bytes) + endereço (1 byte) + comando (1 byte) + dado (64 bytes)
  //-------------------------- mostra dado (recebido/enviado) no display
  disp: function(msg, text){
	var texto = io.rc4("CHAVE_AVRETH_123", text.substr(0, 78)),	// decodifica dado
		endereco = texto.substr(12, 1),
		comando  = texto.substr(13, 1),
		dado	 = texto.substr(14, 2);
	if (io.dtaRcvd) io.led(endereco + comando + dado);	// se recebeu dado da ip-Controller, set os leds
	var dadoTxt = (endereco < "\x05") ? texto.substr(14, 16) : cp.charToHex(dado);	// ID/senha ou bytes?
	li.addScrollInOut(msg + cp.charToHex(endereco) + cp.charToHex(comando) + dadoTxt)
  },
  //-------------------------- ascende/apaga o respectivo led do rele/entrada
  lampStatus: false, lmpTmr: 0,
  lamp: function(){
	var el = $("#lmpLig");
	if (io.lampStatus){
		if (el.hasClass("on"))	el.removeClass("on")
		else					el.addClass   ("on");
		clearTimeout(io.lmpTmr); io.lmpTmr = setTimeout(io.lamp, 1000)
	}else el.removeClass("on")
  },

  led: function(x){	// x: endereço + comando + dado		recebido
	if (!x) return;
	cp.ledOnOff("tcpLed", true, "g"); $("#tcpStatus").texto("TCP ok");	// dado recebido, ascenda led verde e informe status OK
	if ((x.substr(0, 1) == "\x6C") && (x.substr(1, 1) == "\x00")){		// se leitura do estado dos reles
		relSta = cp.charHex(x.substr(0, 3));
		cp.salvaDado("releStatus", relSta, function(){});				// salva o estado dos relés
		for (var i = 1; i < 9; i++){
			var aux = Math.pow(2, i - 1), aux2 = (x.charCodeAt(2) & aux) == aux ? true : false;
			io.releStatus[i] = aux2;					// armazene status do relé
			cp.btnLedOnOff("d200" + i, aux2);			// ascenda/apague led dos relés
		//	if (i == 8) cp.btnLedOnOff('lmpLig', aux2);	// ascenda/apague botão-lâmpada
			if (i == 8) { io.lampStatus = aux2; io.lamp() }
		}
	}	// rele1: (1, 2^0), rele2: (2, 2^1)....
	if (x.substr(0, 1) == "\xA2")	// se leitura das entradas
		for (var i = 11, aux = x.charCodeAt(2) + x.charCodeAt(3) * 256; i < 23; i++){ cp.ledOnOff("d20" + i, aux & 1 == 1 ? false : true); aux >>= 1 }
  },
  //-------------------------- algorítmo de encriptaçao/decriptação RC4
  rc4: function(key, texto){	// RC4 Encrypt/Decrypt
	var s = [], i = 0, j = 0, y = 0, x, ct = '';
	while (i < 256) s[i] = i++;
	for (i = 0; i < 256; i++){
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i]; s[i] = s[j]; s[j] = x
	}
	for (i = j = 0; y < texto.length; y++){
		i = ++i % 256;
		j = (j + s[i]) % 256;
		x = s[i]; s[i] = s[j]; s[j] = x;
		ct += String.fromCharCode(texto.charCodeAt(y) ^ s[(s[i] + s[j]) % 256])
	}
	return ct
  },
  //-------------------------- codifica dado para ser enviado
  enc: function(texto){
	texto = "AVR_ETHERNET" + texto;	// assinatura (12 bytes) + texto
	for (var i = 0, comp = 78 - texto.length; i < comp; i++) texto += "\x00";	// preenche restante do texto com \x00s. Tamanho total:78 bytes
	texto = io.rc4("CHAVE_AVRETH_123", texto);	// codifica dado em RC4 (chave_de_encriptação, texto)
	io.disp("sent: ", texto);	// decodifica e mostra o dado enviado
	return texto
  },
  //-------------------------- botões dos reles, pegando o status do led
  releBtn: function(rele){ io.cmd(99 + rele, true, !io.releStatus[rele]) },
  //-------------------------- le estado dos relés
  rstatus: function(){ io.cmd(108, false, 0) },

  releStatusLoop: function(){
	if (!chromeApp) io.rstatus()
	setTimeout(io.releStatusLoop, wan ? 30000 : 6000)
  }
};




//---------------------------------------------------- atualiza estado dos relés e entradas, setup dos botões "pooling" e "le status"
function inicIpControl(){
	io.login = io.enc("\x01\x01" + "admin");	// login, onde  01:usuário, 01:escrita
	io.senha = io.enc("\x02\x01" + "admin");	// senha		02:senha,	01:escrita
	li.addScrollInOut("CTRL IP:" + io.ip + " Port:" + io.port);
	io.led(cp.hexToChar(relSta));				// atualize os led's dos relés conforme estado armazenado
	/*io.rstatus();*/io.releStatusLoop()		// lê status dos relés
}