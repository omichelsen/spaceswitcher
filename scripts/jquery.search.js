/** 
 * Extends the jQuery/Sizzle method "contains" to be case insensitive.
 */
jQuery.expr[":"].contains = jQuery.expr.createPseudo(function (arg) {
    return function(elem) {
        return $(elem).text().toLowerCase().indexOf(arg.toLowerCase()) > -1;
    };
});

/** 
 * Identifies elements which does not contain a given string.
 */
jQuery.fn.search = function(what) {
    return this.filter(":contains('" + what + "')").addClass('match').end();
};

/** 
 * Resets class identifier for all items.
 */
jQuery.fn.removeSearch = function() {
	return this.removeClass('match');
};