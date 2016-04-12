(function($){
	$.fn.drop = function(e){	// botão id="fileinput" acionado
		var file = !e ? document.getElementById('fileinput').files[0] : e.dataTransfer.files[0];
		if (file) parseFile(file);
	}
	
	var chunkSize  = 1024 * 1024/*bytes*/, mp4box;
	
	function parseFile(file){
		var fileSize   = file.size, offset = 0, self = this /*we need a reference to the current object*/, readBlock  = null, startDate  = new Date();
		
		mp4box = new MP4Box(false);
		mp4box.onError = function(e){ console.log("mp4box failed to parse data.") };
	
		var onparsedbuffer = function(mp4box, buffer){
		//#	console.log("Appending buffer with offset "+offset);
			buffer.fileStart = offset;
			mp4box.appendBuffer(buffer);	
		}
	
		var onBlockRead = function(evt){
			if (evt.target.error == null){
				onparsedbuffer(mp4box, evt.target.result); // callback for handling read chunk
				offset += evt.target.result.byteLength;
				cp.setLoading(offset / fileSize)
			} else { console.log("Read error: " + evt.target.error); return }
			if (offset >= fileSize){
				cp.rstLoading()
				console.log("Done reading file (" + fileSize + " bytes) in " + (new Date() - startDate) + " ms");
				mp4box.flush();
				finalizeUI();
				return;
			}
			readBlock(offset, chunkSize, file);
		}
	
		readBlock = function(_offset, length, _file){
			var r = new FileReader(), blob = _file.slice(_offset, length + _offset);
			r.onload = onBlockRead;
			r.readAsArrayBuffer(blob);
		}
		readBlock(offset, chunkSize, file);
	}

	function finalizeUI(){
		dir.set()	// prepara para gerar lista de diretório
		var box  = mp4box.inputIsoFile,
			itms = mp4box.inputIsoFile.items,
			info = mp4box.getInfo();
		dir.objList({ box: box, itms: itms, info: new clpParse(info), tracks: new clpParse(info.tracks) })
	}
})(jQuery);

function clpParse(x) { this[0] = x }	// cria instance of clpParse