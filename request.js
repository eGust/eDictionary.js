var ajaxFormats = {	// location.href.startsWith:
		'resource://': [ 'xml', 'json' ],
		'chrome-extension://': [ 'xml', 'json', ],
	}, 
	cbHandler = null,
	wordObj = {
		requesting: '',
		requestingWord: '',
	},
	dataSource = [],
	dataSourceList = null;

function fnCallback(data) {
	console.log(data);
	var wo = {
			error: null,
			spell: null,
			requesting: false,
			ph: [/*
				{
					id: 'en',
					mark: '',
					mp3: '',
				},
			*/],
			explains: [/*
				{
					part: '',
					chs: '',
				},
			*/],
			sentences: [/*
				{
					orig: '',
					trans: '',
				}
			*/],
		};
	cbHandler(data, wo);

	for (var k in wo) {
		wordObj[k] = wo[k];
	}

	saveSettings({ wordObject: wo });
	updateWordDisplay();
	$('#word').select().focus();
}

// http://fanyi.youdao.com/openapi.do?keyfrom=eDictionary&key=1337053915&type=data&doctype=json&version=1.1&q=test
// http://openapi.baidu.com/public/2.0/translate/dict/simple?client_id=qw9ndZZDm57Yn3mueHB3OvUz&from=en&to=zh&q=test

function requestWord(word, source) {
	var settings = {
			url: source.url,
			data: {},
			dataType: source.type,
			error: function() {
				wordObj.error = '[fail] AJAX time-out';
			},
		};

	if (source.type === 'jsonp') {
		settings.jsonpCallback = 'fnCallback';
	} else {
		settings.success = fnCallback;
	}

	for (var k in source.args) {
		settings.data[k] = source.args[k];
	}
	settings.data[source.wordKey] = word;

	cbHandler = source.handler;
	wordObj.requesting = true;
	wordObj.requestingWord = word;
	$.ajax(settings);
}

function getDataSourceList() {
	if (dataSourceList)
		return dataSourceList;

	var curUrl = location.href, sourceList = [], formats = [ 'jsonp' ];
	for (var k in ajaxFormats) {
		if (curUrl.substr(0, k.length) === k) {
			formats = ajaxFormats[k];
			break;
		}
	}

	/*
	for (var i = 0; i < formats.length; i++) {
		var fmt = formats[i];
		for (var j = 0; j < dataSource.length; j++) {
			var src = dataSource[j], ajax = src.ajax[fmt];
			if (ajax) {
				ajax.site = src.site;
				ajax.name = src.name;
				sourceList.push(ajax);
			}
		}
	}
	*/

	for (var i = 0; i < dataSource.length; i++) {
		var src = dataSource[i];
		for (var j = 0; j < formats.length; j++) {
			var ajax = src.ajax[formats[j]];
			if (ajax) {
				ajax.site = src.site;
				ajax.name = src.name;
				sourceList.push(ajax);
				break;
			}
		}
	}
	return dataSourceList = sourceList;
}
