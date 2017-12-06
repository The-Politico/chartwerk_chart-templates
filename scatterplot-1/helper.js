var werkHelper = {
    parse: function(werk){
        werk.parsers = {
          base: function(d){ return d === '' ? NaN : +d; },
          value: function(d){ return d === '' ? NaN : +d; }
        };
        
        werk.data = chartwerk.data.map(function(d){
            return {
                x: werk.parsers.base(d[chartwerk.datamap.base]),
                y: werk.parsers.value(d[chartwerk.datamap.value]),
            };
        });
        
        // Get max and min of data 
        var xMax = d3.max(werk.data, function(d){return d.x; }),
	        xMin = d3.min(werk.data, function(d){return d.x; }),
	        yMax = d3.max(werk.data, function(d){return d.y; }),
	        yMin = d3.min(werk.data,function(d){return d.y; });
        
        werk.dataDims = {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
        };
    },
    
    dims: function(werk){
        var s = chartwerk.ui.size;
            w = werk.dims[s].width,
            h = werk.dims[s].height,
            margins = {
                right: chartwerk.margins[s].right * w,
                left: chartwerk.margins[s].left * w,
                top: chartwerk.margins[s].top * h,
                bottom: chartwerk.margins[s].bottom * h,
            },
            svg = {
                width: w - margins.left - margins.right,
                height: h - margins.top - margins.bottom,
            };
        
        werk.dims.margins = margins;
        werk.dims.svg = svg;
    },

    scales: function(werk){
        var svg = werk.dims.svg;
        werk.scales = {
            x: d3.scaleLinear()
                .range([0, svg.width]),
            y: d3.scaleLinear()
                .range([svg.height, 0]),
            color: function(d){return chartwerk.axes.color.range[0];},
        };
    },
    
    baseDomain:  function(werk){
        if (chartwerk.axes.base.min !== null && chartwerk.axes.base.max !== null) {
            werk.scales.x.domain(
                [chartwerk.axes.base.min, chartwerk.axes.base.max]
            );
        } else if (chartwerk.axes.base.min !== null) {
            werk.scales.x.domain(
                [chartwerk.axes.base.min, werk.dataDims.xMax ]
            );
        } else if (chartwerk.axes.base.max !== null) {
            werk.scales.x.domain(
                [werk.dataDims.xMin, chartwerk.axes.base.max]
            );
        } else {
            werk.scales.x.domain([werk.dataDims.xMin, werk.dataDims.xMax]);
        }
        
        werk.scales.x.nice();
    },

    valueDomain: function(werk){
        
        if (chartwerk.axes.value.min !== null && chartwerk.axes.value.max !== null) {
            werk.scales.y.domain(
                [chartwerk.axes.value.min, chartwerk.axes.value.max]
            );
        } else if (chartwerk.axes.value.min !== null) {
            werk.scales.y.domain(
                [chartwerk.axes.value.min, werk.dataDims.yMax ]
            );
        } else if (chartwerk.axes.value.max !== null) {
            werk.scales.y.domain(
                [werk.dataDims.yMin, chartwerk.axes.value.max]
            );
        } else {
            werk.scales.y.domain([werk.dataDims.yMin, werk.dataDims.yMax]);
        }
        
        werk.scales.y.nice();
    },

    axes: function(werk){
        werk.axes = {
          x: d3.axisBottom(werk.scales.x)
              .tickSizeInner(6)
              .tickSizeOuter(0)
              .tickPadding(3)
              .tickFormat( function(d){ 
                var formatter = werk.scales.x.tickFormat();
                if (d >= 0) {
                  return formatter(d) === '0' ? '0' : 
                  chartwerk.axes.base.prefix + formatter(d) + chartwerk.axes.base.suffix;
                } else {
                  return "-" + chartwerk.axes.base.prefix + formatter(Math.abs(d)) + chartwerk.axes.base.suffix;
                }
              }),
          y: d3.axisLeft(werk.scales.y)
              .tickSizeInner(-werk.dims.svg.width)
              .tickSizeOuter(0)
              .tickPadding(7)
              .tickFormat( function(d){ 
                var formatter = werk.scales.y.tickFormat();
                if (d >= 0) {
                  return formatter(d) === '0' ? '0' : 
                  chartwerk.axes.value.prefix + formatter(d) + chartwerk.axes.value.suffix;
                } else {
                  return "-" + chartwerk.axes.value.prefix + formatter(Math.abs(d)) + chartwerk.axes.value.suffix;
                }
              }),
        };
    },

    baseTicks: function(werk){
        var s = chartwerk.ui.size;
        if (chartwerk.axes.base.format[s].customTicks.length > 0) { 
            werk.axes.x.tickValues(
                chartwerk.axes.base.format[s].customTicks
            );
        } else {
            werk.axes.x.ticks(
              chartwerk.axes.base.format[s].ticks
            );
        }
    },

    valueTicks: function(werk){
        var s = chartwerk.ui.size;
        if (chartwerk.axes.value.format[s].customTicks.length > 0) { 
            werk.axes.y.tickValues(
                chartwerk.axes.value.format[s].customTicks
            );
        } else {
            werk.axes.y.ticks(
              chartwerk.axes.value.format[s].ticks
            );
        }
    },

    // Build dims, scales and axes.
    build: function(werk){
        this.parse(werk);
        this.dims(werk);
        this.scales(werk);
        this.baseDomain(werk);
        this.valueDomain(werk);
        this.axes(werk);
        this.baseTicks(werk);
        this.valueTicks(werk);
        return werk;
    },
};