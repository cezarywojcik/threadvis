jQuery(function($) {
	$('#urlsubmit').click(function(e) {
		var url = $('#url').val();
		threadvis(url, '#vis');
		return false;
	});
});