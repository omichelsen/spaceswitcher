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

			switch(event.which) {
				case 13: // enter
					window.location = plugin.getSelected().attr('href');
					event.preventDefault();
					break;
				case 38: // up
					plugin.selectPrev('↑');
					event.preventDefault();
					break;
				case 40: // down
					plugin.selectNext('↓');
					event.preventDefault();
					break;
				default:
					plugin.setSelected($('.header:first', plugin.$widget));
					plugin.setSelected($('.match:first', plugin.$widget));
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
		return $('.selected', this.$widget);
	};
	
	/** 
	 * Sets the currently selected DOM element and removes any other selections.
	 */
	Plugin.prototype.setSelected = function ($elem) {
		if (!$elem.length) return;
		this.getSelected().removeClass('selected');
		$elem.addClass('selected');
	};

	/** 
	 * Selects the next element starting from current selection.
	 */
	Plugin.prototype.selectNext = function () {
		var $elem = this.getSelected(),
			$goto = $elem.nextAll(':visible:first');
		if (!$goto.length) {
			$goto = $elem.parent().nextAll(':visible:first').children(':visible:first');
		}
		if ($goto.length) {
			this.setSelected($goto);
		}
	}
	
	/** 
	 * Selects the previous element starting from current selection.
	 */
	Plugin.prototype.selectPrev = function () {
		var $elem = this.getSelected(),
			$goto = $elem.prevAll(':visible:first');
		if (!$goto.length) {
			$goto = $elem.parent().prevAll(':visible:first').children(':visible:last');
		}
		if ($goto.length) {
			this.setSelected($goto);
		}
	}
	
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