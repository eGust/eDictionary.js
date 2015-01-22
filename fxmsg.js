// setup firefox add-on msg
self.port.on("show", function () {
	initUI();
});

function isEnglishWord(w)
{
	for (var i = 0; i < w.length; i++)
	{
		var c = w[i];
		if ( !((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == ' ' || c == "'" || c == '-') )
			return false;
	}
	return true;
}

self.port.on("queryWord", function (word) {
	word = word.trim().toLowerCase();
	if (word == '' || !isEnglishWord(word))
		return;

	saveSettings( { word: word, wordObject: null, } );
});
