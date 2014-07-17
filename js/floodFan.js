/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function updateFan(chart_id,new_data,color){
	//Draw the chart
	d3.select(chart_id).selectAll('path')
				.data(new_data)
				.text( function (new_data) { return new_data; } )
				.attr('fill', color)
}


function floodFan(json_data,attrib_number,data_category,color,minValue,maxValue){
	fanHeight = 200
	var parent_object = d3.select("#floodFan"+attrib_number)
                      .append("svg")
                      .attr("width", 400)
                      .attr("height", fanHeight)
                      ;

    //radius of maximum winds
	radius_wind_labels = ['20', '30', '40', '45', '50', '55'];
	week = 0;
	totals = {days:[], week:0};
	display_mode = 0, display_modes = [{label: 'units', prefix: ''}, {label: '', prefix: 'Â£'}, {label: 'kgs CO2', prefix: ''}];

	
	//6 radius
	//7 angles
	var number_r = 6 //number of radius (radius of floods)
	var number_a = 7 //number of angles
	//wind angle labels
	angle_labels = ['135', '146.25', '157.5', '168.5', '180', '191.25','202.5'];
	var total_num_cells = number_r*number_a

	var //can be varied
	initial_rad = 60;
	var rad_offset = 20;
	//inital_y_location

	var inital_y = '-10'
	var inital_x = '100'

	var sep_angle = 11.25
	var init_angle = 135
	var start_angle = init_angle - (sep_angle/2)
	var end_angle = 203
	var total_angle = end_angle - start_angle
	var sep_number = 12

	ir = function(d, i) {
						return initial_rad+Math.floor(i/number_a)*rad_offset;
					 	}

	or = function(d, i) {
						return initial_rad+rad_offset+Math.floor(i/number_a)*rad_offset;
						}

	//calculate start angle
	sa = function(d, i) {
							if (i < number_a)
							{
								sep = ((i)*sep_angle)
								angle = start_angle+sep
								return angle * (Math.PI/180);
							}
							else
							{
								//current multiple
								num = (Math.floor((i)/number_a))
								val = i - ((number_a)*num)
								angle  = (start_angle+(sep_angle*(val)))
								return  angle * (Math.PI/180);
							}

						}

	//calculate end angle
	ea = function(d, i) {
							if (i <  number_a )
							{
								sep = ((i+1)*sep_angle)
								angle = start_angle+sep
								return  angle * (Math.PI/180);
							}
							else
							{
								//current multiple
								num = (Math.floor((i)/number_a))
								val = i - ((number_a)*num)
								//console.log(val)
								angle  = (start_angle+(sep_angle*(val+1)))
								//console.log("too  :"+angle)
								return  angle * (Math.PI/180);
							}	
						}

		data_array = json_data
		json_data = data_array.slice(0*number_r*number_a,(1)*number_r*number_a);

		var g = parent_object
				.attr("id", "chart"+attrib_number.toString())
				.style("position", "absolute")
				.style("top","10px");	
		
		d3.select('#chart'+attrib_number.toString()).selectAll('path')
			.data(json_data)
			.enter()
			.append('svg:path')
			.attr('d', d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
			.attr('transform', 'translate('+inital_x+', '+inital_y+')')
		  	.attr("x",0)		 
		  	.attr('fill', color)
			.attr("stroke", "black")
			.attr("class","flood_cell")
			.attr("stroke-width", "0.5px")
			.text( function (json_data) { return json_data; } )
			.on("mouseover", function(json_data){
										tooltip = d3.select("#tooltip")
										tooltip.text("Storm Surge Elevation: "+json_data+"ft")
										tooltip.style("visibility", "visible")

										if (d3.select(this).attr("staticCell") == "true"){

										}else{
											var cell = d3.select(this)
										      .attr("stroke", "#0066CC")
											  .attr("stroke-width", "2px")										  
											  .attr("class","selected_flood_cell")
											  .attr("floodValue",json_data)
										}  										
										return tooltip;
										})

			.on("mousemove", function(){
										tooltip = d3.select("#tooltip")
										return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){
										tooltip = d3.select("#tooltip")
										
										if (d3.select(this).attr("staticCell") == "true"){
										}
										else{
											d3.select(this)
											.attr("stroke", "black")
											.attr("class","flood_cell")
											.attr("stroke-width", "0.5px")
										}
										return tooltip.style("visibility", "hidden");
										});

		//Labels
		var label_rad = initial_rad+14;
		for(var i=0; i<number_r; i++) {
			label = radius_wind_labels[i];
			//label_angle = 4.73;
			label_angle = 6.95;
			g.append("def")
			  .append("path")
			  .attr("id", "flood_path"+i)
			  .attr("d", "M"+inital_x+" "+inital_y+" m"+label_rad*Math.cos(label_angle)+" "+label_rad*Math.sin(label_angle)+" A"+label_rad+" "+label_rad+" 90 0 0 "+(100+label_rad)+" "+inital_y);
			g.append("text")
			  .attr("class", "radius_max_winds_label")
			  .append("textPath")
			  .attr("xlink:href", "#flood_path"+i)
			  .text(label);

			label_rad += rad_offset;
		}

		g.append("text")
			.attr("class", "radius_max_winds_label")
			.attr('transform', 'translate(200,50)')
			.text("Rw");


		g.append("text")
			.attr("class", "radius_max_winds_label")
			.attr('transform', 'translate(220,165)')
			.text("\u03B8");

		label_rad = initial_rad+(number_r*rad_offset)+10;
				
		//angle labels
		g.append("def")
			.append("path")
			.attr("id", "angle_label")
			.attr("d", "M"+inital_x+" "+(parseFloat(inital_y)-label_rad)+" a"+label_rad+" "+label_rad+" 0 1 1 -1 0")
			
			for(var i=0; i<angle_labels.length; i++) {
				label_angle = 10
				label = angle_labels[i];
				//use labels to calculate the location of cell
				label_angle_location = ((parseFloat(label)-(sep_angle/4))/360)*100
				var rounded = Math.round( parseFloat(label) * 10 ) / 10;
				var fixed = rounded.toFixed(1)
				g.append("text")
					.attr("class", "angle_label")
					.append("textPath")
					.attr("xlink:href", "#angle_label")
					.attr("startOffset", label_angle_location+"%")					
					.text(fixed.toString());
					    			
	}
			 

	function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }

}

