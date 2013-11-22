(function($) {

	/** 
	 * Highlights the specified text if found in source.
	 * @param {string} what - The text to highlight.
	 */
	jQuery.fn.highlight = function(what) {
		return this.each(function(){
			var content = $(this).text(),
				pattern = new RegExp('(' + what + ')','gi'),
				replaceWith = '<span class="highlight">$1</span>',
				highlighted = content.replace(pattern, replaceWith);
			$(this).html(highlighted);
		});
	};
	
	/** 
	 * Removes all highlighting from source.
	 */
	jQuery.fn.removeHighlight = function() {
		return this.find('span.highlight').replaceWith(function () {
			return $(this).text();
		}).end();
	};
	
})(jQuery);