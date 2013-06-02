function drawNode(node, nodes, lines, x, y) {
	var ups = node.ups;
	var downs = node.downs;

	var total = ups + downs;
	var theta = (90*(ups+-1*downs)/total)*Math.PI/180;
	var xoffset = Math.round(total*Math.cos(theta));
	var yoffset = -1*Math.round(total*Math.sin(theta));

	var color = "#FF9999";

	if (ups < downs) {
		color = "#CCCCFF";
	}

	nodes
		.append("circle")
		.attr("cx", x+xoffset)
		.attr("cy", y+yoffset)
		.attr("r", 3)
		.attr("fill", color)
		.attr("opacity", "0.25");
	lines
		.append("line")
		.attr("x1", x)
		.attr("y1", y)
		.attr("x2", x+xoffset)
		.attr("y2", y+yoffset)
		.attr("stroke-width", 1)
		.attr("stroke", "#e6e6e6");

	for(var i = 0; i < node.children.length; i++) {
		drawNode(node.children[i], nodes, lines, x+xoffset, y+yoffset);
	}
}

function threadvis(selector, comments) {
	$(selector).html("");

	var width = 800;
	var height = 600;

	var svg = d3.select(selector)
		.append("svg")
	svg.attr("width", width);
	svg.attr("height", height);

	var content = svg.append("g")
		.attr("transform", "translate(10," + (height/2) + ")");;

	var lines = content.append("g").attr("class", "lines");
	var nodes = content.append("g").attr("class", "nodes");

	for(var i = 0; i < comments.length; i++) {
		drawNode(comments[i], nodes, lines, 0, 0);
	}
}