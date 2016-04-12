/*  Rotinas Comunicação com o Ar condicionado Samsung */
var acW01 = "00000",	// x0:Auto | x1:Cool | x2:Dry | x3:Fan | x4:Heat (5 bits)
	acW02 = "110",	// x0:FanVar | x2:Fan1 | x4:Fan2 | x5:Fan3 | x6:Auto | x0:Dry (3 bits)
	acW03 = "10100",	// x14:20º temperatura (5 bits)
	acW04 = "00",	// x0:? (2 bit)
	acW05 = "000",	// x0:Eav.Clean OFF | x5:Eav.Clean ON (3 bits)
	acW06 = "11",	// x3: ? (2 bits)
	acW07 = "1",	// x0:Lighting OFF | x1:Lighting ON (1 bits)
	acW08 = "000",	// x0:demais funções | x3:Turbo | x7:SmartSaver ON (3 bits)
	acW09 = "11",	// x3:? (2 bits)
	acW10 = "111111",	// x3F	| x17:Swing ON/SmartSaver ON (6 bits)
	acW11 = "01",	// x1:? (2 bits)
	acW12 = "100",	// checksum, soma dos "uns" nos primeiros 38 bits de "function data"
	acW13 = "001000000001",	// x201 (12 bits)

	leadInON = 0x72,	// hexa 0072 - ir on lead in
	leadInOFF= 0x15A,	// hexa 015A - ir off lead in
	irDev	 ="111110000000000000000000000000000000011111001001000000010", // device data p/ funções normais
	irDev2	 ="111000000000000000000000000000000000011111011001000000010", // device data p/ OFF
	irTimer  ="100000000000000000000000000000000000011111101001000000001", // timer data
	irFreq   =0x515,	// hexa 0515
	irON	 =0x14,	// hexa 13 - ON time number
	irOFF1   =0x14;	// hexa 15 - OFF time number
	irOFF2   =0x3C,	// hexa 3C - OFF time number
	rfxCodeCnt=0,	// nº de bytes do código RFX9600

	arON	= false,// PowerON=true PowerOFF=false
	acFan	= 1,	// veloc. ventil. 1 (atual Mode)
	acFanF	= 1,	// velocidade do ventilador 1 (Fan  Mode)
	acFanH	= 1,	// velocidade do ventilador 1 (Heat Mode)
	acFanC	= 1,	// velocidade do ventilador 1 (Cool Mode)

	acTemp = parseInt(acW03, 2),
	acMode = 0;		// 0:auto, 1:Cool, 2:Dry, 3:Fan e 4:Heat (Mode)
