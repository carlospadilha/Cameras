var cvs = {
  pi_x_2: 2 * Math.PI,
//------------------ sistema solar
  solarSystem: function(){
	var sun = new Image(), moon = new Image(), earth = new Image();
	sun.src = '../img/Canvas_sun.png'; moon.src = '../img/Canvas_moon.png'; earth.src = '../img/Canvas_earth.png';
	window.requestAnimationFrame(draw);

	function draw() {
		var ctx = document.getElementById('canvas').getContext('2d');
	
		ctx.globalCompositeOperation = 'destination-over';
		ctx.save();		// salva coord. iniciais
		ctx.clearRect(0, 0, 300, 300);				// clear canvas

	
		ctx.translate(150, 150);					// coord. 0,0 no centro do box
		
		var time = new Date(), seconds = time.getSeconds(), miliSec = time.getMilliseconds();
		// Earth
		ctx.rotate( cvs.pi_x_2 / 60 * seconds + cvs.pi_x_2 / 60000 * miliSec );
		ctx.translate(105, 0);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';		// cor da ...
		ctx.fillRect(0, -12, 50, 24);				// sombra
		ctx.drawImage(earth, -12, -12);
	
		// Moon
		ctx.rotate( cvs.pi_x_2 / 6 * seconds + cvs.pi_x_2 / 6000 * miliSec );
		ctx.translate(0, 28.5);
		ctx.drawImage(moon, -3.5, -3.5);
	
		ctx.restore();	// restaura coord. iniciais
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';	// cor da ...
		ctx.arc(150, 150, 105, 0, cvs.pi_x_2, false);	// linha de órbita da terra, PI * 2 = 360º ==> circulo completo, [arc(x, y, radius, startAngle, endAngle, anticlockwise)]
		ctx.stroke();
	
		ctx.drawImage(sun, 0, 0, 300, 300);
	
		window.requestAnimationFrame(draw);
	}
  },
//------------------ relógio
  clock: function(){
	var now = new Date(), sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours(), PI_div_6 = Math.PI / 6, escala = 0.4,
		ctx = document.getElementById('clock').getContext('2d'), reqAnimFrame = function (x) { window.setTimeout(x, 300) };
	ctx.save();
	ctx.clearRect(0, 0, 150, 150);
	ctx.translate(150 * escala, 150 * escala);		// coord. 0,0 no centro do box
	ctx.scale(escala, escala);
	ctx.rotate(-Math.PI / 2);	// gire 90º anti-hor.
	ctx.strokeStyle = "black";	// cor dos traços
	ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'; ctx.fill();	// cor de fundo do relógio
	ctx.lineCap = "round";		// pontas das linhas arredondadas

	// Hour marks
	ctx.save();
	ctx.lineWidth = 8;			// espess. traços de horas
	for (var i = 0; i < 12; i++){
		ctx.beginPath(); ctx.rotate(PI_div_6); ctx.moveTo(100, 0); ctx.lineTo(120, 0); ctx.stroke();	// traço de hora
	}
	ctx.restore();

  // Minute marks
	ctx.save();
	ctx.lineWidth = 5;			// espess. traços de min.
	for (i = 0; i < 60; i++){
		if (i % 5 != 0){
			ctx.beginPath(); ctx.moveTo(117, 0); ctx.lineTo(120, 0); ctx.stroke();	// traço de minuto
		}
		ctx.rotate(Math.PI / 30);
	}
	ctx.restore();

	hr = hr >= 12 ? hr - 12 : hr;
	// ponteiro de horas
	ctx.save();
	ctx.rotate( hr * PI_div_6 + Math.PI / 360 * min + Math.PI / 21600 * sec )
	ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-20, 0);  ctx.lineTo(80, 0); ctx.stroke();	// ponteiro horas
	ctx.restore();
	// ponteiro de minutos
	ctx.save();
	ctx.rotate( Math.PI / 30 * min + Math.PI / 1800 * sec )
	ctx.lineWidth = 8;  ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(112, 0); ctx.stroke();	// ponteiro min.
	ctx.restore();
	// ponteiro de segundos
	ctx.save();
	ctx.rotate(sec * Math.PI / 30);
	ctx.strokeStyle = "#D40000";	// cor ponteiro segundos
	ctx.lineWidth = 6;
	ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(83, 0); ctx.stroke();	// -------
	ctx.fillStyle = "#D40000";
	ctx.beginPath(); ctx.arc(0, 0, 10, 0, cvs.pi_x_2, true); ctx.fill();	// -o-----
	ctx.beginPath(); ctx.arc(95, 0, 10, 0, cvs.pi_x_2, true); ctx.stroke();	// -o-----o
	ctx.fillStyle = "black";
	ctx.beginPath(); ctx.arc(0, 0, 4, 0, cvs.pi_x_2, true); ctx.fill();	// eixo central dos ponteiros (bolinha preta)
	ctx.restore();
	// círculo externo
	ctx.beginPath(); ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(70, 120, 255, 0.7)'; ctx.arc(0, 0, 142, 0, cvs.pi_x_2, true); ctx.stroke();

	ctx.restore();

	reqAnimFrame(cvs.clock);
  },
};


