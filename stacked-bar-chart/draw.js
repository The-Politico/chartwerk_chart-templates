function draw() {

    var initialProps = {
        dims: {
          single: { width: 260, height: 225 },
          double: { width: 540, height: 250}
        },
    };
    
    // Returns object with properties and methods representing
    // dimensions, scales, axes, etc.
    var werk = werkHelper.build(initialProps);

    var hasYAxisLabel = chartwerk.axes.value.label !== '';
    var yAxisLabelHeight = 20;

    var totalSvgHeight = hasYAxisLabel ? (
        werk.dims.svg.height + yAxisLabelHeight
    ) : (
        werk.dims.svg.height
    );

    var svg = d3.select('#chart').append('svg')
            .style('background-color', 'transparent')
            .attr(
                'width',
                (
                    werk.dims.margins.left +
                    werk.dims.svg.width +
                    werk.dims.margins.right
                )
            )
            .attr(
                'height',
                (
                    werk.dims.margins.top +
                    totalSvgHeight +
                    werk.dims.margins.bottom
                )
            );

    var chartTop = hasYAxisLabel ? werk.dims.margins.top + yAxisLabelHeight : werk.dims.margins.top;

    var g = svg.append('g')
        .attr(
            'transform',
            'translate(' +
                werk.dims.margins.left + ',' +
                chartTop +
            ')'
        );

    var xAxis = g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + werk.dims.svg.height + ')')
        .call(werk.axes.x);

    var yAxis = g.append('g')
            .attr('class', 'y axis')
            .call(werk.axes.y);

    if (chartwerk.ui.size === 'double') {
        yAxis.attr('transform', 'translate(0,-1)');
    }

    if (hasYAxisLabel) {
        yAxis.append('text')
            .attr('class', 'label')
            .attr('y', -werk.dims.margins.top + 15  - yAxisLabelHeight)
            .attr('x', -werk.dims.margins.left)
            .style('text-anchor', 'start')
            .text(chartwerk.axes.value.label);
    }

    g.append('g')
        .selectAll('g')
        .data(chartwerk.data)
        .enter().append('g')
            .attr('class', function(d) {
                return d[chartwerk.datamap.base].toLowerCase() + '-group';
            })
            .attr(
                'transform',
                function(d) {
                    return (
                        'translate(' +
                        werk.scales.x0(d[chartwerk.datamap.base]) +
                        ',0)'
                    );
                }
            )
        .selectAll('rect')
        .data(
            function(d) {
                var keys = chartwerk.axes.color.domain.sort();

                return keys.map(function(key) { return {key: key, value: d[key]}; });
            }
        )
        .enter().append('rect')
            .attr('x', function(d) { return werk.scales.x1(d.key); })
            .attr('y', function(d) {
                // 
                return (d.value >= 0) ? (werk.scales.y(d.value)) : (werk.scales.y(0));
            })
            .attr('width', werk.scales.x1.bandwidth())
            .attr('height', function(d) {
                return Math.abs(werk.scales.y(d.value) - werk.scales.y(0));
                // return (
                //     d.value >= 0
                // ) ? (
                //     werk.dims.svg.height - werk.scales.y(d.value)
                // ) : (
                //     werk.scales.
                // );
            })
            .attr('fill', function(d) { return werk.scales.color(d.key); })
            .attr('class', 'bar')
            .style('pointer-events', 'fill')
                .on('mouseout',  hideTooltip)
                .on('mousemove', showTooltip);

    if (werk.highlightZeroLine) {
        g.append('line')
            .attr('class', 'zero')
            .attr('x1', 0)
            .attr('x2', werk.dims.svg.width)
            .attr('y1', werk.scales.y(0))
            .attr('y2', werk.scales.y(0));
    }

    var tooltip = d3.select('#chart')
      .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute');

    tooltip
      .append('div')
      .attr('class', 'value');

    function showTooltip() {
        var columnData = d3.select(this).datum();

        var tooltipColor = werk.scales.color(columnData.key);

        var comma = d3.format(',');

        d3.select('.tooltip .value')
          .style('color', tooltipColor)
          .text(function(){
              var v = chartwerk.axes.value;
              return v.prefix + comma(columnData.value) + v.suffix;
          });

        var p = d3.mouse(this.parentElement.parentElement);

        d3.select('.tooltip')
            .style('opacity', 1)
            .style('top', function(){
                var s = chartwerk.ui.size;

                var h = werk.dims[s].height;

                var pos = p[1] > (h / 2) ? p[1] + 10 : p[1] + 20;

                return pos.toString() + 'px';
            })
            .style("left", function(){
                // We position either left or right of the mouse point based
                // on whether we're past the midpoint of the chart. This protects
                // against tooltips overflowing embedded iframes.
                var s = chartwerk.ui.size;

                var w = werk.dims[s].width;

                var tipW = parseInt(d3.select(".tooltip").style("width"), 10);

                var pos = p[0] > (w / 2) ? p[0] - (tipW - 20) : p[0] + 40;

                return pos.toString() + "px";
            });
    }

    function hideTooltip() {
      d3.select(".tooltip").style("opacity", 0);
    }
}