//--------------------------
function sumBits(a, tipo){
	var soma = 0, i = 0;
	while(i < a.length) soma += (a.substr(i++, 1) == 1) ? 1 : 0;
	return padBeginning(3, "0",((tipo == 3 ? 25 : 22) - soma).toString(2))
}
//-------------------------- inverte os bits
function invByt(txt){var aux = ""; for (i = txt.length-1; i > -1;) aux += txt.substr(i--, 1); return aux}
//--------------------------
function rfxGer(txt){
	var rfxIrOnSeq   = rfxIrSeq(irON,	0x60),
		rfxIrOffSeq1 = rfxIrSeq(irOFF1, 0x40),
		rfxIrOffSeq2 = rfxIrSeq(irOFF2, 0x40),
		rfxIrCode	 = "";
	for (var i = 0; i < txt.length;){
		rfxIrCode += rfxIrOnSeq;								// RFX9600 sequência ON
		if (txt.substr(i++, 1) == 0) rfxIrCode += rfxIrOffSeq1		// RFX9600 sequência OFF
		else						rfxIrCode += rfxIrOffSeq2;
		rfxCodeCnt = rfxCodeCnt + 6;
	}
	return rfxIrCode
}
//--------------------------
function rfxIrSeq(a, b){
	var rfxIrOn = a * irFreq, aux = rfxIrOn.toString(16).toUpperCase();
	return (b + parseInt(rfxIrOn / 0x10000, 10)).toString(16) + " " + aux.substr(-4, 2) + " " + aux.substr(-2, 2) + " ";	
}
//-------------------------- mostra a temperatura no display e atualiza a variável temperatura
function acTempDisp(){$("#s5110").texto(acTemp); acW03 = acTemp.toString(2)} // mostre temperatura no Display
//-------------------------- mostra velocidade do ventilador (Fan) e atualiza a variavel veloc. vent., conforme modo
function acFanDisp(Fan){
	acFan = Fan;
	$("#s5111").texto(acMode == 0 ? "0" : Fan);
	if (Fan == 0) acW02 = "000";	// veloc. vent. var. 	(0) Variável/Dry
	if (Fan == 1) acW02 = "010";	// veloc. vent. 1		(2)
	if (Fan == 2) acW02 = "100";	// veloc. vent. 2		(4)
	if (Fan == 3) acW02 = "101";	// veloc. vent. 3		(5)
	if (Fan == 6) acW02 = "110"	// veloc. vent. 3		(6) Auto
}
//--------------------------
// padBeginning(6,"0","7a8") will return "0007a8"
// padBeginning(4,"0","Hello") will return "ello" (truncate front)
// padBeginning(6,"-","") will return "------"
var PAD_CACHE = {};
function padBeginning(len, fill, str){
	var l = str.length;
	if (l < len){
		if (!PAD_CACHE.hasOwnProperty(fill)) PAD_CACHE[fill] = {};
		return (PAD_CACHE[fill][len-l] || (PAD_CACHE[fill][len-l] = (Array(len - l + 1).join(fill)))) + str
	}
	return (l === len) ? str : str.substring(l-len)
}
//-------------------------- botões pág. ar-condicionado (testes)
function irProtocol(ir){IR.protocol(ir)}
//=============================================================================================================
var AC = {
	setup: function (){
		acTempDisp();	// mostre temperatura e atualize variável temperatura
		acFanDisp(acFan);	// mostre veloc. do vent. no display
		AC.ModeFunction(false);	// atualize display com o modo
	},
	irRFX: function(tipo){	//tipo=1:funções normais | tipo=2:ON | tipo=3:OFF
		if (tipo == 1) var irLength = "02 AF";	// comprimento RFX code (demais funções)
		if (tipo == 2) var irLength = "04 0B";	// comprimento RFX code (ON)
		if (tipo == 3) var irLength = "04 22";	// comprimento RFX code (OFF)
		var rfxCode="FF FF " + irLength + " 01 00 00 08 0A 05 15 ";	// preâmbulo RFX9600
		rfxCodeCnt = 0;
		
		rfxCode += rfxIrSeq(leadInON, 0x60) + rfxIrSeq(leadInOFF, 0x40);	// lead in
		rfxCode += rfxGer(invByt((tipo == 3)?irDev2:irDev));	// device data
		
		if (tipo!=1){	// se ON ou OFF,...
			rfxCode += rfxIrSeq(leadInON, 0x60) + rfxIrSeq(leadInOFF, 0x40);	// lead in (tipos 2 e 3)
			rfxCode += rfxGer(invByt(irTimer));	// timer data
			rfxCodeCnt += 6;
		}
		
		rfxCode += rfxIrSeq(leadInON, 0x60) + rfxIrSeq(leadInOFF, 0x40);	// lead in
		var txt=(tipo == 3) ? "1100000" : "1000";	// se OFF "60", senão "8"
		txt += acW01 + acW02 + acW03 + acW04 + acW05 + acW06 + acW07 + acW08 + acW09 + acW10 + acW11;
		acW12 = sumBits(txt, tipo);	// checksum, soma dos "uns" da acW01 a acW11
		txt += acW12 + acW13;
		rfxCode += rfxGer(invByt(txt));	// function data
		
		rfxCodeCnt=rfxCodeCnt + 9; var aux=rfxCodeCnt.toString(16).toUpperCase();
		if (tipo == 3) rfxCode += "60 56 65 5F FB A7 40 00 33 00 00"	// end data
		else		rfxCode += "C3 00 0" + parseInt(rfxCodeCnt/256,10).toString(16) + " " + aux.substr(-2,2) + " 00 xx";
	//*	if (Wan) return;											// se modo WAN (internet) não execute com. ar cond.
		if (arON) CX.rfxTxRx(1,4,2,rfxCode,true)
	},
	//---------------------------------------------------- Ar condicionado Temp+ e Temp-
	TempUp: function(){
		if (acTemp<30) acTemp++;	// aumente temperatura
		acTempDisp();	// mostre temperatura no Display
		AC.irRFX(1)	// gere o ir do RFX9600
	},
	
	TempDown: function(){
		if (acTemp>16) acTemp--;	// baixe temperatura
		acTempDisp();	// mostre temperatura no Display
		AC.irRFX(1)	// gere o ir do RFX9600
	},
	//---------------------------------------------------- Ar condicionado Fan+ e Fan-
	FanUp: function(){
		if (acMode == 1){acFanC < 3 ? acFanC++ : acFanC; acFanDisp(acFanC)};	
		if (acMode == 3){acFanF < 3 ? acFanF++ : acFanF; acFanDisp(acFanF)};
		if (acMode == 4){acFanH < 3 ? acFanH++ : acFanH; acFanDisp(acFanH)};
		AC.irRFX(1)
	},
	
	FanDown: function(){
		if (acMode == 1){acFanC > 0 ? acFanC-- : acFanC; acFanDisp(acFanC)};	// se Cool Mode, veloc. vent. 0 a 3
		if (acMode == 3){acFanF > 1 ? acFanF-- : acFanF; acFanDisp(acFanF)};	// se Fan  Mode, veloc. vent. 1 a 3
		if (acMode == 4){acFanH > 0 ? acFanH-- : acFanH; acFanDisp(acFanH)};	// se Heat Mode, veloc. vent. 0 a 3
		AC.irRFX(1)
	},
	//---------------------------------------------------- Ar condicionado Auto/Cool/Dry/Fan/Heat Mode
	ModeFunction: function(enable){
		var el = $("#s5112");
		if (enable){
			if (acMode<4) acMode++
			else		  acMode = 0
		}
		if (acMode == 0){
			el.texto("Auto");
			acW01 = "00000";	// Auto Mode
			acFanDisp(6)		// Fan auto
		};
		if (acMode == 1){
			el.texto("        Cool");
			acW01 = "00001";	// Cool Mode
			acFanDisp(acFanC)	// Fan Cool
		};
		if (acMode == 2){
			el.texto("                 Dry");
			acW01 = "00010";	// Dry Mode
			acFanDisp(0)		// Fan Dry
		};
		if (acMode == 3){
			el.texto("                        Fan");
			acW01 = "00011";	// Fan Mode
			acFanDisp(acFanF)	// Fan Fan
		};
		if (acMode == 4){
			el.texto("                               Heat");
			acW01 = "00100";	// Heat Mode
			acFanDisp(acFanH)	// Fan Heat	
		};
		if (enable) AC.irRFX(1);
	},
	//---------------------------------------------------- Power ON
	powerON: function(){
		if (arON){AC.irRFX(3); arON = false; $('#d5115').fadeIn()}
		else	 {arON = true; AC.irRFX(2);  $('#d5115').fadeOut()}
	},
	//---------------------------------------------------- Swing
	Swing: function(){
		if (acW10 == "111111")  {acW10 = "010111"; $("#s5113").texto("on")}
		else	  				{acW10 = "111111"; $("#s5113").texto("off")}
		AC.irRFX(1)
	},
	//---------------------------------------------------- Turbo
	Turbo: function(){
		if (acW08 == "011") {acW08 = "000"; $("#s5114").texto("")}
		else	  			{acW08 = "011"; $("#s5114").texto("Turbo")}
		AC.irRFX(1)
	},
	//---------------------------------------------------- Lighting
	Luz: function(){acW07 == "1" ? acW07 = "0" : acW07 = "1"; AC.irRFX(1)}
};
//######################################################################### IR Protocol
function setDisp(disp){CP.listAdd("l50001", disp, '', '')};
function binToHex(txt, inicio, tamanho){return parseInt(txt.substr(inicio, tamanho), 2).toString(16).toUpperCase()}

