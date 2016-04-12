//==================================================== biblioteca rx (rfx9600)
// rfx: 1 a 4 (aparelhos)
// cmd:	0=relé_abrir(63) 	1=relé_fechar(63)		2=relé_togle(64)	3=ler_entrada(60)	4=IR(40)		5=serial(50)		
//		6=relé_status(65) 	7=request_status(30)	8=repeat_frame(31)	9=testes(?)			10=ler serial	11=IR ack
// porta: de 1 a 4		texto: dados de IR ou RS232		actionCode=\x21 ==> powerSense		special: introduz 05 DC em IR
var rx = {

  ip: "", ip2: "", ip3: "", ip4: "",		// ips rfx9600 1, 2, 3 e 4
  port: 0, port2: 0, port3: 0, port4: 0,	// ports rfx9600 1, 2, 3 e 4
  busy: false, id: 34, dev: 1,				// dev: 1, 2, 3 e 4
  sys: 1,									// "192.168.1.10": 1	"192.168.1.12": 4
  serialRfx: false,							// true: via RFX9600	false: via TCP232
  inEnable: true,							// habilita loop de leitura das entradas (rcv, proj e PC)
  //------------------ envia código IR
  sendIR: function(rfx, porta, code, spc, backReturn, callback){
	rx.inEn(0);
	rx.cmd(rfx, 7, porta, "", 0, function(){				// Hello	(ascende led busy do rfx9600)
		rx.cmd(rfx, 4, porta, code, spc, function(){		// envia IR
			rx.cmd(rfx, 11, porta, "", 0, function(){		// IR ack
				rx.cmd(rfx, 8, porta, "", 0, function(x){	// finish ack (apaga led busy do rfx9600)
					rx.inEn(1); if (backReturn) callback(x);
				})
			})
		})
	})
  },

  inEn: function(x){ rx.inEnable = x },
  //------------------ envia comando desab. leitura cíclica de entradas
  btn: function(rfx, c, p, t, s, callback){
	  rx.inEn(0);
	  rx.cmd(rfx, c, p, t, s, function(x){ rx.inEn(1); callback(x) })
  },
  //------------------ le status dos relés
  releStatus: function(){
	var rfxNum = $('#rfx').text().substr(4, 1);
	$('#togle1Rfx').text( rfxNum == "1" ? "  PC1 Pwr"	: rfxNum == "4" ? "  PC2 Pwr" : " Togle 1" )
	$('#togle2Rfx').text( rfxNum == "1" ? "  Portão"	: " Togle 2" )
	$('#togle3Rfx').text( rfxNum == "1" ? "  Remoto"	: " Togle 3" )
	$('#togle4Rfx').text( rfxNum == "1" ? "  Tela Prj"	: " Togle 4" )
	rx.inEn(0);
	leRele(1, function(){
		leRele(2, function(){
			leRele(3, function(){
				leRele(4, function(){
					rx.inEn(1);
				})
			})
		})
	})

	function leRele(i, callback){
		rx.cmd(rx.dev, 6, i, '', 0, function(x){ cp.btnLedOnOff("ledTogle" + i, x); callback(x) })
	}
  },
  //------------------ envia comando para o RFX9600
  cmd: function(r, c, p, t, s, callback){
	$.when(chkBusy())
		.done(function(){ rx.send(r, c, p, t, s, callback) })

	function chkBusy(){
		var dfd = jQuery.Deferred();
		bsyLoop()
		return dfd.promise();
		function bsyLoop(){
			if (!rx.busy) return dfd.resolve();
			setTimeout(bsyLoop, 50);
		}
	}
  },

  idCount: function(x){
	rx.id += x;
	return "\x00" + String.fromCharCode(rx.id / 256) + String.fromCharCode(rx.id % 256)	/// 00 idH idL
  },

  send: function(rfx, cmd, porta, texto, special, callback){
	if (rx.busy) { 
		cp.msgErr("rfx9600 ocupado cmd:" + cmd + " porta:" + porta); callback(null); return }; 
	rx.busy = true;

	var ackTime		= cp.timeDate(),// para cálculo do "ack Time" do RFX9600
		statusCode  = "\x08",		// (00=Request 08=? 20=Ok 24=Failed 40=Finished)
		rptcntCode  = "\x00",		// repeatcount: 1º envio=(00), 2º envio=(01)
		verCode		= "\x02",		// versão ???
		lenHCode	= 0,			// 8 bits mais significativo do datalength
		lenLCode	= 6,			// 8 bits menos significativo do datalength (from action to end data)
		reserveCode = "\x00\x00\x00\x00\x00\x00\x00",
		onOffCode	= "\x00",		// ON/OFF relé, nulo em togle, RS232 flags
		endCode		= "\x00\x00",	// Duration in ms (01 ea = 1ea = 490ms = .49s)
		teste		= String.fromCharCode(5),
		portaCode	= porta - 1,
		modo		= "",			// "": espera retorno do RFX9600, "d": não espera
		actionCode;

	switch (cmd){
		// abrir  relé,	63	onOffCode = 00
		case 0: actionCode = "\x63";						break
		// fechar relé, 63	onOffCode = 01
		case 1: actionCode = "\x63"; onOffCode = "\x01";	break
		// on/off relé, 64 (togle)
		case 2: actionCode = "\x64";						break	
		// ler entrada, 60
		case 3: actionCode = "\x60"; lenLCode = 5;		 	break
		// enviar IR
		case 4:	
			statusCode	= "\x00";	// 00=Request 08=? 20=Ok 24=Failed 40=Finished
			actionCode	= "\x40";	// 40=Send IR
			verCode		= "\x00";
			for (var i = 0, j = 0, t = texto.length, dado = ""; i < t; i += 3, j++) if (texto.charAt(i) != "x") dado += String.fromCharCode(cp.hexToDec(texto.substr(i, 2)));
			var txtLen = 14 + j;	// datalength (from action to end data)
			if (txtLen > 255) { lenHCode = txtLen / 256; lenLCode = txtLen % 256 }
			else 				lenLCode = txtLen;
			endCode += "\x00\x00" + (special ? "\x05\xDC" : "\x00\x00") + "\x00\x00\x00" + "\x00" + dado // 0 + 0 + specialCode + 1 (IR repeatcount) + texto;
			break
		// enviar dado RS232
		case 5:
			actionCode	= "\x50";	// 50=RS232
			lenLCode	= 16 + texto.length;// datalength (from action to end data)
			portaCode	<<= 4;		// shift left 4 vezes
			portaCode	|= 4;		// 2:2400 3:4800 4:9600 5:14400 6:19200 7:28800....\11:115200
			onOffCode	= "\xC0";	// 1 stopbit, no parity, 8 databits (veja tabela abaixo)
			endCode		+= "\x00\x00\x00\x00\x00\x00\x00" + "\x01" + texto	// 7 (reserved) + 1 (RS232 repeatcount) + texto;
	/* onOffCode:	stopbits:	parity:		databits:
					1   = 00	none  = 00	5 = 00
					1.5 = 02	even  = 08	6 = 40
					2   = 04	odd   = 10	7 = 80
								mark  = 18	8 = C0
								space = 20	*/	
			break
		// ler status de relé
		case 6: actionCode = "\x65"; lenLCode = 5;			break
		// ler status do RFX9600
		case 7:
			statusCode  = "\x00";	// 00=Request
			actionCode	= "\x30";	// 30=request status (Hello)
			verCode		= "\x00";
			lenLCode	= 9;
			endCode		= "\x75\x30\x00\x00\x00\x00";
			modo		= "d"		// não espera retorno do rfx9600
			break
		// repita último comando
		case 8:
			statusCode  = "\x00";	// 00=Request
			actionCode	= "\x31";	// 31=repeat last frame
			verCode		= "\x00";
			lenLCode	= 5;
			modo		= "d"
			break
		// ler corrente
		case 9: actionCode = "\x21"; lenLCode = 5;			break
		// ler dado RS232
		case 10:
			actionCode	= "\x53";	// 53=Read RS232 port
			verCode		= "\x00";
			lenLCode	= 12;
			portaCode	<<= 4;		// shift left 4 vezes
			portaCode	|= 4;		// 2=2400 3=4800 4=9600 5=14400 6=19200 7=28800....\11=115200
			onOffCode	= "\xC0";	// 1 stopbit, no parity, 8 databits (veja tabela abaixo)
			endCode		= "\x00\x14\x00\x00\x00\xFA"
			break
		// responder IR enviado (ack)
		case 11:
			statusCode  = "\x00";	// 00=Request
			actionCode	= "\x42";	// 42=IR ack
			verCode		= "\x00";
			lenLCode	= 8;
			onOffCode	= "";
			endCode		= String.fromCharCode(rx.id / 256) + String.fromCharCode(rx.id % 256) + "\x00";
			modo		= "d"
			break
	}

	var code = rx.idCount(1) + statusCode + rptcntCode + reserveCode + actionCode + verCode + String.fromCharCode(lenHCode) + String.fromCharCode(lenLCode) + String.fromCharCode(portaCode) + onOffCode + endCode;
//	var a = cp.charToHex(code);
	cp.sendUdpRfx(rfx == 1 ? rx.ip : rfx == 2 ? rx.ip2 : rfx == 3 ? rx.ip3 : rx.ip4, rfx == 1 ? rx.port : rx.port2, code, modo, 5000, function(txtAck){
		rx.busy = false;
		if (modo){ callback(true); return };
		if (txtAck == "timeout" || txtAck.substr(0, 11) == "Fatal error") { cp.msgErr("RFX9600 " + txtAck, true); callback(null);/*rx.res = null; dfd.resolve();*/ return };
	
		li.clrInOut();
		li.addInOut(cp.charToHex(rx.idCount(0)) + " tamanho: " + txtAck.length + " bytes")

//		for (var i = 0, t = ""; i < txtAck.length ; i++){	// debug
//			t += cp.charToHex(txtAck.substr(i, 1)) + " ";
//		}

		for (var j = 0, dado = null; j < 81; j += 16){
			for (var i = j, ack = ''; i < j + 32;) ack += txtAck.substr(i++, 1);	//  pacote UDP do RFX9600
			li.addInOut(cp.charToHex(ack));											// se página inout.html, mostre pacote
			if (ack.charCodeAt(3) == 64){											// 4º byte = 40 (resposta)?
				if (ack.charCodeAt(4) == 0){										// 5º byte = 00 (2º pacote)?
					rfxAckId = ack.charCodeAt(2) + ack.charCodeAt(1) * 256 + ack.charCodeAt(0) * 65536;	// contador do id recebido
					dado	 = ack.charCodeAt(12) == 1 ? true : false;				// status da entrada/rele, true = ON, false = OFF
					break
				};
			}else{
				if (ack.charCodeAt(3) == 66){										// 4º byte = 42 (resposta serial)?
					var dadoTam = ack.charCodeAt(11) - 4;
					if (dadoTam > 0){
						var dado = ack.substr(12, dadoTam);
						li.addInOut(cp.charToHex(ack.substr(16, dadoTam - 4)));		// mostre o restante do dado serial na outra linha
						if (dado === null)				cp.msgErr("RS232 - null", true);
						if (dado == "RS232 Overflow") { cp.msgErr(dado, true); dado = null }
					}else cp.msgErr("não houve resposta serial")					// tamanho de dado < 4, sem dado
					break															// dado serial encontrado, saia do loop
				}else if (!((ack.charCodeAt(3) == 32) || (ack.charCodeAt(3) == 34))) cp.msgErr("** Erro de Comunicacao com RFX9600 **", true)
			}
		}
		callback(dado);
		if (ipPag) $('#showRfxRes').text('cmd: ' + cmd + '\nport: ' + porta + '\n==> ' + dado);
		li.addInOut("tempo de resposta: " + (cp.timeDate() - ackTime) + " ms")	// mostra o tempo de resposta do RFX9600
	})
  },
  //------------------------ gera puso de [tempo]ms no rele [porta]
  pulsoRele: function(rfx, porta, tempo, callback){	// pulso de tempo ms	no relé "porta" (de 1 a 4)
	var res;
	$.when(pulso()).done(function(){ callback(res) })
	function pulso(){
		var d = jQuery.Deferred();
		rx.cmd(rfx, 1, porta, '', 0, function(dado){	// fechar relé
			if (dado === null){ res = null; d.resolve() }
			else setTimeout(function(){ rx.cmd(rfx, 0, porta, '', 0, function(x){ res = x; d.resolve() }) }, tempo)	//abrir relé
		});
		return d.promise()
	}
  }
};

