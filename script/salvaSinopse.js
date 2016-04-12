readWrite = function(file, data, rw, datatype, callback){
	$.ajax({
		url: 'http://192..168.1.31:8090/php/readWrite.php',
		type: 'POST',
		data: {
			file: file,
			data: datatype == "json" ? JSON.stringify(data) : data,
			type: rw
		},
		dataType: datatype,
		error: function(xhr, sta){callback(sta)},
		success: function(data){callback(data)}
	});
}

readWrite("sinopse.txt", storedVars['sinopse'], "w", "", function(dado){
	var a = a;
})