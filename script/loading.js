//usando spin.min.js (página: http://fgnass.github.io/spin.js/)
$(document).ready(function(){

	function optSpinner(lin, len, wid, rad){
	  {
		this.lines = lin,	// nº linhas
		this.length = len,	// comp. linha
		this.width = wid,	// larg. linha
		this.radius = rad,	// raio círculo interno
		this.corners = 1,	// Corner roundness (0..1)
		this.rotate = 0,	// rotation offset
		this.direction = 1, // 1: horário, -1: anti-hor.
		this.color = '#FFF',
		this.speed = 1.2,	// Rounds per second
		this.trail = 60,	// Afterglow percentage
		this.shadow = false, // render a shadow
		this.hwaccel = false, // hardware acceleration
	//	this.className = 'spinner', // The CSS class to assign to the spinner
		this.zIndex = 2e9,	// z-index (defaults to 2000000000)
		this.top = 'auto',	// Top position relative to parent in px
		this.left = 'auto'	// Left position relative to parent in px
	  }
	}

	var opts1 = new optSpinner(12, 28, 10, 25), opts2 = new optSpinner(10, 14, 6, 14), opts3 = new optSpinner(10, 9, 5, 11),

	spinner = new Spinner(opts1).spin(C$('#d1305')),
	spinner = new Spinner(opts1).spin(C$('#camLoading'));
	spinner = new Spinner(opts2).spin(C$('#camLoading1'));
	spinner = new Spinner(opts2).spin(C$('#camLoading2'));
	spinner = new Spinner(opts2).spin(C$('#camLoading3'));
	spinner = new Spinner(opts2).spin(C$('#camLoading4'));
	spinner = new Spinner(opts2).spin(C$('#imgLdng'));
	spinner = new Spinner(opts3).spin(C$('#cam1ldng'));
	spinner = new Spinner(opts3).spin(C$('#cam2ldng'));
	spinner = new Spinner(opts3).spin(C$('#cam3ldng'));
})