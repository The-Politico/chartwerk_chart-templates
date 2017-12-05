function draw(){
    var initialProps = {
        dims: {
          single: { width: 270, height: 205 },
          double: { width: 580, height: 370}
        },
    };
    
    var werk = werkHelper.build(initialProps);
	
	var comma = d3.format(",");

    var map = d3.map(werk.data, function(d){ return d.state; }),
        path = d3.geoPath(),
        postal = werk.data[0].state.length === 2; // If state label is a postal code
	
	var svg = d3.select("#chart").append("svg")
      .style("background-color","transparent")
        .attr("width", werk.dims.svg.width + werk.dims.margins.left + werk.dims.margins.right)
        .attr("height", werk.dims.svg.height + werk.dims.margins.top + werk.dims.margins.bottom)
      .append("g")
        .attr("transform", "translate(" + werk.dims.margins.left + "," + werk.dims.margins.top + ")");
    
    var projection = d3.geoAlbersUsa()
        // Scale for different sizes
        .scale(chartwerk.ui.size === 'double' ? 720 : 350);

    function getState(d){
        return postal ? map.get(d.properties.ABBREVIATION) : map.get(d.properties.NAME);
    }

    d3.json("https://www.politico.com/interactives/elections/data/geography/2016/state/01/counties.json", function(error, geoData){

        
        var features = topojson.feature(geoData, {
            type: 'GeometryCollection',
            geometries: geoData.objects['-'].geometries,
        });
        
        var path = d3.geoPath()
          .projection(d3.geoMercator()
            .fitSize([mapWidth, mapHeight], features));

        var states = svg.append("g")
            .attr("id", "states")
            // Have to recenter, probably because this map originally had Puerto Rico in it...
            //.attr("transform", chartwerk.ui.size === 'double' ? "translate(-220, -90)" : "translate(-360, -160)")
            .selectAll("path")
            .data(features.features)
            .enter().append("path")
            .attr('d', d3.geoPath().projection(projection))
            .attr("class", "state")
            .style('fill', function(d){
                if (getState(d) && getState(d).value !== '') {
                    return werk.scales.color(getState(d).value);
                }
                return '#e2e2e2';
            })
            .style("stroke", "#fff")
            .on("mouseover",function(d){
                
                if (getState(d) && getState(d).value !== '') {
                    d3.select(this)
                      .style("stroke", "black")
                      .moveToFront();
                  
                    d3.select(".tooltip .title")
                      .text(d.properties.NAME);
                  
                    d3.select(".tooltip .value")
                      .text(function(){
                          var s = chartwerk.axes.scale;
                          var data = getState(d);
                          if (data || data.value !== '') {
                              if (data.tooltip){
                                  return data.tooltip;
                              } else {
                                  return chartwerk.axes.color.quantize ? 
                                    s.prefix + comma(data.value) + s.suffix : data.value;
                              }
                          }
                      });
                      
                    var p = d3.mouse(this.parentElement.parentElement);
                    
                    d3.select(".tooltip")
                        .style("opacity", 1)
                        .style("top",function(){
                            return p[1].toString() + "px";
                        })
                        .style("left", function(){
                            // We position either left or right of the mouse point based
                            // on whether we're past the midpoint of the chart. This protects
                            // against tooltips overflowing embedded iframes.
                            var s = chartwerk.ui.size,
                                w = werk.dims[s].width,
                                tipW = parseInt(d3.select(".tooltip").style("width"), 10),
                                pos = p[0] > (w / 2) ?
                                    p[0] - (tipW - 10) : p[0] + 40;
                            return pos.toString() + "px";
                        });
                }
            })
            .on("mouseout",function(){
                d3.select(this)
                  .style("stroke","#fff")
                  .style('fill', function(d){ 
                    if (getState(d) && getState(d).value !== '') {
                        return werk.scales.color(getState(d).value);
                    }
                    return '#e2e2e2';
                });
                d3.select(".tooltip")
                    .style("opacity", 0);
            });
    });
    
    var tooltip = d3.select("#chart")
      .append("div")
        .attr("class","tooltip")
        .style("position","absolute");
    tooltip
      .append("div")
      .attr("class","title")
      .text(chartwerk.datamap.scale);
    tooltip
      .append("div")
      .attr("class","value");
}