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

function onClickCM(info, tab) {
	var word = info.selectionText.trim().toLowerCase();
	if (word == '' || !isEnglishWord(word))
		return;

	saveSettings( { word: word, wordObject: null, } );
	//console.log(info, text);
}

var cm = chrome.contextMenus.create({
	"title": "Search word in eDictionary", 
	"id": "eDictionary.contextMenu",
	"contexts": ["selection"],
	"onclick": onClickCM
});
