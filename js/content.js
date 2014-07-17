/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
function createContent(){
	  var global_flood_data = []
    var forwardSpeedActuals = [17.4,26.1,34.8,43.4,52.1,60.83]
    var sealevelrisemap = [1.9005,2.9005,3.9005,5.9005]

    var tooltip = d3.select("#tooltip").text("");
    /*
    create the funciton for dragging the marker
    */
    function ondragend() {
        var m = locationMarker.getLatLng();      
        var start = new Date().getTime();
        
        locationMarker.setIcon(locationIcon_working)
        locationMarker.dragging.disable();
        
          getCellData(m.lat,m.lng)
            .done(function(result){              
              locationMarker.dragging.enable();   
              locationMarker.setIcon(locationIcon_ok)
                                   
              //once its complete set the global data only need to get it once per marker then
              global_flood_data = result
              var end = new Date().getTime();
              console.log("flood data loaded...",(end - start)/1000)
              
              update_flood_fan_data();
            })
            
            .fail(function() {
              //locationMarker.dragging.enable(); 
              //locationMarker.setIcon(locationIcon_error)  
            })
            .error(function() {
              locationMarker.dragging.enable(); 
              locationMarker.setIcon(locationIcon_error)  
              for(var p=0; p<4; p++) {                       
                updateFan("#chart"+p,mockdata,colorMapping)         
              }
            });
    }


    //run it on load to get the data
    // every time the marker is dragged, update the coordinates container
    locationMarker.on('dragend', ondragend);
    ondragend();

    //test code for flood fan action
    $( ".floodFan" ).mouseover(function(d) {      

      var d = (d3.select(".selected_flood_cell"))[0][0]      

      if(!!d){
        val = d3.select(d).attr("floodValue")     
        stormSurgeLine = d3.select("#stormSugeLine")
        if (val > 30){
          val = 30
        }

        var x = d3.scale.linear().domain([0,100]).range([0, 600 - 40 - 30]);
        var y = d3.scale.linear().domain([0,maxValue]).range([150 - 20 - 30, 0]);   
        stormSurgeLine.attr("x1", x(0))
        stormSurgeLine.attr("y1", y(val))
        stormSurgeLine.attr("x2", x(100))      
        stormSurgeLine.attr("y2", y(val))   
        stormSurgeLine.transition().style("opacity", 1);
      }
    });

    $( ".floodFan" ).mouseout(function() {     
      stormSurgeLine = d3.select("#stormSugeLine")
      stormSurgeLine.transition().style("opacity", 0);
    });


    colName = ["20","30","40","50","60","70"]
    rowName = ["20","40","60","80","90"]
    colors = ["white","yellow","orange","red"];

    //idx of default value
    var defaultVals = new Array();
    defaultVals[0] = 3
    defaultVals[1] = 3
    defaultVals[2] = 3
    defaultVals[3] = 0
    defaultVals[4] = 3

    //loop though and create radio options
    radio_option_list = [["20","30","40","50","60","70"],
                        ["20","40","60","80","90"],
                        ["0","1","2","4"],
                        ["20","30","40","45","50","55"],
                        ['135', '146', '157', '168', '180', '191','202']]

    radio_option_names= [["Forward Speed, T (mph)","forwardSpeed"],
                         ["Pressure Difference, delta-P (mb)","pressureDiff"],
                         ["Sea Level Rise (ft)","seaLevelRise"],
                         ["Radius Of Maximum winds, Rw (NM)","radiusWinds"],
                         ["Track Direction, \u03B8 (deg from N)","floodAngle"]]


    radio_option_help= {"forwardSpeed":["Forward Speed: Translational forward movement of the storm.  Change the forward speed to     explore changes to the predicted storm surge elevation, shown by the Flood Fans, and the associated return period."],
      "pressureDiff": ["Pressure difference: The difference between the peripheral pressure and the central pressure of a hurricane. Change the pressure difference to update the predicted damages and inundation extent as well as explore changes to the predicted storm surge elevation, shown by the Flood Fans, and the associated return period.\nCategory 1: 20\nCategory 2: 40\nCategory 3: 60\nCategory 4: 80\nCategory 4+: 90"],
      "seaLevelRise":["Sea Level Rise: Change the amount of sea level rise to update the predicted damages and inundation extent as well as explore changes to the predicted storm surge elevation, shown by the Flood Fans, and the associated return period."],
      "radiusWinds":["Radius of Maximum Winds: Distance from the hurricane center to the location of maximum winds; generally near the inner edge of the eye wall. Change the radius of maximum winds to explore changes to the predicted storm surge elevation, shown by the Flood Fans, and the associated return period."],
        "floodAngle":["Track Direction: direction hurricane is approaching from in degrees clockwise from North. Change the track direction to explore changes to the predicted storm surge elevation, shown by the Flood Fans, and the associated return period."]}



    for(var i=0; i<5; i++) {
        f_list = radio_option_list[i]
        f_name = radio_option_names[i][0]
        f_simpleName = radio_option_names[i][1]
        createRadioOptions(f_name,f_list,f_list[defaultVals[i]],i+1,f_simpleName)
        defaultVals[i] = f_list[defaultVals[i]]
    }     

    $('.radio_option.pressureDiff, .radio_option.seaLevelRise').on('click', function(event) {
      //on click update the plot      
      var vals = new Array();
      var fields = new Array();
      ff = $('.radio_option.selected')
      //console.log(ff)

      //TODO: THIS IS CRAP!
      for(var i=0; i<5; i++) {
        var k = d3.select("#radio_"+(i+1))
        var selection = k.selectAll( '.selected');
        trueRect = selection.select("rect")
        vals[i] = trueRect.attr("name")
        fields[i] = trueRect.attr("field")
      }

      updatePieChart(vals,fields,false);

      //geojson file, uses the classes to find the items of interest
      pressure_val = $('.pressureDiff.selected').children().first().attr("name");
      sea_level_rise_val = $('.seaLevelRise.selected').children().first().attr("name");
     
      geojson_file = './shp/'+pressure_val+'mb_'+sea_level_rise_val+'ft.shp.geojson'
      assetLayerGroup.clearLayers()
      $.getJSON(geojson_file, function(data) {
        var geojson = L.geoJson(data, {
          onEachFeature: function (feature, layer) {
            //layer.bindPopup(feature.properties.name);
          }
        });
        assetLayerGroup.addLayer(geojson)
        assetLayerGroup.addTo(map);
        });


    });


    /*
    updates the flood fan using the currently set data from the SLOSH model results
    */
    function update_flood_fan_data(){      
      //update flood fans when ever a selection option is changed
       forward_speed_val_idx = $('.forwardSpeed.selected').children().first().attr("xidx");
          forward_speed_val = (forwardSpeedActuals[forward_speed_val_idx])
            pressure_val = $('.pressureDiff.selected').children().first().attr("name");
              sea_level_rise_val = $('.seaLevelRise.selected').children().first().attr("name");
                radius_floods_val = $('.radiusWinds.selected').children().first().attr("name");
                  flood_angle_val = $('.floodAngle.selected').children().first().attr("name");

            
      //update the chart title
      var k = d3.select("#simpleChartTitle")
      var a = radio_option_list[1].indexOf(pressure_val);      
      a = a +1

      if (a>4){
        a = " 4 Extreme"
      }

      k.text("Full Replacement Cost (worst case Category "+a+" + "+sea_level_rise_val+"ft SLR) ")


      var k = d3.select("#floodFanTitle")
      val = radio_option_list[0][forward_speed_val_idx]
      k.text("T = "+val+", Category "+a + " ("+pressure_val+"mb)" )

      if (sea_level_rise_val == 4){
        sea_level_rise_id = 3
      }else{
        sea_level_rise_id = sea_level_rise_val
      }            

      //get all sea level rise data            
        for(var p=0; p<4; p++) {
          //if the data failed clear the fans
         
          data_array = []                    
          init_data = global_flood_data[forward_speed_val][pressure_val][sealevelrisemap[p]];         
          //console.log(init_data)
            //get the wind radius of winds labels
            for(var i=0; i<radius_wind_labels.length; i++) {                                                      
                  windRadiusData = init_data[radius_wind_labels[i]]
                  //if nothing is there replace the whole array                  
                  if(typeof windRadiusData !== "undefined"){
                    for(var j=0; j<angle_labels.length; j++) {
                      //get the wind angle label
                      angle_lbl = angle_labels[j]  
                      data_item = windRadiusData[angle_lbl]
                      //replace an item if it does not exist
                      if(typeof data_item !== "undefined"){
                        data_array.push(data_item);
                      }else{
                        data_array.push(0);
                      } 
                    }  
                  }else{
                     for(var j=0; j<angle_labels.length; j++) {
                      data_array.push(0);
                     }
                  }
            }
          updateFan("#chart"+p,data_array,colorMapping)         
        }
      

      floodFanName = 'floodFan'+sea_level_rise_id

      var rIdx = radio_option_list[3].indexOf(radius_floods_val);
      var aIdx = radio_option_list[4].indexOf(flood_angle_val);


      selectedIdx = rIdx*radio_option_list[4].length+aIdx

      $( ".static_flood_cell").each(function( index ) {
        dd = d3.select(this)
        dd.attr("class","flood_cell")
        dd.attr("staticCell", "false")
      });

      $( ".flood_cell","#"+floodFanName).each(function( index ) {
        dd = d3.select(this)        
        if (index == selectedIdx){      
          //dd.moveToFront(); 
          dd.attr("class", "static_flood_cell")
          dd.attr("staticCell", "true")
          
          val = dd.text()

          stormSurgeLine = d3.select("#stormSugeLineStatic")
          if (val > 30){
            val = 30
          }

          var x = d3.scale.linear().domain([0,100]).range([0, 600 - 40 - 30]);
          var y = d3.scale.linear().domain([0,maxValue]).range([150 - 20 - 30, 0]);   
          stormSurgeLine.attr("x1", x(0))
          stormSurgeLine.attr("y1", y(val))
          stormSurgeLine.attr("x2", x(100))      
          stormSurgeLine.attr("y2", y(val))   
          stormSurgeLine.transition().style("opacity", 1);

        }        
      });  
    }


    $('.radio_option').on('click', update_flood_fan_data);

    updatePieChart(defaultVals,[],true)

    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }
        return arr;
    }
    
    /*
    create the color mapping to plot on to the flood fan
    */  
    var minValue = 0
    var maxValue = 30

    //data is inside the function
    showSimpleScatterPlot(minValue,maxValue);


    createLegend(colors,minValue,maxValue);
    valTotal = maxValue-minValue;
    valChange = (valTotal/colors.length);
    var valArray = new Array(colors.length);
    for(var i=0; i<colors.length; i++) {
      valArray[i] = minValue+(i*valChange)
    } 
    var colorMapping = d3.scale.linear().domain(valArray).range(colors);

    var data_labels = ['17.4', '26.1', '34.8', '43.4'];
    //sea level rise fans
    //create mock data to initalize the flood fans
    var mockdata = [0, 0, 0, 0, 0, 0, 0, 
    				0, 0, 0, 0, 0, 0, 0, 0, 0, 
    				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      
    for(var i=0; i<data_labels.length; i++) {
        chart = floodFan(mockdata,i,data_labels[i],colorMapping,minValue,maxValue)
    }

    //deprecated
    function onclick(d,i){
       
    }

    function updatePieChart(vals,fields,newPie){
      //location default
      var location = "Total"
      var categoryList = ["Residential",
                      "Commercial",
                      "Industrial",
                      "Agriculture",
                      "Religious/Non-Profit",
                      "Government",
                      "Education"]

      var fields = ["Total Economic Damage"]           

      d3.json("./haz_data/data.json", function(error, json) {
          if (error) return console.warn(error);
          data = json;
          /*
          hazard file is
          [#pressure]mb_[#seaLevelRise]
          */
          if (vals[2] == "0"){
            fieldName = vals[1]+"mb_noslr"
          }else{
            fieldName = vals[1]+"mb_"+vals[2]
          }

          dataEx = data[fieldName][location]

          var dataDict = [];        
          for(var i=0; i<categoryList.length; i++) {
              dataDict.push({
                type:   categoryList[i],
                val: dataEx[categoryList[i]][fields[0]]
            });
          }
          updateSimplePieChart(newPie,dataDict,'#piechartTotalDiv',true)        
        });
    }

    $( ".radioHelp" ).mouseover(function(d) {  
      var $input = $( this );
      c = $input.attr("info")
      tooltip.append("svg:title")
      tooltip.text(radio_option_help[c][0])
      tooltip.style("visibility", "visible")     
    });


    $( ".radioHelp" ).mousemove(function(d) {   
      tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    });

    $( ".radioHelp" ).mouseout(function(d) {   
      tooltip.style("visibility", "hidden")
    });

    helpDict = {
      "pieChartPanelHelp":["Damage Predictions: This pie charge shows the full replacement cost, by sector, for infrastructure damages.  Damages were calculated for the worst case inundation scenario for every combination of pressure difference and sea level rise.  Change either the pressure difference or sea level rise options to update the damages."],
      "radioPanelHelp":["Hurricane Parameters: use the following options to explore changes to storm surge elevation, inundation extent, water level return period, and predicted damages."],
      "mapPanelHelp":["Inundation Extents: This map shows worst case inundation for every combination of pressure difference and sea level rise. Change either the pressure difference or sea level rise options to update the map."],
      "floodFanPanelHelp":["Flood Fans: The Flood Fans are a unique way to visualize the sensitivity of predicted storm surge elevation to various hurricane parameters.  The Fans summarize the storm surge elevation predictions for a given location associated with a particular combination of forward speed and pressure difference.  By moving around the Fans users can see how Track Direction, Radius of Maximum Winds, and Sea Level impact predicted storm surge elevation. The Fans represent storm surge elevation at a single location, click on the map to change that location."],
      "exceedPanelHelp":["Annual Exceedance Probability Curve (Newport, RI): This plot indicates the highest annual water levels as a function of return period in years. The dots indicate the highest water levels used to calculate the curve in feet, relative to NAVD88. The red horizontal line indicates storm surge elevation predicted by the combination of hurricane parameters selected."]
    }

    $( ".panelheader" ).mouseover(function(d) {  
      var $input = $( this );
      c = $input.attr("id")    
      tooltip.append("svg:title")
      tooltip.text(helpDict[c][0])
      tooltip.style("visibility", "visible")     
    });

    $( ".panelheader" ).mousemove(function(d) {   
      tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    });

    $( ".panelheader" ).mouseout(function(d) {   
      tooltip.style("visibility", "hidden")
    });

}