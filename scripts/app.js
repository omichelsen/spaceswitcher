$(document).ready(function () {
	$.getJSON('data/spaces.json', function (data) {
		$('#gotospace').spaceswitcher({
			"data": data
		});
	});
});