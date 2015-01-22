function YoudaoJSON2Object(wordJSON, dest) {
	dest.error = wordJSON.errorCode;
	dest.spell = wordJSON.query;

	const phKeys = { "phonetic": "", "uk-phonetic": "be", "us-phonetic": "us", };
	var wd = wordJSON.basic, usedBE = false, phs = {};
	for (var k in phKeys) {
		var v = phKeys[k], mark = wd[k];
		if (!mark)
			continue;
		if (v == "") {
			if (usedBE)
				continue;
			v = "be";
		} else if (v =="be") {
			usedBE = true;
		}

		phs[v] = { id: v, mark: mark, mp3: '', };
	}

	for (var k in phs) {
		dest.ph.push(phs[k]);
	}

	for (var i in wd.explains) {
		var e = wd.explains[i], p = e.indexOf(' ');
		dest.explains.push( {
			part: e.substr(0, p),
			chs: e.substr(p+1),
		} );
	}
}

dataSource.push({
	name: 'youdao',
	ajax: {
		'json': {
			type: 'json',
			url: "http://fanyi.youdao.com/openapi.do",
			wordKey: 'q',
			args: {
				keyfrom: "eDictionary",
				key: "1337053915",
				type: "data",
				doctype: 'json',
				version: '1.1',
			},
			handler: YoudaoJSON2Object,
		},
		'jsonp': {
			type: 'jsonp',
			url: "http://fanyi.youdao.com/openapi.do",
			wordKey: 'q',
			args: {
				keyfrom: "eDictionary",
				key: "1337053915",
				type: "data",
				doctype: 'jsonp',
				version: '1.1',
			},
			handler: YoudaoJSON2Object,
		},
	},
	site: {
		web: "http://dict.youdao.com/search?q=#{word}",
		icon: 'http://shared.ydstatic.com/images/favicon.ico',
		title: {
			en: "Youdao",
			zh: "有道",
		},
	},
});

