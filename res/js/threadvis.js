function drawNode(node, content, x, y) {
	var ups = node.ups;
	var downs = node.downs;

	var total = ups + downs;
	var theta = 0;
	if (total != 0) {
		theta = (90*(ups+-1*downs)/total)*Math.PI/180;
	}
	var xoffset = Math.round(total*Math.cos(theta));
	var yoffset = -1*Math.round(total*Math.sin(theta));


	var color = "#FF9999";

	if (ups < downs) {
		color = "#CCCCFF";
	}

	content
		.append("circle")
		.attr("cx", x+xoffset)
		.attr("cy", y+yoffset)
		.attr("r", Math.abs((ups-downs))/10)
		.attr("fill", color)
		.attr("opacity", "0.5")
		.attr("class", "node")
		.on("click", function() {
			$('#tooltip').remove();
			var div = d3.select("body").append("div")
				.attr("id", "tooltip");
			div.transition()
				.duration(200)
				.style("opacity", 0.9);
			$('#tooltip').html(node.text);
			$('#tooltip').html($('#tooltip').text());
			$('#tooltip').append("<p>");
			$('#tooltip').append("<strong>Author:  </strong>" + node.author + "<br>");
			$('#tooltip').append("<strong>Upvotes:  </strong>" + node.ups + "<br>");
			$('#tooltip').append("<strong>Downvotes:  </strong>" + node.downs + "<br>");
			$('#tooltip').append("</p>");

			div.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		});

	content
		.append("line")
		.attr("x1", x)
		.attr("y1", y)
		.attr("x2", x+xoffset)
		.attr("y2", y+yoffset)
		.attr("stroke-width", 2)
		.attr("stroke", "#e6e6e6")
		.attr("opacity", 0.5)
		.attr("vector-effect", "non-scaling-stroke");

	var plot = content.select("rect");
	if (plot.attr("width") < x+xoffset) {
		plot.attr("width", x+xoffset);
	}
	if (plot.attr("height") < -1*(y+yoffset)) {
		plot.attr("height", -1*(y+yoffset));
		plot.attr("y", (y+yoffset));
	}

	for(var i = 0; i < node.children.length; i++) {
		drawNode(node.children[i], content, x+xoffset, y+yoffset);
	}
}

function threadvis(selector, comments) {
	$(selector).html("");

	var width = $(selector).width();
	var height = $(selector).height();

	var svg = d3.select(selector)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var content = svg.append("g");

	var content2 = content.append("g");

	content2.append("rect")
		.attr("x", 0)
		.attr("y", -1*height)
		.attr("width", 0)
		.attr("height", 0)
		.attr("id", "back");

	for(var i = 0; i < comments.length; i++) {
		drawNode(comments[i], content2, 0, 0);
	}

	// make background rect bigger
	// background rect is necessary so that mouse events register for zoom
	var xmax = content2.select("rect").attr("width");
	var ymax = content2.select("rect").attr("height");
	var yscale = height/ymax;
	var xscale = width/xmax;
	var scale = Math.min(yscale, xscale);

	content.attr("transform", "translate(0, " + height + ") scale(" + scale + ") ");

	content2.select("rect")
		.attr("x", -1*xmax)
		.attr("y", -2*ymax)
		.attr("width", 3*xmax)
		.attr("height", 3*ymax)
		.on("click", function() {
			$('#tooltip').remove();
		});

	var zoom = d3.behavior.zoom()
		.scale([scale])
		.translate([0, height])
		.on("zoom", rescale);

	svg.call(zoom);

	function rescale() {
		$('#tooltip').remove();
		content.attr("transform", "translate(" + zoom.translate() + ")" 
			+ " scale(" + zoom.scale() + ")");
	}
}
