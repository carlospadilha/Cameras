//==================================================== biblioteca ac (ar condicionado Samsung)
var ac = {
	//---------------------------------------------------- variáveis/constantes
  w01: "00000",	// x0:Auto | x1:Cool | x2:Dry | x3:Fan | x4:Heat
  w02: "110",		// x0:FanVar | x2:Fan1 | x4:Fan2 | x5:Fan3 | x6:Auto | x0:Dry
  w03: "10100",	// x14:20º temperatura
  w04: "00",		// x0:?
  w05: "000",		// x0:Eav.Clean OFF | x5:Eav.Clean ON
  w06: "11",		// x3: ?
  w07: "1",		// x0:Lighting OFF | x1:Lighting ON
  w08: "000",		// x0:demais funções | x3:Turbo | x7:SmartSaver ON
  w09: "11",		// x3:?
  w10: "111111",	// x3F	| x17:Swing ON/SmartSaver ON
  w11: "01",		// x1:?
  w12: "100",		// checksum, soma dos "uns" nos primeiros 38 bits de "function data"
  w13: "001000000001",	// x201 (12 bits)

  ON	: false,	// PowerON=true PowerOFF=false
  fanF: 1,		// veloc. ventilador 1 (Fan  Mode)
  fanH: 1,		// veloc. ventilador 1 (Heat Mode)
  fanC: 1,		// veloc. ventilador 1 (Cool Mode)
  temp: 20,		// 20º (temperatura default)
  mode: 0,		// 0:auto, 1:Cool, 2:Dry, 3:Fan e 4:Heat (Mode)

  leadInON: 0x72,	// ir on  lead in
  leadInOFF:0x15A,// ir off lead in
  irDevNor: "111110000000000000000000000000000000011111001001000000010", // device data p/ funções normais
  irDevOff: "111000000000000000000000000000000000011111011001000000010", // device data p/ OFF
  irTimer	: "100000000000000000000000000000000000011111101001000000001", // timer data
  irFreq	: 0x515,
  irON	: 0x14,	// 13 ON  time number
  irOFF1	: 0x14,	// 14 OFF time number
  irOFF2	: 0x3C,	//	  OFF time number
  //---------------------------------------------------- envia para o RFX9600
  send: function(tipo){	//tipo=1:funções normais | tipo=2:ON | tipo=3:OFF
	//---------------------- gera sequências de ir
	var rfxIrSeq = function(a, b){	// a:0x3C, b:0x40, a * freq	==> 3C * 515 = 130EC, 130EC + 400000 = 4130EC ==> "41 30 EC "
		var rfxIrOn = a * ac.irFreq, aux = cp.decToHex(rfxIrOn);
		return (b + parseInt(rfxIrOn / 0x10000, 10)).toString(16) + " " + aux.substr(-4, 2) + " " + aux.substr(-2, 2) + " ";	
	};
	//----------------------																	   --------1-------- --------0-------- --------1--------
	var rfxGer = function(txt){	// gera códigos em função dos bits, ex: se txt:"101..."	rfxIrCode:"60 65 A4 40 65 A4 60 65 A4 41 30 EC 60 65 A4 40 65 A4 . . ."
		var rfxIrOnSeq   = rfxIrSeq(ac.irON,	0x60),	// sequencia ir iníc. (0x14, 0x60) 14 * 515 =  65A4 + 600000 = 6065A4 ==> "60 65 A4 "
			rfxIrOffSeq1 = rfxIrSeq(ac.irOFF1,	0x40),	// sequencia ir bit 0 (0x14, 0x40) 14 * 515 =  65A4 + 400000 = 4065A4 ==> "40 65 A4 "
			rfxIrOffSeq2 = rfxIrSeq(ac.irOFF2,	0x40);	// sequencia ir bit 1 (0x3C, 0x40) 3C * 515 = 130EC + 400000 = 4130EC ==> "41 30 EC "
		for (var i = 0, rfxIrCode = ""; i < txt.length;){
			rfxIrCode	+= rfxIrOnSeq + (txt.substr(i++, 1) == 0 ? rfxIrOffSeq1 : rfxIrOffSeq2);	// RFX9600 sequência ON  +  RFX9600 sequência OFF
			rfxCodeCnt	+= 6;
		}
		return rfxIrCode
	};
	//---------------------- calcula checksum de a
	var sumBits = function(a, tipo){
		for (var i = 0, soma = 0; i < a.length;) soma += (a.substr(i++, 1) == 1) ? 1 : 0;	// soma os bits "1"
		return cp.padBeg(3, "0",((tipo == 3 ? 25 : 22) - soma).toString(2))					// XXX (formata 3 digitos)
	};
	//---------------------- send rfx ir
	if (tipo == 1) var irLength = "02 AF";	// comprimento RFX code (demais funções)
	if (tipo == 2) var irLength = "04 0B";	// comprimento RFX code (ON)
	if (tipo == 3) var irLength = "04 22";	// comprimento RFX code (OFF)
	var rfxCode 	= "FF FF " + irLength + " 01 00 00 08 0A 05 15 ",	// preâmbulo RFX9600
		rfxCodeCnt	= 0;	// nº de bytes do código RFX9600
		// 									lead in							  +		device data
		rfxCode += rfxIrSeq(ac.leadInON, 0x60) + rfxIrSeq(ac.leadInOFF, 0x40) +  rfxGer(ac.invByt(tipo == 3 ? ac.irDevOff : ac.irDevNor));
	if (tipo != 1){	// se ON ou OFF,		lead in (tipos 2 e 3)			  +		timer data
		rfxCode += rfxIrSeq(ac.leadInON, 0x60) + rfxIrSeq(ac.leadInOFF, 0x40) +  rfxGer(ac.invByt(			  ac.irTimer));
		rfxCodeCnt += 6;
	}
		rfxCode += rfxIrSeq(ac.leadInON, 0x60) + rfxIrSeq(ac.leadInOFF, 0x40);	// lead in

	var txt = (tipo == 3) ? "1100000" : "1000";	// se OFF "60", senão "8"
	txt += ac.w01 + ac.w02 + ac.w03 + ac.w04 + ac.w05 + ac.w06 + ac.w07 + ac.w08 + ac.w09 + ac.w10 + ac.w11;
	ac.w12 = sumBits(txt, tipo);		// checksum, soma dos "uns" de ac.w01 a ac.w11
	txt += ac.w12 + ac.w13;
	rfxCode += rfxGer(ac.invByt(txt));	// function data

	rfxCodeCnt += 9; var aux = rfxCodeCnt.toString(16).toUpperCase();
	// end data:
	rfxCode += tipo == 3 ? "60 56 65 5F FB A7 40 00 33 00 00" 	:	"C3 00 0" + parseInt(rfxCodeCnt / 256, 10).toString(16) + " " + aux.substr(-2, 2) + " 00 xx";
	if (ac.ON) rx.cmd(1, 4, 2, rfxCode, true, function(){})
  },
  //---------------------------------------------------- Ar condicionado Temp+ e Temp-
  tempUp: function(){
		if (ac.temp < 30) ac.temp++; ac.tempDisp();/*mostre temperatura no Display*/
	},
  tempDown: function(){
		if (ac.temp > 16) ac.temp--; ac.tempDisp();/*mostre temperatura no Display*/
	},
  tempDisp: function(){	// mostre temperatura no Display e atualize var. temperatura (ac.w03)
		$("#s5110").texto(ac.temp); ac.w03 = ac.temp.toString(2);
		ac.send(1)/*gere o ir do RFX9600*/
  },
  //---------------------------------------------------- Ar condicionado Fan+, Fan- e Modo
  fanDisp: function(fan){	// mostra velocidade do ventilador (Fan) e atualiza a var. veloc. fan, conforme modo
	$("#s5111").texto(ac.mode == 0 ? "0" : fan);
	if (fan == 0) ac.w02 = "000";	// veloc. fan var. 	(0) Variável/Dry
	if (fan == 1) ac.w02 = "010";	// veloc. fan 1		(2)
	if (fan == 2) ac.w02 = "100";	// veloc. fan 2		(4)
	if (fan == 3) ac.w02 = "101";	// veloc. fan 3		(5)
	if (fan == 6) ac.w02 = "110"	// veloc. fan 3		(6) Auto
	ac.send(1)
  },
  fanUp: function(){		// fan +
	if (ac.mode == 1) {ac.fanC < 3 ? ac.fanC++ : ac.fanC; ac.fanDisp(ac.fanC)};	
	if (ac.mode == 3) {ac.fanF < 3 ? ac.fanF++ : ac.fanF; ac.fanDisp(ac.fanF)};
	if (ac.mode == 4) {ac.fanH < 3 ? ac.fanH++ : ac.fanH; ac.fanDisp(ac.fanH)};
  },
  fanDown: function(){	// fan -
	if (ac.mode == 1) {ac.fanC > 0 ? ac.fanC-- : ac.fanC; ac.fanDisp(ac.fanC)};	// se Cool Mode, veloc. vent. 0 a 3
	if (ac.mode == 3) {ac.fanF > 1 ? ac.fanF-- : ac.fanF; ac.fanDisp(ac.fanF)};	// se Fan  Mode, veloc. vent. 1 a 3
	if (ac.mode == 4) {ac.fanH > 0 ? ac.fanH-- : ac.fanH; ac.fanDisp(ac.fanH)};	// se Heat Mode, veloc. vent. 0 a 3
  },
  mode: function(){	// muda o modo: Auto ==> Cool ==> Dry ==> Fan ==> Heat ==> Auto
		var el = $("#s5112");
	ac.mode = ac.mode < 4 ? ++ac.mode : 0;
	if (ac.mode == 0){ el.texto("Auto");								ac.w01 = "00000";/*Auto Mode*/	ac.fanDisp(6)		/*Fan auto*/};
	if (ac.mode == 1){ el.texto("        Cool");						ac.w01 = "00001";/*Cool Mode*/	ac.fanDisp(ac.fanC)	/*Fan Cool*/};
	if (ac.mode == 2){ el.texto("                 Dry");				ac.w01 = "00010";/*Dry Mode*/	ac.fanDisp(0)		/*Fan Dry*/	};
	if (ac.mode == 3){ el.texto("                        Fan");			ac.w01 = "00011";/*Fan Mode*/	ac.fanDisp(ac.fanF)	/*Fan Fan*/	};
	if (ac.mode == 4){ el.texto("                               Heat");	ac.w01 = "00100";/*Heat Mode*/	ac.fanDisp(ac.fanH)	/*Fan Heat*/};
  },
  //---------------------------------------------------- Power ON toggle
  powerON: function(){
	if (ac.ON)	{ ac.send(3); ac.ON = false; $('#d5115').fadeIn() }
	else		{			  ac.ON = true;  $('#d5115').fadeOut(); ac.send(2) }
  },
  //---------------------------------------------------- Swing: on / off
  Swing: function(){
	if (ac.w10 == "111111") { ac.w10 = "010111"; $("#s5113").texto("on") }
	else	  				{ ac.w10 = "111111"; $("#s5113").texto("off") }
	ac.send(1)
  },
  //---------------------------------------------------- Turbo: on / off
  Turbo: function(){
	if (ac.w08 == "011")	{ ac.w08 = "000"; $("#s5114").texto("") }
	else	  				{ ac.w08 = "011"; $("#s5114").texto("Turbo") }
	ac.send(1)
  },
  //---------------------------------------------------- Lighting: on / off
  Luz: function(){ ac.w07 == "1" ? ac.w07 = "0" : ac.w07 = "1"; ac.send(1) },
  //-------------------------- inverte posição dos bits, ex: 110 ==> 011
  invByt: function(txt){
	for (var i = txt.length - 1, aux = ""; i > -1;) aux += txt.substr(i--, 1);
	return aux
  },
};
//==================================================== biblioteca IR (infra red protocoll))
function setDisp(disp){li.add("l50001", disp, '', '')};
function binToHex(txt, inicio, tamanho){ return parseInt(txt.substr(inicio, tamanho), 2).toString(16).toUpperCase() }
//-------------------------- botões pág. ar-condicionado (testes)
function irProtocol(ir){ ir.protocol(ir) }

