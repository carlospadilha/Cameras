//==================================================== biblioteca rs (RS232 módulo - USR-TCP232-24)
var rs = {
  ip:		"192.168.1.131",			// ip do módulo (TCP)
  port: 	20108,						// porta do módulo
  ipUdp:	"255.255.255.255",			// ip do módulo (UDP)
  portUdp:	1500,

  pass:		"\x31\x31\x30\x34\x31\x35",	// password 110415
  mac:		"\x00\xFB\x35\x4B\x4D\x5E",	// mac address
  ver:		"\x4E",						// versão
  ipDest:	"\x16\x01\xA8\xC0",			// ip	   resposta: 192.168.1.22
  portDest: "\x2A\x20",					// porta   resposta: 8234
  ipModu:	"\x83\x01\xA8\xC0",			// ip	 do módulo: 192.168.1.131
  portModu: "\x8C\x4E",					// porta do	módulo: 20108
  gateway:	"\x01\x01\xA8\xC0",			// ip do modem:		192.168.1.1
  mode:		"\x03",						// TCP client: 1;	UDP server: 2;	TCP server: 3;	UOP: 0
  baud:		"\x80\x25\x00",				// baud rate: C201=115200	2580=9600
  serial:	"\x03",						// parâmetros serial: data, stop, parity bit:	N, 8, 1
  id:		"\x00\x00\x28",
  netMask:	"\x00\xFF\xFF\xFF",			// subnet mask 255.255.255.0

  setObj: function(x){
	rs.mac		= x.substr(0,  6);
	rs.ver		= x.substr(6,  1);
	rs.ipDest	= x.substr(7,  4);
	rs.portDest = x.substr(11, 2);
	rs.ipModu	= x.substr(13, 4);
	rs.portModu = x.substr(17, 2);
	rs.gateway	= x.substr(19, 4);
	rs.mode		= x.substr(23, 1);
	rs.baud		= x.substr(24, 3);
	rs.serial	= x.substr(27, 1);
	rs.id		= x.substr(28, 3);
	rs.netMask	= x.substr(31, 4);
	rs.ip	= rs.ipModu.charCodeAt(3) + "." + rs.ipModu.charCodeAt(2) + "." + rs.ipModu.charCodeAt(1) + "." + rs.ipModu.charCodeAt(0);
	rs.port = rs.portModu.charCodeAt(1) * 256 + rs.portModu.charCodeAt(0);
  },
  // envia comando TCP ou UDP ao módulo
  send: function(tcp, ipsend, porta, dado, modo, callback){
	$.ajax({
		url: tcp ? 'php/tcp.php' : 'php/udp.php',
		type: 'POST',
		data: { ip: ipsend, port: porta, mode: modo, data: cp.charHex(dado) },
		timeout: 4000,	// 4 seg.
		error: function (xhr, sta){ callback(sta) },
		success: function (x){
			if (/Warning/.test(x))
				callback("erro")
			else
				callback(cp.hexToChar(x))
		}
	})
  },
  // erro de resposta
  erro: function(x){ 
  return x == "timeout" || x == "erro" },
  // lê configuração do módulo
  search: function(callback){
	var res = false, time = 200;
	$.when(send())					// 1ª tentativa: executar send() c/delay de 0.2 s , retornar com dfd.resolve() execute .done(..), se retornar com dfd.reject() execute .fail(..)
		.fail(function(){
			time = 2500; dir.msg("rs232: 2ª tentativa")
			$.when(send())			// 2ª tentativa: executar send() c/delay de 2.5 s, ..
				.fail(function(){
					time = 4000; dir.msg("rs232: 3ª tentativa")
					$.when(send())	// 3ª tentativa: executar send() c/delay de 4.0 s, ..
						.fail(function(){
							time = 7000; dir.msg("rs232: 4ª tentativa")
							$.when(send())	// 4ª tentativa: executar send() c/delay de 7.0 s, ..
								.fail(function(){ callback(res) })
								.done(function(){ callback(res) })
						})
						.done(function(){ callback(res) })
				})
				.done(function() { callback(res) })
		})
		.done(function() { callback(res) });
  	function send(){
		var dfd = jQuery.Deferred();
		setTimeout(function(){rs.send(false, rs.ipUdp, rs.portUdp, "0123456789012345678901234567890123456789", "brd", function(x){
			if (rs.erro(x)){	 res = false; dfd.reject()  }
			else{ rs.setObj(x);  res = true;  dfd.resolve() }
		})}, time)
		return dfd.promise();
	}
  },
  // envia comando TCP ao módulo
  cmd: function(cmd, callback){
	var res, time = 10, ackTime = cp.timeDate();
	$.when(sendTcp232(cmd))							// 1ª tentativa
		.fail(function(){							// falha de recepção
			time = 100;
			$.when(sendTcp232(cmd))					// 2ª tentativa, 100ms depois
				.fail(function(){ callback(res) })
				.done(function(){ li.addInOut("tempo de resp. TCP232: " + (cp.timeDate() - ackTime) + " ms"); callback(res) })	// dado Ok na 2ª tentativa
		})
		.done(function(){ li.addInOut("tempo de resp. TCP232: " + (cp.timeDate() - ackTime) + " ms"); callback(res) })			// dado Ok na 1ª tentativa 
	function sendTcp232(cmd){
		var d = jQuery.Deferred();
		setTimeout(function(){ rs.send(true, rs.ip, rs.port, cmd, "", function(x){
			if (x.length < 2){ res = false; d.reject()  }
			else			 { res = x;		d.resolve() };
		})}, time)
		return d.promise()
	}
  },
  // modifica configuração do módulo
  set: function(callback){
	var code = rs.mac + rs.pass + rs.ipDest + rs.portDest + rs.ipModu + rs.portModu + rs.gateway + rs.mode + rs.baud + rs.serial + rs.id + rs.netMask;
	rs.send(false, rs.ipUdp, rs.portUdp, code, "snd", function(x){
		if (rs.erro(x)) callback(false)
		else			callback(true);
	})
  },
  // setup módulo
  setup: function(){
	dir.msg("")
	rs.search(function(x){
		if (!x) { cp.msgErr('rs232: erro search'); return }
		dir.msg('rs232: mode(1) ' + cp.charToHex(rs.mode));
		if (rs.ip != "192.168.1.131" || rs.ipDest != "\x16\x01\xA8\xC0" || rs.gateway != "\x01\x01\xA8\xC0" || rs.mode != "\x03" || rs.baud != "\x80\x25\x00"){	// se parâmetros diferentes, setup módulo
			rs.ipModu = "\x83\x01\xA8\xC0";	// "192.168.1.131"
			rs.ipDest = "\x16\x01\xA8\xC0";	// "192.168.1.22"
			rs.gateway= "\x01\x01\xA8\xC0"; // "192.168.1.1"
			rs.mode   = "\x03";				// TCP server
			rs.baud   = "\x80\x25\x00";		// 9600
			rs.set(function(x){
				rs.search(function(x){
					if (!x) cp.msgErr('rs232: erro search')
					else dir.msg('rs232: mode(2) ' + cp.charToHex(rs.mode));
				})
			})
		}
	})
  }
}