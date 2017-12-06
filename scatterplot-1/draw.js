function draw(){

    var initialProps = {
        dims: {
          single: { width: 260, height: 225 },
          double: { width: 540, height: 250}
        },
    };
    
    // Returns object with properties and methods representing
    // dimensions, scales, axes, etc.
    var werk = werkHelper.build(initialProps);
    
    
    var svg = d3.select("#chart")
        .append("svg")
        .style("background-color","transparent")
        .attr("width", werk.dims.svg.width + werk.dims.margins.left + werk.dims.margins.right)
        .attr("height", werk.dims.svg.height + werk.dims.margins.top + werk.dims.margins.bottom)
      .append("g")
        .attr("transform", "translate(" + werk.dims.margins.left + "," + werk.dims.margins.top + ")");

    chartwerk.axes.base.shadedRegions.forEach(function(shade) {
        var rectLeft = werk.scales.x(werk.parsers.base(shade.min));
        var rectRight = werk.scales.x(werk.parsers.base(shade.max));
        var minWidth = 2;
        var width = Math.max(2, rectRight - rectLeft);
        if (rectRight === rectLeft) {
            svg.append('line')
                .attr("class",'solid-line')
                .attr("y1", 0)
                .attr("y2", werk.scales.y.range()[0])
                .attr("x1", rectLeft)
                .attr("x2", rectLeft);
        } else {
            svg.append('rect')
                .attr("class","shaded-area")
                .attr('y', 0)
                .attr('x', rectLeft)
                .attr('width', width)
                .attr('height', werk.scales.y.range()[0]); 
        }
    });
    
    chartwerk.axes.value.shadedRegions.forEach(function(shade) {
        var rectMin = werk.scales.y(werk.parsers.value(shade.min));
        var rectMax = werk.scales.y(werk.parsers.value(shade.max));
        var height = Math.max(2, rectMin - rectMax);
        if (rectMin === rectMax) {
            svg.append('line')
                .attr("class",'dotted-line')
                .attr("x1", 0)
                .attr("x2", werk.scales.x.range()[1])
                .attr("y1", rectMin)
                .attr("y2", rectMin);
        } else {
            svg.append('rect')
                .attr("class","shaded-area")
                .attr('x', 0)
                .attr('y', rectMax)
                .attr('width', werk.scales.x.range()[1])
                .attr('height', height); 
        }
    });

    svg.append("g")
        .attr("class", "y axis")
        .call(werk.axes.y)
      .append("text")
        .attr("class","label")
        .attr("y", -werk.dims.margins.top + 15)
        .attr("x", -werk.dims.margins.left)
        .style("text-anchor", "start")
        .text(chartwerk.axes.value.label);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + werk.dims.svg.height + ")")
        .call(werk.axes.x);
    
    
    var dots = svg.selectAll("circle.dot")
        .data(werk.data)
      .enter().append("circle")
        .attr("class",function(d, i){ return "dot n-" + i.toString()})
        .attr("r", 6)
        .attr("cx", function(d) { return werk.scales.x(d.x); })
        .attr("cy", function(d) { return werk.scales.y(d.y); })
        .style("fill", werk.scales.color());
    
    var voronois = svg.selectAll("path.voronoi")
        .data(werk.scales.voronoi.polygons(werk.data))
      .enter().append("path")
        .attr("class", "voronoi")
        .attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseout",  hideTooltip)
        .on("mouseover", showTooltip);
    
    
    
    var tooltip = d3.select("#chart")
      .append("div")
        .attr("class","tooltip")
        .style("position","absolute");
    tooltip
      .append("div")
      .attr("class","value");
    
    
      
    function hideTooltip(d, i){
        d3.select(".tooltip")
          .style("opacity", 0);
        svg.selectAll('circle.n-' + i.toString())
            .classed("active", false);
    }
    
    function showTooltip(d, i){
        console.log(i);
        if (!d.data.tooltip) return;
        var x = werk.scales.x(d.data.x);
        var y = werk.scales.y(d.data.y);
        console.log(x, y);
        tooltip
            .style('top', function() {
                return y < (werk.dims.svg.height / 2) ?
                    (y + 20) + 'px' :
                    (y - 20) + 'px';
            })
            .style('left', function() {
                return x < (werk.dims.svg.width / 2) ?
                    (x + 40) + 'px' :
                    (x - 40) + 'px';
            })
            .style('opacity', 1);
        tooltip.select('div')
            .text(d.data.tooltip);
        
        svg.selectAll('circle.n-' + i.toString())
            .classed("active", true);
    }
}