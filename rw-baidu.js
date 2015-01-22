function BaiduJSON2Object(wordJSON, dest) {
	dest.error = wordJSON.errno;
	var wd = wordJSON.data;
	dest.spell = wd.word_name;

	const phKeys = { "ph_en": "be", "ph_am": "us", };
	wd = wd.symbols[0];
	for (var k in phKeys) {
		var v = phKeys[k], mark = wd[k];
		if (!mark)
			continue;
		dest.ph.push( { 
			id: v,
			mark: mark,
			mp3: '',
		} );
	}

	for (var i in wd.parts) {
		var e = wd.parts[i];
		dest.explains.push( {
			part: e.part,
			chs: e.means.join('; '),
		} );
	}
}

dataSource.push({
	name: 'baidu',
	ajax: {
		json: {
			type: 'json',
			url: "http://openapi.baidu.com/public/2.0/translate/dict/simple",
			wordKey: 'q',
			args: {
				client_id: "qw9ndZZDm57Yn3mueHB3OvUz",
				from: "en",
				to: "zh",
			},
			handler: BaiduJSON2Object,
		}
	},
	site: {
		web: "http://dict.baidu.com/s?wd=#{word}",
		icon: 'http://dict.baidu.com/static/img/favicon.ico',
		title: {
			en: "Baidu",
			zh: "百度",
		},
	},
});
