$(document).ready(function(){
	cam.vidE = $('#vidCam')
	set.dev();
//	set.tabDev=true;
	if (set.tabDev) set.tablet();

//	chrome.storage.sync.remove("playlist", function(x){})

	cp.dataRead(function(x){
		console.log(x)
		ip.xbmc		= x.xbmcIP	|| "192.168.1.31";
		wan			= x.WAN		|| false;
		sys.name	= x.sysname	|| "server";
		sys.macadd	= x.mac		|| "";
		cam.locVol	= x.locVol	|| 50;
		relSta		= x.releStatus;	// status dos led's dos relés (módulo ipControl)
		sys.server = sys.name == "server";
		if (chromeApp) setTimeout(cp.checkUser, 500, x)
		else return cp.checkUser(x)		// login check
	})
})

window.addEventListener("contextmenu", function(e) { if (!chromeApp) e.preventDefault() })	// right-clic disable




//==================================================== biblioteca ip
var ip = {
	host: "kaizen.dyndns-wiki.com",
	http: "http://kaizen.dyndns-wiki.com",
	local: "", client: "", xbmc: ""
};




//==================================================== biblioteca set (setup)
var set = {
  localHost: false,		// host não é 192.168.1.31
  //------------------------- início do setup
  inic: function(x){ x ? set.lan() : set.wan() },
  //------------------------- Wan mode
  wan: function(){
	cam.ip1		= ip.http + ":612";								// cam1 - http streaming
	cam.ip1x	= cam.ip1;										// cam1 - proxyAjax (host remoto)
	cam.ip2		= ip.http + ":602";								// cam2 - http streaming
	cam.ip2x	= cam.ip2;										// cam2 - proxyAjax (host remoto)
	cam.ip3		= "http://admin:solrac@" + ip.host + ":610";	// cam3 - jpeg frames
	cam.ip3h	= ip.http + ":614";								// cam3 - http streaming reencoded
	cam.ip3v	= "rtsp://admin:solrac@" + ip.host + ":610";	// cam3 - rstp streaming
	cam.ip4		= "http://"				 + ip.host + ":615";	// cam4 - http streaming reencoded
	cam.ip4		= "http://kaizen3.dyndns.org:600";				// cam4 - http streaming (Los Paleteros - quiosque)
	cam.ip4v	= "rtsp://admin:123456@" + ip.host + ":606";	// cam4 - rstp streaming
//	cam.ip5		= "http://admin:888888@" + ip.host + ":608";	// cam5 - comandos
//	cam.ip5h	= "http://"				 + ip.host + ":616";	// cam5 - http streaming reencoded
//	cam.ip5u	= "rtmp://admin:888888@" + ip.host + ":607";	// cam5 - rtmp streaming
//	cam.ip5v	= "rtsp://admin:solrac@" + ip.host + ":609";	// cam5 - rtsp streaming
	cam.ip5		= "http://admin:@" + ip.host + ":608";			// cam5 - http streaming (era Los Paleteros - carrinho)
	cam.ip5x	= cam.ip5;										// cam5 - proxyAjax (host remoto)

	if (chromeApp){
		set.localHost = true;
		cam.ip1x	= "http://192.168.1.35";			// cam1 - proxyAjax (host local)
		cam.ip2x	= "http://192.168.1.37";			// cam2 - idem
		cam.ip5x	= "http://192.168.1.38";			// cam5 - idem
		set.local()
	}else
		$.ajax({url: 'php/getHost.php', success: function(x){
			if (x == " 192.168.1.31" || x == " 192.168.1.33"){	// se servidores "nuc" ou "nuc i3", set ips locais
				set.localHost = true;
				cam.ip1x	= "http://192.168.1.35";			// cam1 - proxyAjax (host local)
				cam.ip2x	= "http://192.168.1.37";			// cam2 - idem
				cam.ip5x	= "http://192.168.1.38";			// cam5 - idem
				set.local()
			}else{
				set.localHost = false;
				rx.ip		= ip.host;
				rx.ip2		= ip.host;
				rx.port		= 611;
				rx.port2	= 613;
				xbmcIP		= ip.host;
				io.ip		= ip.host;
				io.port		= 400;
			}
			cp.addOn(['pwrbtn']); $('#wan').show(); $('#lan').hide()
			set.end(true)	// wan
		}})
  },
  //------------------------- Lan mode
  lan: function(){
	cam.ip1		= "http://admin:admin@192.168.1.35";		// cam1 - http streaming
	cam.ip1x	= cam.ip1;									// cam1 - proxyAjax (host local)
	cam.ip2		= "http://admin:admin@192.168.1.37";		// cam2 - http steaming
	cam.ip2x	= cam.ip2;									// cam2 - proxyAjax (host local)
	cam.ip3		= "http://admin:solrac@192.168.1.36";		// cam3 - jpeg frames
	cam.ip3h	= "http:192.168.1.32:614";					// cam3 - http steaming
	cam.ip3v	= "rtsp://admin:solrac@192.168.1.36";		// cam3 - rtsp streaming
//	cam.ip4		= "http://192.168.1.32:615";				// cam4 (LAN)
	cam.ip4		= "http://kaizen3.dyndns.org:600";			// cam4 - http streaming (Los Paleteros - quiosque)
	cam.ip4v	= "rtsp://admin:123456@192.168.1.254:554";	// cam4 - rtsp streaming
	cam.ip5h	= "http://192.168.1.32:616";				// cam5 - http steaming
//	cam.ip5		= "http://192.168.1.230";					// cam5 - comandos
//	cam.ip5u	= "rtmp://192.168.1.230:1935";				// cam5 - rtmp streaming
//	cam.ip5v	= "rtsp://admin:solrac@192.168.1.230:554";	// cam5 - rtsp streaming
	cam.ip5		= "http://admin:@192.168.1.38";				// cam5 - http streaming (Los Paleteros - carrinho)
	cam.ip5x	= cam.ip5;									// cam5 - proxyAjax (host local)

	set.local();

	cp.remOn(['pwrbtn']); $('#wan').hide(); $('#lan').show()
	set.end(false)		// set status "LAN"
  },
  //------------------------- server local
  local: function(){
	rx.ip		= "192.168.1.42";	//rfx9600 1
	rx.ip2		= "192.168.1.43";	//rfx9600 2
	rx.ip3		= "192.168.1.44";	//rfx9600 3
	rx.ip4		= "192.168.1.45";	//rfx9600 4
	rx.port		= 65442;
	rx.port2 	= 65442;
	io.ip		= "192.168.1.130";	// ip do módulo in/out
	io.port		= 70;
	rs.ip		= "192.168.1.131";	// ip do módulo rs232 (TCP232-24)
	rs.port		= 20108;
  },
  //------------------------- finalização setup
  end: function(x){
	wan = x;
	set.pass(1, function(x){
		cam.pass1  = x;
		cam.strm1  = cam.ip1 + "/videostream.cgi?" + x;	// url IPCam1 http streaming [cam.strm1 =cam.ip1+":80/snapshot.cgi?"+cam.pass1;]
		cam.snap1  = cam.ip1 + "/snapshot.cgi?"    + x
	})
	set.pass(2, function(x){ 
		cam.pass2  = x;
		cam.strm2  = cam.ip2 + "/videostream.cgi?" + x;	// url IPCam2 http streaming [cam.strm2 =cam.ip2+"/snapshot.jpg?"+cam.pass2;]
		cam.strm2v = cam.ip2 + "/videostream.asf?" + x;	// url IPCam2 rtsp streaming (VLC)
		cam.snap2  = cam.ip2 + "/snapshot.cgi?"    + x
	})
	set.pass(3, function(x){ 
		cam.pass3  = x;
		cam.strm3  = cam.ip3  + "/snapshot?strm=0";		// url IPCam3 rtsp streaming (rtsp://kaizen.dyndns-wiki.com:610/0/video0?cltid=)
	//	cam.strm3v = cam.ip3v + "/texthack.mov";		// url IPCam3 rtsp streaming (VLC / quicktime)
		cam.strm3v = cam.ip3v + "/0/video";				// url IPCam3 rtsp streaming (VLC)
		cam.audio3 = cam.ip3v + "/0/audio";
	})
	set.pass(4, function(x){ 
		cam.pass4  = x;
		cam.strm4  = cam.ip4  + "/videostream.cgi?" + x;// snapshot.cgi?user=admin&pwd=
		cam.strm4v = cam.ip4v + "/mpeg4";				// url IPCam4 rtsp streaming (VLC)
		cam.snap4  = cam.ip4  + "/snapshot.cgi?"	+x;
	})
	set.pass(5, function(x){ 
		cam.pass5  = x;
	//	cam.strm5  = cam.ip5  + "/" + x + "&channel=1&stream=0.sdp&snap.jpg";
	//	cam.strm5u = cam.ip5u + /*"/live"*/"/mpeg4";	// url IPCam5 rtmp streaming (flowplayer)
	//	cam.strm5v = cam.ip5v + "/" + x + "&channel=1&stream=0.sdp"/* + "?real_stream--rtp-caching=100"*/;	// url IPCam5 rtsp streaming (VLC)
		cam.strm5  = cam.ip5 + "/videostream.cgi?" + x + "&resolution=32&rate=0";
		cam.strm5v = cam.ip5 + "/videostream.asf?" + x;
		cam.snap5  = cam.ip5  + "/snapshot.cgi?"	+x;
	})
//	cam.strm5  = cam.ip5  + "/videostream.cgi?" + cam.pass5 + "&resolution=32&rate=0";

	dadoMem.IP  = ip.host;
	dadoMem.WAN = wan;
	cp.dataStore(dadoMem, function(status){
		sys.inicXbmcip();	// inicializa IPs do XBMC
		cam.com = false;
		if (curPag == "xbmcipPage")		showPage('camPage')	
		if (curPag == "xbmcipMblPage")	showPage('camMblPage')
		if (ip.client == "127.0.0.1") return;	// localhost, sem conexão com câmeras

		// verifica se RFX9600-2 responde:
		var time = cp.timeDate();
	//	setTimeout(function(){cam.param(5, 3, function(x){		// IP-Cam1 normal=0, flip=1, mirror=2, flip+mirror=3	//cam.param(1,120,function(){});	// IP-Cam1 brilho=6 (0 a 255)
		setTimeout(function(){ rx.cmd(3, 6, 2, '', 0, function(x){	// le status do rele 2 do RFX9600/3
			if (/*/ok/.test(x)*/x != null){
				cam.com = true;							// camera 1 ou RFX9600, respondeu
				cam.delayCom = cp.timeDate() - time;	// tempo de comunicação
				if (!rx.serialRfx) rs.setup();			// setup do módulo TCP232 (RS232)
				if (cam.delayCom < 700) setTimeout(dv.status, 3000)	// delay de comunicação < 700ms, set loop HT - leia powerON do projetor, receiver e PC
				else cp.msgErr("delay comun. RFX9600: " + cam.delayCom + " ms");
				inicIpControl();	// inicializa login e senha do ip-control
				//cp.doPost(cam.ip3 + "/rotate", "rotation=none", function(){});	// ("turnover"=flip	"none"=normal)
				//cp.addOn(['camImg3']);	// inverta cam 3 (flip), classe "imgFlip.on"
				cp.proxyAjax(cam.ip1x + "/set_misc.cgi?" + cam.pass1 + "&led_mode=" + 0, '', '', '', function(x){							// cam 1 login ( LED cam1 pisca 0,5 seg. [0=0,5s	1=rápido	2=desativado] ) ==> "ok."
					if (!/ok/.test(x)) camErr(1);
				})
				cp.proxyAjax(cam.ip2x + "/login.xml?" + cam.pass2, '', wan ? 10000 : 3000, '', function(x){									// cam 2 login (XML parser/filter tag "Success") ==> "1"
					if (x == "timeout" || $($.parseXML(x)).find("Success").text() != 1) camErr(2);
				})	// <?xml version="1.0" encoding="UTF-8" ?><Result><Success>1</Success><UserLevel>0</UserLevel><UserGroup>Admin</UserGroup></Result>
				cam.login3()																												// cam 3 login
				cp.proxyAjax(cam.ip5x + "/camera_control.cgi?" + cam.pass5 + '&param=3&value=32', '',  wan ? 10000 : 3000, '', function(x){	// cam 5 login (set resolution 640 x 480) ==> "ok."
					if (!/ok/.test(x)) camErr(5);
				})
				cam.show(cam.curr)
				function camErr(x) { cp.msgErr("cam " + x + ": erro de conexão", true) }
			}else
				cp.msgErr('sem conexão')

			if (!mobile) $("#clock").clock(true);
			blurBack("#camP, #navBox, .blur")	// desfoque imagens de fundo da camPag
		})}, 200)
	})
  },
  //------------------------- retorna usuário + senha
  pass: function(index, callback){
	if (chromeApp){
		if (index == 1) callback( "user=admin&pwd=admin" );
		if (index == 2) callback( "user=admin&usr=admin&password=admin&pwd=admin" );
		if (index == 3) callback( "user=admin&password=solrac" );
		//if (index == 4) callback( "admin:123456" );
		if (index == 4) callback( "loginuse=admin&loginpas=" );
		if (index == 5) callback( "user=admin&pwd=" );
	}else
		$.ajax({
			url: 'php/userpass.php',
			type: 'POST',
			data: {i: index},
			error: function (){ callback(null) },
			success: callback
		});
  },
  //------------------------- define dispositivo em função do tamanho do display
  tabDev: false,
  dev: function(){
	var winWid, winHei, heiHi, widHi, n = navigator.plugins/*, vlcPin = false*/;
	if (!ipadDev){ winWid = window.outerWidth;	winHei = window.outerHeight }
	else		 { winWid = 1024;				winHei = 768 }
	heiHi = winHei > (winDev ? 700 : 577);
	widHi = winWid > 930;
	set.tabDev	= !heiHi && widHi && !mobile;
	//cp.msgErr('W:' + winWid + ' H:' + winHei)
  },
  //------------------------- formata as páginas se tablet
  tablet: function(){
	$('l24005').addClass('listaMusicTab')
	cp.hide(['camNavi', 'rfx', 'aclista'])

	$().sty([
	'corpo',,-20,962,597,	// levanta página em 20 pixels
	'.fundoT',,,962,597,
	//--------------- cam pag.
	'camP',,30,,,
	'swpCam',,90,,350,		// área de sweep-cam-navigation
	'rls',,92,,,			// botões relés
	'bt3',,496,,,
	'bt5',58,96,,,
	'bt6',123,96,,,
	'gate',350,82,,,		// botão portão
	'gateBk',350,82,,,
	'botCam1',650,470,,,
	'botCam3',647,470,,,
	'dir',671,,,575,		// box diretório
	'ldir',,,,560,			// lista diretório
	'.xcancel',905,535,,,	// botões cancel-inout/arcond
	'x1',235,525,,,			// botão cancel-diretório (mainPag)
	//--------------- inout
	'c1',250,,,,			// botão limpa
	'bx0',200,20,,,
	'bx1',200,257,,,
	'bx2',620,257,,,
	'bx3',620,407,,,
	//--------------- xbmcip
	'ipBtns',760,,,536,
	'bx4',,,,300,
	'l50000',,,,290,
	'bx5',490,410,,,
	'bt8',,320,,,			// "limpe log"
	'd302',126,511,,,		// botões PROJ.	RECVER.	HTPC
	'showRfxRes',,400,,,	// "cmd:.."	"port:.."	"==> .."
	//--------------- xbmcmain
	'la',316,186,,400,
	'l12002',,,,370,		// lista fontes
	'l12005',,,,370,		// lista files
	'.listaLetra',,,,370,
	'miniCam',,465,,,
	'analyser',,465,,,
	'txt1',580,135,,,		// caixa texto: json id, midia e versão xbmc
	'bx',230,463,,,			// div botões "escape", INFO e MEMO
	'infBtn',-80,45,,,		// botão INFO
	'mb',0,90,,,			// botão MEMO
	'd30000',355,250,,,		// botões vídeo e áudio (animados)
	'a115',,442,,,			// slider horiz. teste
	'v115',,400,,,			// slider result. teste
	'd2408b',,442,,,		// idem
	//--------------- xbmcmusic
	'd2505',,562,,,			// botões letras-music
	'd2404',,,,350,			// box lista músicas
	'l25005',,,,305,		// lista files-music
	//--------------- xbmcvideo
	'.listaVideo',,,960,,	// lista video thumbs
	'd2303',,347,,,			// box video thumbs
	'd2305',5,562,,,		// box letras
	's21000',885,120,,,		// contador de filmes
	'sinBox',316,596,,,		// box sinopse
	'd2302',761,178,,,		// box menu explorer
	//--------------- xbmcmain/xbmcmusic
	'd39',,87,,,				// botão playlist
	'd1302',340,200,,,		// lista fontes
	'l12007',,,,310,		// playlist
	//--------------- xbmcmain/xbmcmusic/xbmcvideo
	'labelsMain',,186,,,
	'lm',,,301,,			// box de campos títulos, arquivos, etc...
	'.s20000',,,292,,
	'.s20001',,,292,,
	'.s20002',,,292,,
	'.s20003',,,292,,
	'.s20010',,,292,,
	'weather',190,,,,
	's20008',190,,,,
	'.hvinco',,,290,,
	'latMenu',973,,,581,	// menu lateral
	'sliderVol',984,,,,		// barra de volume
	'd304',45,55,,,			// botão search-refresh
	'd305',,168,,,			// botão explorer
	'sliderVol',,244,,,
	'btnHand',,500,,,
	'swpMouse',416,594,,,
	'im1',,7,290,163,
	'im2',125,7,163,163,
	'im3',140,7,109,163,
	'd2311',185,,,,
	//--------------- 
	'btc',,320,,,
	])

	$('.listaLetra').css("line-height", "26px")
	$('#l24005').addClass('tab')
//	$('#l22005').addClass('tab') // lista video thumbs
	$("#fileinput").hide()
  },

};

