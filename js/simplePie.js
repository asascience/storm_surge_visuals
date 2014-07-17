/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function updateSimplePieChart(newPie,data1,pointer_name,add_legend){

	var width = 200,
    height = 250,
    radius = Math.min(width, height) / 2;

    var colorRange = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
    var color = d3.scale.ordinal()
        .range(colorRange);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 80);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
        	if (d.val == 0){
        		return 0.001
        	} else{
        		return d.val;
        	}
    	});

    if (newPie){
		 var svg = d3.select(pointer_name).append("svg")
	      .attr("width", width+150)
	      .attr("height", height)
	      .append("g")
	      .attr("id", "pieChart")
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")	      

	      path = svg.selectAll("path")
	        .data(pie(data1))
	        .enter()
	        .append("path")
	        .on("mouseover", function(d) {	        							
	      								d3.select(this).attr("stroke", "#0066CC").attr("stroke-width", "2px")		
	      								var tooltip = d3.select("#tooltip")
	      								tooltip.text(d.data.type+"\nCost: $"+d.value)
										tooltip.style("visibility", "visible");      							
	      								})
	      	.on("mouseout", function(d) {
	      								d3.select(this).attr("stroke-width", "0px")		
	      								var tooltip = d3.select("#tooltip")
	      								tooltip.style("visibility", "hidden");
	      								})

	     	.on("mousemove", function(){
	     								var tooltip = d3.select("#tooltip")
										return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
										}); 	     

	        path.transition()
	        .duration(500)
	        .attr("fill", function(d, i) { return color(d.data.type); })
	  		.attr("id","pie_slice")
	        .attr("d", arc)
	        .each(function(d) { this._current = d; }); // store the initial angles

	     if (add_legend){	    
	     var legend = d3.select("#piechartLegend").append("svg")
	     	.attr("width", 200)
	      	.attr("height", height)	    
		    	for(var i=0; i<data1.length; i++) {
		    	  g = legend.append("g")	
				  g.append("rect")
				      .attr("width", 18)
				      .attr("height", 18)
				      .attr("y", 10)
				      .style("fill", colorRange[i])
				      .attr('transform', 'translate(0,'+ (10+(i+1)*20) + ')');

				  g.append("text")
				      .attr("x", 24)
				      .attr("y",10)
				      .attr('transform', 'translate(0,'+ (10+((i+1)*20)+15) + ')')				    
				      .text(data1[i].type);				   
		    	};
			}
    


	    if (pointer_name == "#piechartTotalDiv"){
	    	titleName = "Full Replacement Cost (worst case Category 4 + 4ft SLR)"}	    
	    else{
	    	titleName = "Count with Substantial Damage"}

	    svg.append("text").text(titleName)
	    	.attr("id","simpleChartTitle")
	    	.attr('transform', 'translate(-100,-100)')
	    	.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("width", "400")
    }else{
    	change(data1)
    }

    


    function change(data){
    	 var svg = d3.select(pointer_name)
    	 path = svg.selectAll("path")
	     path.data(pie(data));
	     path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    }

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    } 
}