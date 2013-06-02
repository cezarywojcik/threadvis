function getComments(data, result) {
	for (var i = 0; i < data.length; i++) {
		var temp = data[i].data;
		if (typeof temp !== 'undefined') {
			var curr = Object();
			curr.text = temp.body_html;
			curr.author = temp.author;
			curr.ups = temp.ups;
			curr.downs = temp.downs;
			curr.children = Array();
			if (temp.replies != "" && typeof temp.replies !== 'undefined') {
				var children = temp.replies.data.children;
				getComments(children, curr.children);
			}
			if (typeof curr.text != 'undefined') {
				result.push(curr);
			}
		}
	}
}

function loadComments(url, selector, fn) {
	url = url.split('?')[0]; // prevent get vars
	$.ajax({
			dataType: "json",
		url: url + '.json?depth=50&jsonp=?',
		success: function (result) {
			var comments = new Array();
			var children = result[1].data.children;
			getComments(children, comments);
			// comments is now the object we can use to visualize things
			fn(selector, comments);
			// uncomment to parse html
			// $(selector).html($(selector).text());
		}
	});
}