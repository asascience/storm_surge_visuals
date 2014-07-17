/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function showSimpleScatterPlot(min_value,max_value) {

   //year, water elevation ft, 
    var data =   [[0.0, 2.77], 
                [0.3997703796112449, 3.19], 
                [14.744348550226372, 5.77], 
                [0.52256179169215222, 3.27],
                [3.287188067712719, 4.26], 
                [11.692874020829978, 5.41],
                [0.6150185508986693, 3.37],
                [1.3448487637125817, 3.83],
                [2.5169782930016003, 4.2], 
                [0.78268051978967923, 3.57], 
                [3.8354402450767386, 4.33],
                [1.8962561099434176, 4.03], 
                [29.997222016430928, 6.02], 
                [1.6276934389046227, 3.86], 
                [5.02889455097369, 4.47],
                [0.5837784576147792, 3.35],
                [0.33197648176761835, 3.07],
                [0.98055422631163414, 3.73], 
                [0.43119908279626085, 3.2],
                [1.2269381662998682, 3.77],
                [0.71284796965198871, 3.47],
                [2.8598086197423385, 4.25], 
                [1.1726390575046306, 3.76],
                [0.49226350734271729, 3.27],
                [0.857313179547189, 3.58], 
                [19.829130940324905, 5.79], 
                [0.29259215044743059, 3.07],
                [0.36702911362259966, 3.13],
                [0.64686211756033829, 3.38],
                [3.5431784592511089, 4.3],
                [1.4773522061443642, 3.86], 
                [4.5650934516803927, 4.41], 
                [1.8000964044671293, 3.9], 
                [1.5500560498267173, 3.86], 
                [8.204130743779702, 5.04], 
                [7.1132886944682454, 4.72],
                [2.0001762094071629, 4.06],
                [4.1723540500123821, 4.37], 
                [2.3696996362091598, 4.18],
                [0.46190150579290268, 3.27],
                [6.2644809117485565, 4.68],
                [1.0252418140978836, 3.74],
                [1.121078697413983, 3.75],
                [9.6580398180638394, 5.06],
                [0.5530090193215409, 3.27],
                [0.93777714850461036, 3.7],
                [0.74722491393367652, 3.53],
                [1.7108249415789878, 3.87],
                [0.24325728130826463, 3.07],
                [3.0610599085829042, 4.26],
                [2.6794979183996146, 4.23],
                [2.235574973501806, 4.17], 
                [1.4090927692313382, 3.84], 
                [60.498622564442982, 8.57], 
                [1.2842421431708619, 3.83], 
                [2.1128797359495746, 4.16], 
                [0.6794325084140147, 3.45],
                [5.5850872801551281, 4.62],
                [1.0720181425554709, 3.75],
                [0.8967471112297285, 3.6],
                [0.81933492359981563, 3.57]]


    // just to have some space around items. 
    var margins = {
        "left": 40,
        "right": 30,
        "top": 20,
        "bottom": 30
    };
    
    //set the size
    var width = 600;
    var height = 150;
    
    // this will be our colour scale. An Ordinal scale.
    var colors = d3.scale.category10();

    // we add the SVG component to the scatter-load div
    var svg = d3.select("#return-scatter-plot").append("svg").attr("width", width).attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

   //uses the 2D data array to create 1Darrays of data
    
    var x_vals = []
    var y_vals = []
    for (i in data)
    {      
      x_vals.push(data[i][0])
      y_vals.push(data[i][1])
    }

    //x axis scale
    var min_years = 0
    var max_years = 100

    var x = d3.scale.linear().domain([min_years,max_years]).range([0, width - margins.left - margins.right]);
    //y axis scale to match the newport plot (0:14) ft
    var y = d3.scale.linear().domain([0,max_value]).range([height - margins.top - margins.bottom, 0]);    

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g")
        .attr("class", "x axis return_plot_axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g")
        .attr("class", "y axis return_plot_axis");

    //generate x labels
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("class", "return_plot_title")
        .attr("x", width / 2)
        .attr("y", height - margins.bottom+6)
        .text("Return Period (years)");

    //generate title
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("class", "return_plot_title")
        .attr("x", width / 2)
        .attr("y", 0)
        .text("Exceedance Probability, Newport, RI");    

    //generate y label and rotate it
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("class", "return_plot_title")
        .attr("x", -35)
        .attr("y", -28)
        .attr("transform", function(d) {
         return "rotate(-90)" 
        })
        .text("Height (ft)");


    //define the axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    //call and create the axis
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    //create the linear regression
    var lr = linearRegression(y_vals,x_vals);

    //add the linear regression line
    svg.append("svg:line")
            .attr("x1", x(0))
            .attr("y1", y(lr.intercept))
            .attr("x2", x(max_years))
            .attr("class","linearRegression")
            .attr("y2", y( (max_years * lr.slope) + lr.intercept ));

    //add the surge line but make it invisible
    svg.append("svg:line")
            .attr("x1", x(0))
            .attr("y1", y(0))
            .attr("x2", x(100))
            .attr("xaxis", x)
            .attr("yaxis", y)
            .attr("id","stormSugeLine")
            .style("opacity", 0)
            .attr("y2", y(0)); 


    //add the surge line but make it invisible
    svg.append("svg:line")
            .attr("x1", x(0))
            .attr("y1", y(0))
            .attr("x2", x(100))
            .attr("xaxis", x)
            .attr("yaxis", y)
            .attr("id","stormSugeLineStatic")
            .style("opacity", 0)
            .attr("y2", y(0));              

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return 0;
       })
       .attr("cy", function(d) {
            return 0;
       })
       .attr("class", "dot")
       
       .attr('transform', function (d) {
        return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
        })
        
       .attr("r", 5);

}