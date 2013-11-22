(function($) {

	var $fixture = $('#qunit-fixture');
		
	module('jquery.highlight.js');
	test(' chainable', function () {
		$fixture.append('<p>Chain me!</p>');
		ok($('p', $fixture).highlight('me').addClass('testing'), 'can be chained');
		equal($('p', $fixture).hasClass('testing'), true, 'class was added correctly in chaining');
	});
	test('highlight simple', function () {
		$fixture.append('<div id="target">I have some simple text in me</div>');
		var $target = $('#target').highlight('simple text');
		equal($target.has('.highlight').length, 1, 'highlighting was added');
		equal($target.find('.highlight').text(), 'simple text', 'wanted text was highlighted');
	});
	test('highlight mixed caps', function () {
		$fixture.append('<div id="target">I Am CoNfuSinglY WritTen.</div>');
		var $target = $('#target').highlight('confusingly');
		equal($target.has('.highlight').length, 1, 'highlighting was added');
		equal($target.find('.highlight').text(), 'CoNfuSinglY', 'higlighted text was not altered');
	});
	test('highlight in multiple elements', function () {
		expect(3);
		$fixture.append('<p>I am element one</p><p>I am element two</p>');
		var $targets = $('p', $fixture).highlight('element').end();
		equal($('.highlight', $targets).length, 2, 'highlighting was added');
		$targets.find('.highlight').each(function () {
			equal($(this).text(), 'element', 'wanted text was higlighted');
		});
	});
	
	module('jquery.search.js');
	test(' chainable', function () {
		$fixture.append('<p>Chain me!</p>');
		ok($('p', $fixture).search('me').addClass('testing'), 'can be chained');
		equal($('p', $fixture).hasClass('testing'), true, 'class was added correctly in chaining');
	});
	test('highlight one match in two', function () {
		$fixture.append('<div>I have some simple text in me</div><div>No match in here</div>');
		var $targets = $('div', $fixture).search('simple text');
		equal($targets.filter('.match').length, 1, 'search found a match');
	});

})(jQuery);