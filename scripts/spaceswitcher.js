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
		navItemSelected = navItemSelected.prev();
	navItemSelected.addClass('selected');
}
function navDown() {
	clearSelected();
	if (!navItemSelected)
		navItemSelected = getFirst();
	else
		navItemSelected = navItemSelected.next();
	navItemSelected.addClass('selected');
}
$('body').keydown(function (event) {
	switch(event.which) {
		case 38: // up
			console.log('up'); 
			navUp();
			event.preventDefault();
			break;
		case 40: // down
			console.log('down'); 
			navDown();
			event.preventDefault();
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
			.find('.search-input').keyup(function () {
				var query = plugin.unquote($(this).val());
				console.log('keyup', query);
				plugin.getData(function () {
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
	 * Gets data from the specified URL.
	 */
	Plugin.prototype.getData = function (complete) {
		var plugin = this;
		$.getJSON('data/spaces.json', function (data) {
			plugin.renderResults(data);
			if (plugin.isFunction(complete))
				complete(data);
		});
	}

	Plugin.prototype.renderResults = function (data) {	
		var html = '';
		$.each(data, function (i, d) {
			html +=	'<div class="group">' +
					'<a class="header" href="https://podio.com">' + d.name + '</a>';
			$.each(d.spaces, function (j, s) {
				html += '<a class="item" href="' + s.url + '">' + s.name + '</a>';
			});
			html +=	'</div>';
		});
		$('.results').html(html);
	}



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
	 * Checks whether a given object is a function. Borrowed from Underscore.js.
	 */
	Plugin.prototype.isFunction = function (obj) {
		return !!(obj && obj.constructor && obj.call && obj.apply);
	};

	/**
	 * Cleans a string of quotes to prepare for JS concat
	 */
	Plugin.prototype.unquote = function (input) {
		return input.replace(/['"]/g, '');
	}

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
		});
	};

})(jQuery, window);