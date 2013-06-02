jQuery(function($) {
	$('#urlsubmit').click(function(e) {
		var url = $('#url').val();
		loadComments(url, '#vis', threadvis);
		return false;
	});
});