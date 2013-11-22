(function($) {

	/** 
	 * Highlights the specified text if found in source.
	 */
	jQuery.fn.highlight = function(what) {
	    return this.each(function(){
	        var container = this,
	            content = container.innerHTML,
	            spanClass = 'highlight',
	            pattern = new RegExp('([^<.]*)(' + what + ')([^<.]*)','gi'),
	            replaceWith = '$1<span ' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$2</span>$3',
	            highlighted = content.replace(pattern,replaceWith);
	        container.innerHTML = highlighted;
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