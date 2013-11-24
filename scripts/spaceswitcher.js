;(function ($, window, undefined) {
	"use strict";

	var pluginName = 'spaceswitcher';

	var defaults = {
		data: []
	};
	
	var keys = { enter: 13, left: 37, up: 38, right: 39, down: 40 };

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
		plugin.$widget = $(plugin.element).append(plugin.template(plugin.options.data)).find('.' + plugin._name);

		$(plugin.element)
			.on('mouseenter.' + plugin._name, function () {
				plugin.$widget.show().find('input').focus();
				plugin.resize();
			})
			.on('mouseleave.' + plugin._name, function () {
				plugin.$widget.hide().find('input').blur();
			});
		
		plugin.setSelected(plugin.$widget.find('.header:first'));

		plugin.$widget.find('.search-input')
			.on('keydown', function (event) {
				if ([keys.enter, keys.up, keys.down].indexOf(event.which) < 0) { return; }
				event.preventDefault();
				switch(event.which) {
					case keys.enter:
						window.location = plugin.getSelected().attr('href'); break;
					case keys.up:
						plugin.selectPrev(); break;
					case keys.down:
						plugin.selectNext(); break;
				}
			})
			.on('keyup search', function (event) {
				if ([keys.enter, keys.up, keys.down].indexOf(event.which) >= 0) { return; }
				plugin.filter(plugin.unquote($(this).val()));
				plugin.setSelected($('.header:first', plugin.$widget));
				plugin.setSelected($('.match:first', plugin.$widget));
			});
		
		$(window).on('resize.' + plugin._name, function () {
			plugin.resize();
		});
	};

	/** 
	 * Destroys the plugin and removes all event handlers and DOM elements.
	 */
	Plugin.prototype.destroy = function () {
		$(this.element)
			.off('.' + this._name) // Remove plugin event handlers
			.remove('.' + this._name); // Remove widget from the DOM
		$(window).off('.' + this._name);
		$.removeData(this.element, 'plugin_' + this._name);
	};
	
	Plugin.prototype.filter = function (query) {
		$('.group', this.$widget)
			.children()
				.removeSearch().show().search(query).end()
				.removeHighlight().highlight(query)
				.filter('.item')
					.not('.match').hide().end()
				.end()
			.end()
			.show().not(function () { return $(this).children().hasClass('match'); }).hide();
	};

	/** 
	 * Scrolls the results to specified element if not visible.
	 * @param {jQuery object} $elem Element to scroll to.
	 */
	Plugin.prototype.scrollTo = function ($elem) {
		var $container = this.$widget.find('.results'),
			cHeight = $container.height(),
			eOffset = $elem.position().top;
		if (eOffset < 0 || eOffset + $elem.height() > cHeight) {
			$container.scrollTop(eOffset);
		}
	};
	
	/** 
	 * Gets the currently selected DOM element.
	 * @return {jQuery object} Currently selected element.
	 */
	Plugin.prototype.getSelected = function () {
		return this.$widget.find('.selected');
	};
	
	/** 
	 * Sets specified DOM element as selected and removes any other selections.
	 * @param {jQuery object} $elem Element to set as selected.
	 * @return {jQuery object} Same element passed as input.
	 */
	Plugin.prototype.setSelected = function ($elem) {
		if (!$elem.length) { return; }
		this.getSelected().removeClass('selected');
		this.scrollTo($elem);
		return $elem.addClass('selected');
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
	};
	
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
	};
	
	/** 
	 * Resizes the widget to fit viewport.
	 */
	Plugin.prototype.resize = function () {
		var cHeight = this.$widget.height(),
			sHeight = this.$widget.find('.search').height(),
			$results = this.$widget.find('.results');
		$results.height('auto');
		if (cHeight - sHeight < $results.height()) {
			$results.height(cHeight - sHeight);
		}
	};
	
	/** 
	 * Creates the main HTML template for the widget.
	 */
	Plugin.prototype.template = function (data) {
		var html =
			'<div class="' + this._name + '">' +
				'<div class="search"><div class="inner"><input type="search" class="search-input" /></div></div>' +
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