// ==============================================================================================================================================

(function($){
	$.fn.cloth  = function(){
		if (!canvas){
			canvas = this[0];
			ctx = canvas.getContext('2d');
			canvas.width = 560; canvas.height = 350;
			start();
		} else{
			cloth = new Cloth();	// gera novo pano
			update();				// loop de frames
		}
		return this
	}
	var reqAnimFrame = /*window.requestAnimationFrame ||*/ function (callback) { window.setTimeout(callback, 1000 / 60) },
		physics_accuracy = 3, mouse_influence = 20, mouse_cut = 5, gravity = 1200, cloth_height = 30, cloth_width = 50,  start_y = 20, spacing = 7, tear_distance = 60,
		canvas, ctx, cloth, boundsx, boundsy, mouse = { down: false, button: 1, x: 0, y: 0, px: 0, py: 0 };

	var Point = function (x, y) {
		this.x = x; this.y = y; this.px = x; this.py = y; this.vx = 0; this.vy = 0; this.pin_x = null; this.pin_y = null; this.constraints = [];
	};
	// força da gravidade e força de influência do mouse
/*	Agora sabemos onde cada um dos pontos vizinhos estão empurrando. Embora ainda não terminamos de somar todas as forças, bem como os pontos vizinhos chatos empurrando-o em direções diferentes,
	não podemos esquecer da força gravitacional puxando-o para baixo e, claro, a influência do mouse.
	Então, aqui vamos verificar se o mouse está pressionando para baixo, e se sim, calcular a distância do mouse para o ponto. Temos uma variável chamada "mouse_influence" que nos diz o raio
	de distância do mouse aos pontos afetados. Temos isto desde que o mouse seja clicado em um único pixel e muito provavelmente ele perderá alguns pontos no quadro.
	Tendo a "mouse influence" podemos achar a distância do mouse e os pontos afetados. Se o botão direito do mouse é clicado, significa que estamos cortando o pano e assim vamos nos livrar dos
	"constraints" (linhas de conexão) desses pontos. Se o botão esquerdo do mouse é pressionado e movendo-se, empurramos o pano junto à mesma velocidade do mouse.
	A velocidade do pano é pos. atual (x e y) menos pos. anterior (px e py) sobre o período de tempo que é igual à velocidade do rato da sua localização atual menos a sua localização anterior.
	A constante de tempo de 1,5 é devido à defasagem entre o mouse e o pano.*/
	Point.prototype.update = function (delta) {
		if (mouse.down) {											// mouse-down
			var diff_x = this.x - mouse.x, diff_y = this.y - mouse.y,		dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
			if (mouse.button == 1) {								// left-clic
				if (dist < mouse_influence) {						// dist. mouse e o ponto < 20
					this.px = this.x - (mouse.x - mouse.px) * 1.5; 	// veloc. do pano, coord. x
					this.py = this.y - (mouse.y - mouse.py) * 1.5;	// idem y
				}
			} else if (dist < mouse_cut) this.constraints = [];		// right-clic, se desloc. mouse < 5, corte segmento
		}
		this.add_force(0, gravity);	// vx = 0, vy = gravity
	/*	Se nós simplesmente atualizarmos nossas coordenadas para o novo local, teletransportaríamos para um novo local que não é o que queremos. Precisamos levar em conta onde a
		nossa localização atual está e dar um passinho na direção que estão sendo empurrados. Além disso, o que fazer se já estivéssemos nos movendo em uma determinada direção,
		com uma certa velocidade? Nós não vamos congelar e realocar para o novo local. Por causa da inércia (e outras leis da física) o comportamento mais realista é atualizar a nova posição
		do ponto depois de olhar onde o ponto está agora e aplicar um pouco de força, dependendo das "constrains", da gravidade e do movim. do mouse, bem como sua velocidade anterior e,
		então, dar um passo nessa direção. Tudo isto é calculado usando a integração de verlet.
		v = ƒadt = at + vº
		r = ƒ(at + vº)dt = (at²)/2 + vºt + rº
		Para obter a versão de tempo contínuo, pegamos a velocidade pela integração da aceleração pelo tempo. Para obter a posição, integramos a velocidade. O resultado é que o novo local é
		igual à antiga posição + velocidade * tempo + 0,5 * aceleração * tempo2.
		Versão discreta:
		->     ->    ->  ->	  	 Dti	  ->  Dti + Dti-1
		xi+1 = xi + (xi - xi-1) ------- + ai ------------- Dti,	onde D = delta
								 Dti-1			   2
		em nosso caso usamos aproximações:
		 Dti					 Dti + Dti-1
		----- é aprox. 0.99	,	------------- é aprox. D² / 2
		Dti-1						  2
		*/
		var D2div2 = delta * delta / 2; // D² / 2
		var nx = this.x + (this.x - this.px) * .99 + (this.vx * D2div2),	// correção pos. x
			ny = this.y + (this.y - this.py) * .99 + (this.vy * D2div2);	// idem y

		this.px = this.x;	this.py = this.y;	// salve pos. x,y
		this.x	= nx;		this.y	= ny;		// nova pos. x,y corrigida pelo efeito das forças
		this.vy = this.vx = 0
	};
	// traça um segmento
	Point.prototype.draw = function () {
		if (this.constraints.length <= 0) return;
		var i = this.constraints.length; while (i--) this.constraints[i].draw();	// traça segmento de p1 a p2, dentro constraints[1] e constrainsts[0], via Constraint.prototype.draw()
	};

	Point.prototype.resolve_constraints = function(){
		if (this.pin_x != null && this.pin_y != null) { this.x = this.pin_x; this.y = this.pin_y; return }	// x = pin_x , y = pin_y
		var i = this.constraints.length; while (i--) this.constraints[i].resolve();		// p1.x = p1.x + F, p1.y = p1.y + F, p2.x = p2.x - F, p2.y = p2.y - F
		if (this.x > boundsx) this.x = 2 * boundsx - this.x	// se nó.x > lim. sup. canvas (> 559), x = 1118 - x
		else if (this.x < 1)  this.x = 2 - this.x;			// se nó.x < lim. inf. canvas (<   1), x =    2 - x
		if (this.y > boundsy) this.y = 2 * boundsy - this.y	// se nó.y > lim. sup. canvas (> 349), y =  698 - y
		else if (this.y < 1)  this.y = 2 - this.y;			// se nó.y < lim. inf. canvas (<   1), y =    2 - y
	};
	// cria constraints[ Constraint[ p1:célula atual, p2:célula vizinha ] ]
	Point.prototype.attach = function (point) { this.constraints.push( new Constraint(this, point) ) };
	// verifica ruptura da célula por esticamento
	Point.prototype.remove_constraint = function (lnk) { var i = this.constraints.length; while (i--) if (this.constraints[i] == lnk)  this.constraints.splice(i, 1) };	// ruptura da célula
	// atualiza vx:x, vy:y
	Point.prototype.add_force = function (x, y) { this.vx += x; this.vy += y };
	// atualiza pin_x:pinx, pin_y:piny
	Point.prototype.pin = function (pinx, piny) { this.pin_x = pinx; this.pin_y = piny };
	// atualiza constraints{p1: p1, p2: p2}	[uma vez]
	var Constraint = function (p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.length = spacing;
	};
/*	A primeira coisa é verificar se o ponto está preso no quadro. Se estiver, ajusta-se sua coordenadas x e y às do pino e retorna. Um ponto preso não pode se mover.
	Temos que passar por todas as "constraints" para esse ponto e calcular o seu efeito sobre ele. Primeiro é feito o cálculo da distância do ponto vizinho anexado.
	Se a distância for maior que "tear_distance" então os segmentos de pano já não mais estão ligados (e removemos esse ponto "constraint").
	Caso contrário, nós calculamos "diff", que é a diferença entre o espaçamento natural do pano (definido como 7px) e o que é na realidade.
	Portanto, se o tecido é esmagado em conjunto, a distância entre os pontos irá ser inferior a 7px e haverá uma força sobre os pontos para empurrar os pontos para fora,
	para que seu espaçamento volte a ser 7. Por outro lado, se o tecido está sendo esticado a distância entre os pontos será maior do que 7px e eles vão querer se aproximar juntos.
	O "diff" é reduzido à metade pois os dois pontos irão se mover para atingir o equilíbrio e eles só precisam viajar metade da distância para chegar lá.
	Isso atualiza o valor de "constraint" à coordenada que está empurrando o ponto na direção.
	Se um ponto está ligado a quatro pontos, isto significa que ele tem quatro "constraints". Alguns de seus vizinhos podem empurrar ou puxar, e outros poderão não ter qualquer efeito sobre ele.
	Quando terminarmos um ciclo através de "constraints" px e py do nosso ponto representará a coordenada onde tudo isso terminou. Então verificaremos se o local que terminou está
	na área da tela visível. O efeito do pano quando ele sai da tela é que ele bate e volta (bounce back). É permitido uma área entre 0 e 100 e negociamos ir para 120.
	Para "bounce back", dizemos 2100-120 = 80. Da mesma forma, se escaparmos fora dos limites para a esquerda e ir para -20, dizemos 20 - (-20) = 20 e então "bounce back" em nossa grade.*/
	Constraint.prototype.resolve = function () {
		var diff_x = this.p1.x - this.p2.x,		diff_y = this.p1.y - this.p2.y,		dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),	diff = (this.length - dist) / dist;
		if (dist > tear_distance) this.p1.remove_constraint(this);	// se dist > 7, verifique ruptura por esticamento
		var px = diff_x * diff * 0.5,
			py = diff_y * diff * 0.5;
		this.p1.x += px; this.p1.y += py;
		this.p2.x -= px; this.p2.y -= py;
	};
	// traça segmento de p1 a p2
	Constraint.prototype.draw = function () {
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
	};
	// // construção do "pano": (50 segmentos na horiz.) x (30 na vert.), compr. segm: 7, formado por células em Cloth.points[]
	var Cloth = function () {
		this.points = [];														// Cloth.points = []
		var start_x = canvas.width / 2 - cloth_width * spacing / 2;				// nó_x_inicial = 560 / 2 - 50 * 7 / 2 = 105
		for (var y = 0; y <= cloth_height; y++) {
			for (var x = 0; x <= cloth_width; x++) {
				var p = new Point(start_x + x * spacing, start_y + y * spacing);// p = { constraints:[]				 , x:nó_x, y:nó_y, px:nó_x, py:nó_y, vx:0, vy:0, pin_x:null, pin_y:null }
				x != 0 && p.attach(this.points[this.points.length - 1]);		// p = { constraints:[p1:p, p2:p_esq], ... }	__ conecta com nó esquerdo
				y == 0 && p.pin(p.x, p.y);										// p = { ...																	   , pin_x:p.x , pin_y:p.y }
				y != 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)])// p = { constraints:[p1:p, p2:p_sup], ... }	 | conecta com nó superior
				this.points.push(p);											// Cloth.points.push(p)
			}
		}
	};
