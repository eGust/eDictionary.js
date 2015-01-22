var player = null, eventsSetuped = false, ajApp = angular.module('eDictionary', []), ajScope = null;

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

function setupEvents() {
	if (eventsSetuped)
		return;

	eventsSetuped = true;
	var openning = null;
	$(document)
		.on('click.dropdown.close.menu', function (e) {
				var current = openning;
				openning = null;

				$('.menu-button-group.open').removeClass('open');
				if (current) {
					current.addClass('open');
				}
			})
		.on('click.dropdown.open.menu', '.menu-toggle', function (e) {
				openning = $(this).parent();
			});
}

/*	[settings]
	wordObj	wordObj
	spell	inputting
	select	baidu|youdao|iciba
*/

function ajscope() {
	if (ajScope == null) {
		ajScope = angular.element($('#main')).scope();
	}
	return ajScope;
}

function reloadSettings() {
	try {
		var opt = loadSettings();
		if ( opt == null || !opt.word )
			return;

		var $scope = ajscope();
		$scope.inputting = opt.word;

		var seleted = opt.select, list = $scope.dataSourceList;
		if (seleted) {
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				if (item.name == seleted) {
					$scope.seletedList = item;
					break;
				}
			}
		}

		if (opt.wordObject && opt.wordObject.spell == opt.word) {
			var wo = wordObj, src = opt.wordObject;
			for (var k in src) {
				wo[k] = src[k];
			}
			updateWordDisplay();
		} else {
			updateWordDisplay();
			$scope.submitRequest();
		}
	} catch (e) {}
	finally {}
}

ajApp.controller(
	'MainCtrl',
	function($scope) {
		var sites = [];
		for (var i = 0; i < dataSource.length; i++) {
			var site = dataSource[i];
			site.site.name = site.name;
			sites.push(site.site);
		}
		$scope.sites = sites;
		$scope.dataSourceList = getDataSourceList();
		$scope.displaySent = false;

		$scope.selectList = function(item) {
			if (item == $scope.seletedList)
				return;
			$scope.seletedList = item;
			saveSettings({ select: item.name });
		}

		$scope.selectSite = function(item) {
			if (item == $scope.seletedSite)
				return;
			$scope.seletedSite = item;
		}

		$scope.submitRequest = function() {
			var word = $scope.inputting;
			if (!isEnglishWord(word)) {
				return;
			}

			requestWord(word, $scope.seletedList);
			saveSettings({ word: word });
		};

		$scope.playSound = function(url) {
			if (player == null) {
				player = $('audio')[0];
			}
			player.src = url;
			player.play();
		}

		$scope.seletedList = $scope.dataSourceList[0];
		$scope.seletedSite = $scope.sites[0];
		$scope.inputting = '';
		$scope.word = wordObj;
	}
);

function updateWordDisplay() {
	ajscope().$apply();
}

function initUI() {
	//$('.pron').click(playSound);
	reloadSettings();
	$('#word').select().focus();
}

$(function () {
	setupEvents();
	initUI();
});
