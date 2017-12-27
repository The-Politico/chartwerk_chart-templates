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
    
    var comma = d3.format(",");
    
    var div = d3.select("#chart")
        .append("div")
        .style("margin", 
            werk.dims.margins.top + "px " +
            werk.dims.margins.right + "px " +
            werk.dims.margins.bottom + "px " +
            werk.dims.margins.left + "px "
        );
    
    
    var response = div.selectAll(".response")
        .data(werk.data)
      .enter().append("div")
        .attr("class","response");
    
    var bar = response.append("div")
        .attr("class", "bar")
        .style("background-color", chartwerk.axes.color.range[0])
        .style("width", function(d){ return werk.scales.x(d.value) + 'px'; });
    
    bar.append("div")
        .attr("class","name label")
      .append("span")
        .text(function(d){ return d.name;});
        
    bar.append("div")
        .attr("class","value label")
      .append("p")
        .attr("class", function(d){
            return werk.scales.x(d.value) < 75 ?
                'offset' : '';
        })
        .style("width", function(d){
            return werk.scales.x(d.value) < 75 ?
                werk.dims.div.width - this.parentElement.parentElement.clientWidth + 'px' : '';
        })
        .style("margin-left", function(d){
            return werk.scales.x(d.value) < 75 ?
                this.parentElement.parentElement.clientWidth + 'px' : '';
        })
        .text(function(d){
            return chartwerk.axes.value.prefix + comma(String(d.value)) + chartwerk.axes.value.suffix;
        });
    

}