/* Instruções importantes:

Configuração do Apache (alterar httpd.conf):

	#Listen [::]:80
	Listen 8090

	ServerName localhost:8090

	#DocumentRoot "C:/webserver/xampp/htdocs"
	DocumentRoot "C:/webserver/webroot"

	#<Directory "C:/webserver/xampp/htdocs">
	<Directory "C:/webserver/webroot">

-------------------------------------------------------

Configuração do Apache (alterar httpd-xampp.conf), não é necessária:

deletar o texto abaixo ou alterar "Deny from all" para "Allow from all"

	#
	# New XAMPP security concept
	#
	<LocationMatch "^/(?i:(?:xampp|security|licenses|phpmyadmin|webalizer|server-status|server-info))">
		Order deny,allow
		Deny from all
		Allow from ::1 127.0.0.0/8 \
			fc00::/7 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16 \
			fe80::/10 169.254.0.0/16
	
		ErrorDocument 403 /error/XAMPP_FORBIDDEN.html.var
	</LocationMatch>

-------------------------------------------------------

Configuração do PHP (alterar php.ini):

	post_max_size = 1000M

	upload_max_filesize = 1000M

	memory_limit = 1000M

-------------------------------------------------------

Config. de FileZilla (alterar FileZilla Server.xml):

	<FileZillaServer>
		<Groups />
		<Users>
			<User Name="admin">
				<Option Name="Pass">21232f297a57a5a743894a0e4a801fc3</Option>
				<Option Name="Group" />
				<Option Name="Bypass server userlimit">0</Option>
				<Option Name="User Limit">0</Option>
				<Option Name="IP Limit">0</Option>
				<Option Name="Enabled">1</Option>
				<Option Name="Comments" />
				<Option Name="ForceSsl">0</Option>
				<IpFilter>
					<Disallowed />
					<Allowed />
				</IpFilter>
				<Permissions>
					<Permission Dir="C:\xampp\webserver\webroot">
						<Option Name="FileRead">1</Option>
						<Option Name="FileWrite">1</Option>
						<Option Name="FileDelete">1</Option>
						<Option Name="FileAppend">1</Option>
						<Option Name="DirCreate">1</Option>
						<Option Name="DirDelete">1</Option>
						<Option Name="DirList">1</Option>
						<Option Name="DirSubdirs">1</Option>
						<Option Name="IsHome">1</Option>
						<Option Name="AutoCreate">0</Option>
					</Permission>
				</Permissions>
				<SpeedLimits DlType="0" DlLimit="10" ServerDlLimitBypass="0" UlType="0" UlLimit="10" ServerUlLimitBypass="0">
					<Download />
					<Upload />
				</SpeedLimits>
			</User>
		</Users>
		<Settings>
			.
			.
			.
		</Settings>
	</FileZillaServer>
*/