/**
 * Checks whether a given object is a function. Borrowed from Underscore.js.
 */
var isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

/**
 * Cleans a string of quotes to prepare for JS concat
 */
function unquote(input) {
	return input.replace(/['"]/, '');
}


function getData(complete) {
	$.getJSON('data/spaces.json', function (data) {
		renderResults(data);
		if (isFunction(complete))
			complete(data);
	});
}

function renderResults(data) {	
	var html = '';
	$.each(data, function (i, d) {
		html +=	'<div class="group">' +
				'<div class="header">' + d.name + '</div>';
		$.each(d.spaces, function (j, s) {
			html += '<div class="item">' + s.name + '</div>';
		});
		html +=	'</div>';
	});
	$('.results').html(html);
}



$('.search-input').keyup(function () {
	var query = unquote($(this).val());
	console.log('keyup', query);
	getData(function () {
		$('.spaceswitcher .group')
			.children()
				.removeSearch().search(query)
				.filter('.item')
					.not('.match').hide().end()
					.removeHighlight().highlight(query)
				.end()
			.end()
			.show().not(function () {
				return $(this).children().hasClass('match');
			}).hide();
	});
});



/* ------------------ */
var navItemSelected = null;
function clearSelected() {
	$('.spaceswitcher .results div.selected').removeClass('selected');
}
function getFirst() {
	return $('.spaceswitcher .group div').first();
}
function navUp() {
	clearSelected();
	if (!navItemSelected)
		navItemSelected = getFirst();
	else
		navItemSelected.prev().addClass('selected');
}
function navDown() {
	clearSelected();
	if (!navItemSelected)
		navItemSelected = getFirst();
	else
		navItemSelected.next().addClass('selected');
}
$('body').keydown(function (event) {
	switch(event.which) {
		case 38: // up
			console.log('up'); 
			navUp();
			break;
		case 40: // down
			console.log('down'); 
			navDown();
			break;
	}
})
/* ------------------ */

;(function ($, window, undefined) {
	"use strict";

	var pluginName = 'spaceswitcher';

	var defaults = {
		data: [],
		dataUrl: 'data/spaces.json'
	};

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend( {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	/** 
	 * Initializes the plugin and adds event handlers and DOM elements.
	 */
	Plugin.prototype.init = function () {
		var plugin = this;
		$(this.element)
			.on('submit.' + plugin._name, function () {
				var input = plugin.getInput();
				var valid = plugin.validate(input);
				if (valid) {
					plugin.options.success(plugin, input);
				} else {
					plugin.options.fail(plugin, input);
				}
				return false;
			})
			.find('.puzzle')
				.html(plugin.createTable(plugin.options.patternsX, plugin.options.patternsY))
				.find('input[type=text]')
					.on('keyup.'+plugin._name+' change.'+plugin._name, function () {
						$(this).toggleClass('space', $(this).val() === ' ');
					})
					.on('focus.'+plugin._name, function () {
						$(this).addClass('focus');
					})
					.on('blur.'+plugin._name, function () {
						$(this).removeClass('focus');
					})
				.end()
				.formNavigation();
	};

	/** 
	 * Destroys the plugin and removes all event handlers and DOM elements.
	 */
	Plugin.prototype.destroy = function () {
		$(this.element)
			.off('.' + this._name) // Remove plugin event handlers
			.find('.puzzle').empty(); // Remove the puzzle table
		$.removeData(this.element, 'plugin_' + this._name);
	};

	/** 
	 * Creates the HTML table for the puzzle.
	 *
	 * @returns {jQuery} The puzzle table instantiated as a jQuery DOM set.
	 */
	Plugin.prototype.createWidget = function () {
		var plugin = this;
		var table = $('<table><thead><tr><th/></tr></thead><tbody/><tfoot><tr><th/></tr></tfoot></table>');
		$.each(patternsX, function () {
			$('thead tr', table).append('<th><div><span>'+plugin.escapeHTML(this[0])+'</span></div></th>');
			if (this.length > 1) {
				$('tfoot tr', table).append('<th><div><span>'+plugin.escapeHTML(this[1])+'</span></div></th>');
			}
		});
		$.each(patternsY, function (i) {
			var row = $('<tr><th><span>'+plugin.escapeHTML(this[0])+'</span></th></tr>');
			for (var j = 0; j < patternsX.length; j++) {
				row.append('<td><input type="text" name="' +
					String.fromCharCode(65 + j) + (i + 1) +
					'" autocomplete="off" maxlength="1" required/></td>');
			}
			if (this.length > 1) {
				row.append('<th><span>'+plugin.escapeHTML(this[1])+'</span></th>');
			}
			$('tbody', table).append(row);
		});
		return table;
	};

	/** 
	 * Gets the input values from the puzzle.
	 *
	 * @returns {string[]} The input values from each row in the puzzle.
	 */
	Plugin.prototype.getInput = function () {
		var answer = [];
		$('tbody tr', this.element).each(function (i, tr) {
			answer[i] = '';
			$('td input', tr).each(function (j, input) {
				answer[i] += (input.value || ' ').toUpperCase();
			});
		});
		return answer;
	};
	
	/** 
	 * Sets the input values to a predefined answer.
	 *
	 * @param {string[]} answer The values to fill into the input fields.
	 */
	Plugin.prototype.setInput = function (answer) {
		$('tbody tr', this.element).each(function (i, tr) {
			$('input', tr).each(function (j, input) {
				if (answer[i] && answer[i][j] !== ' ') {
					$(input).val(answer[i][j]).change();
				}
			});
		});
	};

	/** 
	 * Validates the input values of the puzzle against the regex patterns.
	 *
	 * @param {string[]} answer The input values from each row in the puzzle.
	 */
	Plugin.prototype.validate = function (answer) {
	};

	/**
	 * Validates a string against multiple patterns.
	 *
	 * @param {string[]} patterns The patterns to validate the input against.
	 * @param {string} input An input string to validate.
	 */
	Plugin.prototype.validateAgainstMultiple = function (patterns, input) {
	};
	
	/** 
	 * Escapes all HTML characters from a string.
	 *
	 * @returns {function(string)} A function which returns a string with escaped HTML characters.
	 */
	Plugin.prototype.escapeHTML = (function () {
		'use strict';
		var chr = {
			'"': '&quot;', '&': '&amp;', "'": '&#39;',
			'/': '&#47;',  '<': '&lt;',  '>': '&gt;'
		};
		return function (text) {
			return text.replace(/[\"&'\/<>]/g, function (a) { return chr[a]; });
		};
	}());

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
		});
	};

})(jQuery, window);