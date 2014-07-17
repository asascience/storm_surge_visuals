/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/

    /*
    create radio list
    */
    function createRadioOptions(name,fields,defaultOption,id,simpleName) {
        this.selectedIdx = -1
        defaultColor = "transparent"
        selectedColor = "#0066CC"

        for(var i=0; i<fields.length; i++) {
          if (fields[i] == defaultOption){
            this.selectedIdx = i
          }
        }

        cellSize = 18

        var svg = d3.select("#radioOptions")
            .append("svg")
            .attr("width", 300)
            .attr("height", (cellSize*3)+2)
            .attr("id","radio_"+id);

          //field labels
        for(var i=0; i<fields.length; i++) {
            svg.append("g").append("text")
              .text(fields[i])
              .attr("x", ((i) * cellSize+(i*10))+18+10)
              .attr("y",25)
              .attr("class","radioNumbers")
              .attr("transform", "translate(-10,0)")
              //.attr("class", "rowLabel mono r"+i) ;     
        };    

        //header
        svg.append("g").append("text")
              .attr("id",id)              
              .text(name)
              .attr("x", 18)
              .attr("y", 11)  
              .attr("class", "radioHeader")                  
              .attr("transform", "translate(0,0)");

        node = svg.select("g")

        node.append('text').attr('font-family', 'FontAwesome')
                .attr('font-size', function(d) { return '1em'} )
                .attr("transform", "translate(0,16)")
                .attr("width", 16)
                .attr("height", 16)
                .attr("info",simpleName)                
                .attr("field",name)
                .attr("class","radioHelp")
                .text(function(d) { return '\uf059' }); 


        //radio options map 
        for(var i=0; i<fields.length; i++) {
              svg.append("g")
              .attr("class","state")
              .attr("class","radio_option " + simpleName + " radioCell")              
              .append("rect")
              //.text(fields[i])
              .attr("x", 5+(i) * (cellSize+10)+10)
              .attr("y", cellSize+10)
              .attr("name",fields[i])
              .attr("field",name)
              .attr("xidx", i)
              .attr("yidx", i)
              .attr("class",  "cell cell-border cr"+(2)+" cc"+(2))
              .attr("width", cellSize)
              .attr("height", cellSize)
              .attr("rx",15)  //rounded corners, of course!
              .attr("ry",15)
              .style("fill", function(d)
              {
                //inital setup
                if (i == selectedIdx){

                  var e = d3.event,
                    g = this.parentNode,
                    isSelected = d3.select(g).classed("selected");

                    d3.select(g).classed( "selected", !isSelected);
                    g.parentNode.appendChild(g);
                    this.selectedIdx = i
                  return selectedColor
                }else{
                  return defaultColor
                }             
          })
              .on("mouseover", function(d){
                 //highlight text
                 d3.select(this).classed("cell-hover",true);  
            })

            .on("click", function(d,i) { 
              var e = d3.event,
                  g = this.parentNode,
                  isSelected = d3.select(g).classed("selected");
               
                  //if is not selected select it and remove the old selection
                  if (!isSelected){ 
                    //change the selected color
                    d3.select(this).style("fill",selectedColor)

                    var selection = svg.selectAll( '.selected');
                    trueRect = selection.select("rect")
                    trueRect.style("fill",defaultColor)
                    selection.classed( "selected", false);


                    d3.select(g).classed( "selected", !isSelected);
                    g.parentNode.appendChild(g);

                    //moves it to the bottom for access
                  var selection = svg.selectAll( '.selected');
                
                if( selection[0].indexOf(this)==-1) {
                    selection.classed( "selected", true);
                    selection = d3.select( this);         
                }

                d3.select('#status radio_'+id+' index').text(selectedIdx);
                }
                
            })

              .on("mouseover", function(d){
                 //highlight text
                 d3.select(this).classed("cell-hover",true);
                  
            })
              .on("mouseout", function(){
                 d3.select(this).classed("cell-hover",false);
                 //d3.select("#tooltip").classed("hidden", true);
            });
        }

      }