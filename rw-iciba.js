if ($.prototype.tagName == undefined) {
	$.prototype.tagName = function() {
		return this.prop('tagName');
	};
}

function ICibaXML2Object(wordXML, dest) {
	var phId = 0, lastItem = null;
	$(wordXML.documentElement).children().each(function () {
		// key, [ps, pron], [pos, acceptation], [sent[orig, trans]]
		var e = $(this);
		switch (e.tagName()) {
			case 'key':
				dest.spell = e.text();
				break;

			case 'ps':
				lastItem = { id: '', mark: e.text(), mp3: null, };
				switch (dest.ph.length) {
					case 0: // be
						lastItem.id = 'be';
						break;
					case 1: // us
						lastItem.id = 'us';
						break;
				}
				dest.ph.push(lastItem);
				break;
			case 'pron':
				if (lastItem) {
					lastItem.mp3 = e.text();
					lastItem = null;
				}
				break;

			case 'pos':
				lastItem = { part: e.text(), chs: '' };
				dest.explains.push(lastItem);
				break;
			case 'acceptation':
				if (lastItem) {
					lastItem.chs = e.text();
					lastItem = null;
				}
				break;

			case 'sent':
				var s = { 'orig': '', 'trans': '', };
				for (var k in s)
				{
					s[k] = $(k, e).text();
				}
				dest.sentences.push(s);
				break;
		}
	});
	console.log(dest);
}

dataSource.push({
	name: 'iciba',
	ajax: {
		'xml': {
			type: 'xml',
			url: "http://dict-co.iciba.com/api/dictionary.php",
			wordKey: 'w',
			args: { key: "8028C67FC317FF1F0F5D4374B8FE5E1A", },
			handler: ICibaXML2Object,
		},
	},
	site: {
		web: "http://www.iciba.com/#{word}",
		icon: 'http://res.iciba.com/dict/favicon.ico',
		title: {
			en: "iCiba",
			zh: "爱词霸",
		},
	},
});