/*	"physics_accuracy" é o nome da variável que informa o programa quantas vezes executar "resolve constraints" para cada um dos pontos.
	O que isso muda, em alto nível, é quão elástico o pano é. Isto determina quantas vezes o método "resolve constraints" é chamado em cada um dos pontos.
	"resolve constraints" leva em conta as forças aplicadas a cada um dos pontos e diz-lhe onde ele vai passar no próximo quadro.
	Por exemplo, se é um ponto no meio do pano e não está em movimento, em seguida, esse ponto tem várias forças que actuam sobre ele. A força da gravidade puxando-o para baixo.
	Tem também o ponto acima, puxando-o para cima. Precisamos resolver essas forças e, em seguida, a rede deles vai ditar onde ele irá se mover para.
	Vamos ir para o código exato para esta próxima. Depoois de calculado as forças em cada um dos pontos podemos atualizá-los.*/
	Cloth.prototype.update = function () {
		var j = this.points.length, p = j,
			i = physics_accuracy; while (i--) { p = j; while (p--) this.points[p].resolve_constraints() }
		while (j--) this.points[j].update(.016);	// .016 força da gravidade em todas as células
	};
	// desenha segmentos do "tecido" potando as células
	Cloth.prototype.draw = function () {
		ctx.beginPath();
		var i = cloth.points.length; while (i--) cloth.points[i].draw();	// Point.prototype.draw(), traça segmento de p1 a p2, dentro constraints[1] e constrainsts[0]
		ctx.stroke();
	};
	// loop de frames
	function update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);	// limpa frame anterior
		cloth.update();
		cloth.draw();	// Cloth.prototype.draw(), desenha todos os segmentos, traça segmento de p1 a p2, dentro constraints[1] e constrainsts[0]
		reqAnimFrame(update);
	}
	// setup inicial, touch/mouse eventos
	function start() {
		var pointer = function(event){ return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event }
		$(canvas).on(touchDev ? 'touchstart' : 'mousedown', function(ev){
			var e = pointer(ev)
			mouse.button = touchDev ? 1 : e.which;		// 1: botão esquerdo	3: botão direito
			mouse.px = mouse.x;	mouse.py = mouse.y;		// salve pos. x,y anterior	(mouse.px, mouse.py)
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top,	// pos. x,y atual dentro de canvas (mouse.x, mouse.y)
			mouse.down = true;
			ev.preventDefault();
		})
		.on('touchend mouseup touchcancel', function(ev){
			mouse.down = false;
			ev.preventDefault();
		})
		.on(touchDev ? 'touchmove' : 'mousemove', function(ev){
			var e = pointer(ev)
			mouse.px = mouse.x; mouse.py = mouse.y;
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top,
			ev.preventDefault();
		});
	//	canvas.oncontextmenu = function (e) { e.preventDefault() };		// righ-click menu disable. Eliminado devido <body oncontextmenu="return false;">
		boundsx = canvas.width  - 1; 
		boundsy = canvas.height - 1;

		ctx.strokeStyle = '#888';
		cloth = new Cloth();	// gera células (p) em Cloth.points[]
		update();				// loop de frames
	}
})(jQuery)