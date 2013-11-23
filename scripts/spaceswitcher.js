;(function ($, window, undefined) {
	"use strict";

	var pluginName = 'spaceswitcher';

	var defaults = {
		data: []
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
		
		plugin.$widget = $(plugin.element).append(plugin.template(plugin.options.data)).find('.spaceswitcher');

		$(plugin.element).hover(
			function () {
				plugin.$widget.show().find('input').focus();
			},
			function () {
				plugin.$widget.hide().find('input').blur();
			}
		);
		
		plugin.setSelected(plugin.$widget.find('.header:first'));

		plugin.$widget.find('.search-input').keyup(function (event) {
			var query = plugin.unquote($(this).val());
			$('.group', plugin.$widget)
				.children()
					.show().removeSearch().search(query).end()
					.filter('.item')
						.not('.match').hide().end()
						.removeHighlight().highlight(query)
					.end()
				.end()
				.show().not(function () { return $(this).children().hasClass('match'); }).hide();

			if ([38,40].indexOf(event.which) < 0) {
				plugin.setSelected($('.match, .header', plugin.$widget).first());
				event.preventDefault();
			}
		});

		$('body').keydown(function (event) {
			switch(event.which) {
				case 13: // enter
					window.location = plugin.getSelected().attr('href');
					event.preventDefault();
					break;
				case 38: // up
					plugin.navigate('↑');
					event.preventDefault();
					break;
				case 40: // down
					plugin.navigate('↓');
					event.preventDefault();
					break;
			}
		});
	};
		
	/** 
	 * Destroys the plugin and removes all event handlers and DOM elements.
	 */
	Plugin.prototype.destroy = function () {
		$(this.element)
			.off('.' + this._name) // Remove plugin event handlers
			.remove('.spaceswitcher'); // Remove the widget from the DOM
		$.removeData(this.element, 'plugin_' + this._name);
	};
	
	/** 
	 * Gets the currently selected DOM element.
	 * @return {jQuery object} Element which currently is selected.
	 */
	Plugin.prototype.getSelected = function () {
		return $('.spaceswitcher .selected');
	};
	
	/** 
	 * Sets the currently selected DOM element and removes any other selections.
	 */
	Plugin.prototype.setSelected = function ($elem) {
		$('.spaceswitcher .selected', this.element).removeClass('selected');
		$elem.addClass('selected');
	};

	/** 
	 * Sets the next or previous element as selected.
	 * @param {jQuery object} $elem - Starting point for navigation.
	 * @param {string} dir - Special char indicating the direction to navigate; next or prev.
	 */
	Plugin.prototype.navigate = function (dir) {
		var step = (dir === '↓' ? 0 : -1),
			$elem = this.getSelected(),
			index = $elem.index() + step,
			$goto = $elem.siblings(':visible').eq(index);
		if (index >= 0 && $goto.length) {
			this.setSelected($goto);
		} else {
			$goto = $elem.parent().siblings(':visible').eq($elem.parent().index() + step).children(':visible').eq(step);
			if ($goto.length) {
				this.setSelected($goto);
			}
		}
	};
	
	/** 
	 * Creates the main HTML template for the widget.
	 */
	Plugin.prototype.template = function (data) {
		var html =
			'<div class="spaceswitcher">' +
				'<div class="search"><input type="search" class="search-input" /></div>' +
				'<div class="results">' +
				this.templateResults(data) +
				'</div>' +
			'</div>';
		return html;
	};

	/** 
	 * Creates the HTML for the data.
	 * @returns {string} String containing the HTML list of the data.
	 */
	Plugin.prototype.templateResults = function (data) {
		var html = '';
		$.each(data, function () {
			html +=	'<div class="group">' +
					'<a class="header" href="https://podio.com">' + this.name + '</a>';
			$.each(this.spaces, function () {
				html += '<a class="item" href="' + this.url + '">' + this.name + '</a>';
			});
			html +=	'</div>';
		});
		return html;
	};

	/**
	 * Cleans a string of quotes to prepare for JS concat.
	 */
	Plugin.prototype.unquote = function (input) {
		return input.replace(/['"]/g, '');
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
		});
	};

})(jQuery, window);