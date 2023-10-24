function copy_export() {
	navigator.clipboard.writeText('avascript:var element=document.createElement("a");element.setAttribute("href","data:text/plain,"+encodeURIComponent(localStorage.getItem(gameName))),element.setAttribute("download",gameName+".nsav"),element.style.display="none",document.body.appendChild(element),element.click(),document.body.removeChild(element);');
	window.alert("export script copied successfully");
}

function copy_import() {
	navigator.clipboard.writeText('avascript:var sav=document.createElement("input");function loadSav(){sav.files[0].text().then(t=>loadSav2(t))}function loadSav2(t){let a=sav.files[0].name;a.endsWith(".nsav")?(a=a.replace(/(.+)\.nsav$/gm,"$1"),localStorage.setItem(a,t),window.alert("save imported successfully"),document.body.removeChild(sav)):window.alert("file isn\'t an .nsav")}sav.setAttribute("type","file"),sav.setAttribute("id","sav"),sav.setAttribute("oninput","loadSav()"),sav.classList.add("button"),document.body.appendChild(sav);');
	window.alert("import script copied successfully");
}

async function toSav() {
	var sav = document.getElementById("sav");
	if(sav.files.length < 1)
		window.alert("no file selected");
	else {
		let name = sav.files[0].name;
		if(name.endsWith(".nsav")) {
			name = name.replace(/(.+)\.nsav$/gm,"$1.sav");
			let save_data;
			await sav.files[0].text().then(text => save_data = text);
			if(save_data.startsWith("{\"mem\":[") && save_data.endsWith("]}")) {
				save_data = save_data.replace(/^{"mem":\[(.+)\]}$/,"$1");
				save_data = save_data.split(",");
				let byte_arr = new Uint8Array(save_data);
				let blob = new Blob([byte_arr], {type: "octet/stream"});
				download_blob(name,blob);
			}
			else
				window.alert(".nsav is corrupted");
		}
		else
			window.alert("selected file isn't a .nsav");
	}
}

async function toNsav() {
	var sav = document.getElementById("sav");
	if(sav.files.length < 1)
		window.alert("no file selected");
	else {
		let name = sav.files[0].name;
		if(name.endsWith(".sav")) {
			name = name.replace(/(.+)\.sav$/gm,"$1.nsav");
			let save_data;
			await sav.files[0].arrayBuffer().then(data => save_data = new Uint8Array(data));
			
			save_data = '{"mem":[' + save_data.join(",") + "]}";
			let blob = new Blob([save_data], {data: "text/plain"});
			download_blob(name, blob);
		}
		else
			window.alert("selected file isn't a .sav");
	}
}

function download_blob(name, blob) {
	var element = document.createElement('a');
	element.setAttribute('href', URL.createObjectURL(blob));
	element.setAttribute('download', name);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}