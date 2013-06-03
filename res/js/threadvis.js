var ymin = 0;
var xmin = 0;
var ymax = 0;
var xmax = 0;

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

	var r = Math.abs((ups-downs))/10;

	content
		.append("circle")
		.attr("cx", x+xoffset)
		.attr("cy", y+yoffset)
		.attr("r", r)
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
			$('#tooltip').append("<strong>Karma:  </strong>" + (node.ups-node.downs) + "<br>");
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

	if (xmax < x+xoffset) {
		xmax = x+xoffset+r;
	}
	if (ymax < -1*(y+yoffset)) {
		ymax = -1*(y+yoffset)+r;
	}
	if (ymin > -1*(y+yoffset)) {
		ymin = -1*(y+yoffset)-r;
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

	for(var i = 0; i < comments.length; i++) {
		drawNode(comments[i], content2, 0, 0);
	}

	var yscale = height/(ymax-ymin);
	var xscale = width/(xmax-xmin);
	var scale = Math.min(yscale, xscale);

	content.attr("transform", "translate(0, " + (height+scale*ymin) + ") scale(" + scale + ") ");

	var zoom = d3.behavior.zoom()
		.scale([scale])
		.translate([0, height+scale*ymin])
		.on("zoom", rescale);

	svg.call(zoom);

	svg.on("mousedown", function() {
		d3.event.stopPropagation();
		$('#tooltip').remove();
	})

	function rescale() {
		$('#tooltip').remove();
		content.attr("transform", "translate(" + zoom.translate() + ")" 
			+ " scale(" + zoom.scale() + ")");
	}
}
