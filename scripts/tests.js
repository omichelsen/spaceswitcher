(function($, QUnit) {
	QUnit.config.autostart = false;
	
	var data = [];
	$.getJSON('data/spaces.json', function (json) {
		data = json;
		QUnit.start();
	});
	
	var $fixture = $('#qunit-fixture');
		
	module('jquery.highlight.js');
	test('chainable', function () {
		$fixture.append('<p>Chain me!</p>');
		ok($('p', $fixture).highlight('me').addClass('testing'), 'can be chained');
		equal($('p', $fixture).hasClass('testing'), true, 'class was added correctly in chaining');
	});
	test('simple', function () {
		$fixture.append('<div id="target">I have some simple text in me</div>');
		var $target = $('#target').highlight('simple text');
		equal($target.has('.highlight').length, 1, 'highlighting was added');
		equal($target.find('.highlight').text(), 'simple text', 'wanted text was highlighted');
	});
	test('mixed caps', function () {
		$fixture.append('<div id="target">I Am CoNfuSinglY WritTen.</div>');
		var $target = $('#target').highlight('confusingly');
		equal($target.has('.highlight').length, 1, 'highlighting was added');
		equal($target.find('.highlight').text(), 'CoNfuSinglY', 'higlighted text was not altered');
	});
	test('multiple elements', function () {
		expect(3);
		$fixture.append('<p>I am element one</p><p>I am element two</p>');
		var $targets = $('p', $fixture).highlight('element').end();
		equal($('.highlight', $targets).length, 2, 'highlighting was added');
		$targets.find('.highlight').each(function () {
			equal($(this).text(), 'element', 'wanted text was higlighted');
		});
	});
	
	module('jquery.search.js');
	test('chainable', function () {
		$fixture.append('<p>Chain me!</p>');
		ok($('p', $fixture).search('me').addClass('testing'), 'can be chained');
		equal($('p', $fixture).hasClass('testing'), true, 'class was added correctly in chaining');
	});
	test('find one match in two elements', function () {
		$fixture.append('<div>I have some simple text in me</div><div>No match in here</div>');
		var $targets = $('div', $fixture).search('simple text');
		equal($targets.length, 1, 'search returns single match');
		equal($fixture.find('.match').length, 1, 'search marked single match');
	});
	
	module('spaceswitcher.js', {
		setup: function () {
			$fixture.spaceswitcher(data);
		},
		teardown: function () {
			$fixture.data('plugin_spaceswitcher').destroy();
		}
	});
	test('plugin object', function () {
		var plugin = $fixture.data('plugin_spaceswitcher');
		ok(plugin, 'plugin object attached');
		strictEqual(plugin._name, 'spaceswitcher', 'the IS the plugin we are looking for');
	});
	test('DOM elements', function () {
		equal($('.spaceswitcher', $fixture).length, 1, 'widget has been added to the DOM');
	});
	test('unquote', function () {
		var plugin = $fixture.data('plugin_spaceswitcher');
		equal(plugin.unquote("Rock'n'roll!"), 'Rocknroll!', 'single quotes removed from string');
		equal(plugin.unquote('Charlie "Yardbird" Parker'), 'Charlie Yardbird Parker', 'double quotes removed from string');
	});

})(jQuery, window.QUnit);