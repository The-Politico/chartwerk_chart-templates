var werkHelper = {
    parse: function(werk){
        werk.parsers = {
          base: function(d){ return +d; },
          value: function(d){ return +d; }
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
	        yMin = d3.min(werk.data, function(d){return d.y; });
        
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
        werk.scales.voronoi = d3.voronoi()
            .x(function(d){ return werk.scales.x(d.x); })
            .y(function(d){ return werk.scales.y(d.y); })
            .size([svg.width, svg.height]);
    },
    
    baseDomain:  function(werk){
        var domain = [werk.dataDims.xMin, werk.dataDims.xMax];
        var base = chartwerk.axes.base;
        
        switch (isNaN(base.min) || base.min) {
            case true:
            case null:
            case '':
                break;
            default:
                domain.splice(0, 1, base.min);
        }
        switch (isNaN(base.max) || base.max) {
            case null:
            case true:
            case '':
                break;
            default:
                domain.splice(1, 1, base.max);
        }

        werk.scales.x
            .domain(domain)
            .nice();
    },

    valueDomain: function(werk){
        var domain = [werk.dataDims.yMin, werk.dataDims.yMax];
        var value = chartwerk.axes.value;
        
        switch (isNaN(value.min) || value.min) {
            case true:
            case null:
            case '':
                break;
            default:
                domain.splice(0, 1, value.min);
        }
        switch (isNaN(value.max) || value.max) {
            case null:
            case true:
            case '':
                break;
            default:
                domain.splice(1, 1, value.max);
        }

        werk.scales.y
            .domain(domain)
            .nice();
    },

    axes: function(werk){
        werk.axes = {
          x: d3.axisBottom(werk.scales.x)
              .tickSizeInner(-werk.dims.svg.height)
              .tickSizeOuter(0)
              .tickPadding(7)
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