/*	rfx9600/1										rfx9600/4
	Entrada1 = PC1 (HOME THEATER) - 12V				PC2 (sala) - 12V
	Entrada2 = Receiver ligado - outlet sensor		Receiver ligado - fonte 12V (switched outlet)
	Entrada3 = n/c
	Entrada4 =

	Saída1	 = PC1 (HOME THEATER) - Power ON/OFF	PC2 (sala) - Power ON/OFF
	Saída2	 = Controle remoto do portão	
	Saída3	 = Módulo de força remoto
	Saída4	 = Tela de Projeção
*/
/*
header:
3 bytes to indicate message number (00 00 01)
1 byte statuscode (00 = Request, 20 = Ok, 24 = Failed, 40 = Finished)
1 byte repeatcount (00)
7 bytes probably reserved (00 00 00 00 00 00 00)

data:
1 double byte to indicate action
00 = Completed?
21 = PowerSense
30 = Requeststatus?
31 = Repeat last frame?
40 = IR
50 = RS232
63 = SetRelayState
64 = ToggleRelayState
65 = GetRelayState
1 byte ??? (02) (maybe Pronto major version 2.00?)
1 byte ??? (00) (maybe Pronto major version 2.00?)
1 byte datalength (from action to end data)
1 byte 
first part RS232 port
port1 = 0
port2 = 1
port3 = 2
port4 = 3
second part RS232 baudrate
2400 = 2
4800 = 3
9600 = 4
14400 = 5
19200 = 6
28800 = 7
31250 = 8
38400 = 9
57600 = a
115200 = b
1 byte combined rs232 flags
Stopbits:
1 = 0
1.5 = 2
2 = 4
Parity:
none = 0
even = 8
odd = 16
mark = 24
space = 32
Databits:
5 = 0
6 = 64
7 = 128
8 = 192
So, Stopbits 8 + Parity space + Databits 8 = 226 = e4 
2 bytes Duration in ms (01 ea = 1ea = 490ms = .49s)
7 bytes probably reserved (00 00 00 00 00 00 00)
1 byte rs232 repeatcount (01)
? bytes RS232 string

end data:
3 bytes to indicate end or reserved (00 00 00)
It's possible to send multiple data + end data (multiple commands) in one packet.
*/
