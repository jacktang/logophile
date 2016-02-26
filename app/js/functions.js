const remote = require('electron').remote;
const dialog = remote.require('dialog');


function openFile() {
	dialog.showOpenDialog({
			properties: ['openFile']
		},
		function(fileNames) {
			// loadPdf(fileNames[0]);
			PDFJS.getDocument(fileNames[0]).then(function(pdfDocument) {
				// Document loaded, specifying document for the viewer and
				// the (optional) linkService.
				pdfViewer.setDocument(pdfDocument);

				pdfLinkService.setDocument(pdfDocument, null);
			});
		})
}

function handleLibrary() {

}

function openRecent() {

}

function gotoBookmark() {

}

function handleFonts() {

}

function handleFullscreen() {

}

function changePage() {

}

function showDialog(id) {
	var dialog = $(id).data('dialog');
	dialog.open();
}

function showCharm(id) {
	var charm = $(id).data("charm");
	if (charm.element.data("opened") === true) {
		charm.close();
	} else {
		charm.open();
	}
}
$(function() {
	showCharm('#bottomCharm');
})

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
var menu = new Menu();
menu.append(new MenuItem({
	label: 'GetMeaning',
	click: function() {
		getMeaning();
	}
}));
window.addEventListener('contextmenu', function(e) {
	e.preventDefault();
	menu.popup(remote.getCurrentWindow());
}, false);

var getMeaning = function() {
	var text = window.getSelection().toString();
	if (text === "") {
		alert('select a text first');
	} else {
		myWorker.postMessage({
			task: 'meaning',
			word: text
		});
	}
}
$(function() {
window.myWorker = new Worker("dict/worker.js");
var words = "";
myWorker.onmessage = function(e) {
	if (e.data && e.data.task == "meaning") {
		words = e.data.results.definitions;
		var str = '<table border="1"><tr><th>Word</th><th>Type</th><th>Meaning</th></tr>';
		for (var i = words.length - 1; i >= 0; i--) {
			str += '<tr><td>' + e.data.word + '</td><td>' + words[i]['part_of_speech'] + '</td><td>' + words[i]['definition'] + '</td></tr>';
		};
		str += '</table>';
		document.getElementById('modalword').innerHTML = str;
		showDialog('#dialog')
	} else {
		var str = 'Word not found in dictionary';
		document.getElementById('modalword').innerHTML = str;
		showDialog('#dialog')
	}
};
// myWorker.postMessage({
// 	task: 'start'
// }); // Send data to our worker.
});