var ir = {
	protocol : function(ir){
		li.clear("l50001");				// apague lista de comandos IR
	//	CF.log("ir length: " + ir.length);
		var idxByte = 0,
			Byte = new Array, word = new Array,
			j = 0, i = 0;
		for (; i < ir.length; i++){word[j++] = ir.substr(i++, 1) + ir.substr(i++, 1) + ir.substr(i++, 1) + ir.substr(i++, 1)};
	//	CF.log("word length: " + word.length);
		for (j = 0; j < word.length; j++){
			var a=word[j];
			if (j == 0){setDisp(a + " : " + "zero")};
			if (j == 1){setDisp(a + " : " + parseInt(a, 16) + ", freq = " + parseInt(1000000 / (parseInt(a, 16) * 0.241246), 10) + " kHz")};
			if (j == 2){setDisp(a + " : " + parseInt(a, 16) + " BurstPairs sequ. 1"); burst1 = a};
			if (j == 3){setDisp(a + " : " + parseInt(a, 16) + " BurstPairs sequ. 2"); burst2 = a};
		//	if (j == 4){setDisp(a + "," + word[++j]+" : " + parseInt(a, 16) + "," + parseInt(word[j],16) + " Lead In Burst")};
			if (j > 3){
				var a = parseInt(word[j++], 16), b=parseInt(word[j], 16);
				if (a < 16){};
				if (a > 110){idxByte++; Byte[idxByte] = ""};
				if ((a > 15) && (a < 24)){
					var c	= Math.abs(a - b);
					Byte[idxByte] += (c < 6 ? "0" : "1");
				//	CF.log(word[j-1] + " " + word[j] + " : " + j + "  " + a + "," + b + " ==> " + c + " (" + bit + ")");
				}else{
				//	CF.log(word[j-1] + " " + word[j] + " : " + j + "  " + a + "," + b + " (" + Byte[idxByte] + ")");
				}
			}
		}
	//	CF.log("(" + Byte[1] + ")");		// (010000000100100111110000000000000000000000000000000011111) exceto PowerOFF
	//	CF.log(ac.invByt(Byte[1]));

		if (Byte[3]){						// variáveis e funções do Timer
			var aux = ac.invByt(Byte[2]);
			alert(aux);
			alert(binToHex(aux, 0, 4) + " " + binToHex(aux, 4, 4) + " " + binToHex(aux, 8, 4) + " " + binToHex(aux, 12, 2) + 	// x8 x0 x0 (00)
			" " + binToHex(aux, 14, 2) +	// (01):Timer ON | (10):Timer OFF | (11):Timer ON/OFF | (00):Timer cancel
			" " + binToHex(aux, 16, 5) +	// (00000)
			" " + binToHex(aux, 21, 5) +	// TimerON hora
			" " + binToHex(aux, 26, 3) +	// (000):,0 | (011):,5 (decimal da hora ON)
			" " + binToHex(aux, 29, 5) +	// TimerOFF hora
			" " + binToHex(aux, 34, 3) +	// (000):,0 | (011):,5 (decimal da hora OFF)
			" " + binToHex(aux, 37, 4) +	// xF
			" " + binToHex(aux, 41, 4) +	//
			" " + binToHex(aux, 45, 12) +	// (001000000001)
			" " + (aux.substr(15, 1) == "1" ? "(ON:" : "(")  + parseInt(binToHex(aux, 21, 5), 16) + (aux.substr(27, 1) == "1" ? ".5" : ".0") + "horas)" +
			" " + (aux.substr(14, 1) == "1" ? "(OFF:" : "(") + parseInt(binToHex(aux, 29, 5), 16) + (aux.substr(35, 1) == "1" ? ".5" : ".0") + "horas)")
		}
		
		var aux = Byte[3] ? ac.invByt(Byte[3]) : ac.invByt(Byte[2]),
			o = aux.length == 53 ? 0 : 4;	// off-set
	//	CF.log("(" + Byte[2] + ")"); 
		li.add("aclista", aux, '', '');
		li.add("aclista", (o == 0?"":binToHex(aux, 0, 4) + " ")	// xE:Power OFF | demais funções não existe este byte
		+ binToHex(aux, o + 0, 4) + "   "	// x8:ON e demais funções | x0:OFF
		+ binToHex(aux, o + 4, 5) + "    "	// x0:Auto | x1:Cool | x2:Dry | x3:Fan | x4:Heat
		+ binToHex(aux, o + 9, 3) + "  "	// x0:FanVar | x2:Fan1 | x4:Fan2 | x5:Fan3 | x6:Auto | x0:Dry
		+ binToHex(aux, o + 12, 1) + binToHex(aux, o + 13, 4) + 	"   " // temperatura
		+ binToHex(aux, o + 17, 2) + " "	// x0
		+ binToHex(aux, o + 19, 3) + "  "	// x0 | x5:Evap.Clean ON
		+ binToHex(aux, o + 22, 2) + " "	// x3
		+ binToHex(aux, o + 24, 1) +		// x0:Lighting OFF | x1:Lighting ON
		+ binToHex(aux, o + 25, 3) + "  "	// (000) | (111):SmartSaver ON | (011):Turbo
		+ binToHex(aux, o + 28, 2) + " "	// x3
		+ binToHex(aux, o + 30, 2) + binToHex(aux, o + 32, 4) + "    "	// x3F | x17:Swing ON/SmartSaver ON
		+ binToHex(aux, o + 36, 2) + " "	// (01)
		+ binToHex(aux, o + 38, 3) + "  "	// (001), (011), (100), (101), (110)...
		+ binToHex(aux, o + 41, 12) +		// (001000000001)
		" ", '', '');
		li.add("aclista", "------------------------------------------------------------", '', '')
	}
}