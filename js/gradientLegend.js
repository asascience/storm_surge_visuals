/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function createLegend(colors,min_val,max_val){

    intcVal = 4
    barheight = 25
    barwidth = 400
    x_offset = 10
    inc_y_offset = 12
    units = 'ft'


    var svgContainer = d3.select("#floodFanLegend").append("div").append("svg")
    .attr("width",barwidth+50)
    .attr("height",60)

    gContainer = svgContainer.append("g")
    defContainer = gContainer.append("defs")
    defContainer.append("linearGradient").attr("id","legendGradient")

    svgContainer.append("rect")
        .attr("fill","url(#legendGradient)")
        .attr("x",x_offset)
        .attr("y",0)
        .attr("width",barwidth)
        .attr("height",barheight)
        .attr("rx",0)  //rounded corners, of course!
        .attr("ry",0)
        .attr("stroke","black")
        .attr("stroke-width",2)
        .attr("fill-opacity",1)
        .attr("stroke-opacity",1);

    
    var tick = barwidth/intcVal;
    var rtpw = max_val -  min_val;
    var tick_val = rtpw/intcVal;

    //+1 is needed for last element
    for(var i=0; i<intcVal+1; i++) {
        x = 0+(tick*i);
        val = min_val+(tick_val*i)

        if (i ==intcVal){
            svgContainer.append("text")
            .text("> "+parseFloat(val).toFixed(2)+ ""+units)
            .attr("x",0)
            .attr("y",0)
            .attr("width",barwidth)
            .attr("height",25) 
            .attr('transform', 'translate('+x+', '+(barheight+inc_y_offset)+')')
            .attr('font-size',12);
        }
        else{

        svgContainer.append("text")
        .text(parseFloat(val).toFixed(2))
        .attr("x",0)
        .attr("y",0)
        .attr("width",barwidth)
        .attr("height",25) 
        .attr('transform', 'translate('+x+', '+(barheight+inc_y_offset)+')')
        .attr('font-size',12);
        }

         svgContainer.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", -10)
          .attr("stroke", "black")
          .attr("stroke-width", "2px")
          .attr('transform', 'translate('+(x+10)+', '+(barheight)+')');


    }


   

    //Draw the chart
    valChange = 100/(colors.length-1)
    var valArray = new Array(colors.length,colors.length);
    for(var i=0; i<colors.length; i++) {
        valArray[i] = new Array(2);
        if (i==0){
            valArray[i][0] = "0%"
            valArray[i][1] = colors[i]
        }else{
            valArray[i][0] = (i*valChange)+"%"
            valArray[i][1] = colors[i]
        }
    }

    updateAll(valArray);

    function updateStops(data) {
        var stops = d3.select('#legendGradient').selectAll('stops').data(data);
        
        stops.enter().append('stop');
        
        stops.attr('offset', function(d) { return d[0]; })
             .attr('stop-color', function(d) { return d[1]; });
    }


    function updateText(data) {
        var text = d3.select('gradientText').selectAll('text').data(data).attr('transform', 'translate('+0+', '+0+')');
        
        text.enter().append('text');
            
        text.attr('y', function(d,i) { return i * 15 + 15; })
            .text("something here");

            //.text(function(d) { return d.join(' '); });
        
    }

    function updateAll(data) {
        updateStops(data);
        updateText(data)
    }

}
