function draw(){
    var initialProps = {
        dims: {
          single: { width: 270, height: 325 },
          double: { width: 580, height: 450}
        },
    };
    
    var werk = werkHelper.build(initialProps);
    console.log(werk.data);
	
	var comma = d3.format(",");

    var map = d3.map(werk.data, function(d){ return d.county; }),
        path = d3.geoPath();
	
	var svg = d3.select("#chart").append("svg")
      .style("background-color","transparent")
        .attr("width", werk.dims.svg.width + werk.dims.margins.left + werk.dims.margins.right)
        .attr("height", werk.dims.svg.height + werk.dims.margins.top + werk.dims.margins.bottom)
      .append("g")
        .attr("transform", "translate(" + werk.dims.margins.left + "," + werk.dims.margins.top + ")");
    

    function getCounty(d){
        // Uses properties in topojson to retrieve the correct datum in your
        // user's data. Should handle most use cases, but you may need to customize
        // for individual states.
        return map.get(d.properties.state + d.properties.county) || // Full fips
            map.get(d.properties.county) || // Just county fips
            map.get(werkHelper.slugify(d.properties.name)) || // Full county name, ie, Fulham County
            map.get(werkHelper.slugify(d.properties.name.replace(' County', ''))) // Just the name
            false;
    }

    d3.json("https://www.politico.com/interactives/elections/data/geography/2016/state/01/counties.json", function(error, geoData){

        
        var features = topojson.feature(geoData, {
            type: 'GeometryCollection',
            geometries: geoData.objects['-'].geometries,
        });
        
        var path = d3.geoPath()
          .projection(d3.geoMercator()
            .fitSize([werk.dims.svg.width, werk.dims.svg.height], features));
        
        var mapG = svg.append("g")
            .attr("id", "counties")
            .attr("width", werk.dims.svg.width)
            .attr("height", werk.dims.svg.height);
        
        var counties = mapG.selectAll("path")
            .data(features.features);
        
        counties.enter().append("path")
            .attr('d', path)
            .attr("class", "county")
            .style('fill', function(d){
                if (getCounty(d)) {
                    return werk.scales.color(getCounty(d).value);
                }
                return '#e2e2e2';
            })
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .on("mouseover",function(d){
                
                if (getCounty(d)) {
                    d3.select(this)
                      .style("stroke", "black")
                      .moveToFront();
                  
                    d3.select(".tooltip .title")
                      .text(d.properties.name);
                  
                    d3.select(".tooltip .value")
                      .text(function(){
                          var s = chartwerk.axes.scale;
                          var data = getCounty(d);
                          if (data) {
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
                  .style("stroke","#ccc")
                  .style('fill', function(d){ 
                    if (getCounty(d)) {
                        return werk.scales.color(getCounty(d).value);
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