var IR = {
	protocol : function(ir){
		CP.clrLst("l50001");				// apague lista de comandos IR
	//	CF.log("ir length: " + ir.length);
		var idxByte = 0,
			Byte = new Array,
			j = 0, i = 0,
			word = new Array;
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
					var c = Math.abs(a - b);
					if (c < 6)  var bit = "0"
					else		var bit = "1";
					Byte[idxByte] += bit;
				//	CF.log(word[j-1] + " " + word[j] + " : " + j + "  " + a + "," + b + " ==> " + c + " (" + bit + ")");
				}else{
				//	CF.log(word[j-1] + " " + word[j] + " : " + j + "  " + a + "," + b + " (" + Byte[idxByte] + ")");
				}
			}
		}
	//	CF.log("(" + Byte[1] + ")");		// (010000000100100111110000000000000000000000000000000011111) exceto PowerOFF
	//	CF.log(invByt(Byte[1]));

		if (Byte[3]){						// variáveis e funções do Timer
			var aux=invByt(Byte[2]);
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
			" " + (aux.substr(15, 1) == "1"?"(ON:":"(")  + parseInt(binToHex(aux, 21, 5), 16) + (aux.substr(27, 1) == "1"?".5":".0") + "horas)" +
			" " + (aux.substr(14, 1) == "1"?"(OFF:":"(") + parseInt(binToHex(aux, 29, 5), 16) + (aux.substr(35, 1) == "1"?".5":".0") + "horas)")
		}
		
		var aux = Byte[3] ? invByt(Byte[3]) : invByt(Byte[2]),
			o = aux.length == 53 ? 0 : 4;	// off-set
	//	CF.log("(" + Byte[2] + ")"); 
		CP.listAdd("aclista", aux, '', '');
		CP.listAdd("aclista", (o == 0?"":binToHex(aux, 0, 4) + " ")	// xE:Power OFF | demais funções não existe este byte
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
		CP.listAdd("aclista", "------------------------------------------------------------", '', '')
	}
}