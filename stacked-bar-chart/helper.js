var werkHelper = {
    parse: function(werk){
        if (chartwerk.datamap.base === null) {
            // If the chart doesn't have a base axis, raise an error.
        } else {
            // Otherwise, parse the data as passed.
            werk.data = chartwerk.axes.color.domain.map(function(category){
                return {
                    name: category,
                    values: chartwerk.data.map(function(d){
                        return { x: d[chartwerk.datamap.base], y: d[category] };
                    })
                    .sort(function(a, b){ return d3.ascending(a.x, b.x); })
                };
            });
        }
    },
    
    dims: function(werk){
        var s = chartwerk.ui.size;
            w = werk.dims[s].width,
            h = werk.dims[s].height,

            margins = {
                right: chartwerk.margins[s].right * w,
                left: chartwerk.margins[s].left * w,
                top: chartwerk.margins[s].top * h,
                bottom: chartwerk.margins[s].bottom * h
            },
            svg = {
                width: w - margins.left - margins.right,
                height: h - margins.top - margins.bottom
            };

        werk.dims.margins = margins;
        werk.dims.svg = svg;
    },

    scales: function(werk){
        var svg = werk.dims.svg;

        werk.scales = {
            x0: d3.scaleBand()
                    .rangeRound([0, svg.width]),
            x1: d3.scaleBand()
                    .padding(0.05),
            y: d3.scaleLinear()
                    .rangeRound([svg.height, 0]),
            color: chartwerk.axes.color.range.length > 1 ? (
                d3.scaleOrdinal()
                  .domain(chartwerk.axes.color.domain)
                  .range(chartwerk.axes.color.range)
            ) : (
                function(d) { return chartwerk.axes.color.range[0]; }
            ),
        };
    },

    baseDomain:  function(werk) {
        var keys = chartwerk.axes.color.domain.sort();

        werk.scales.x0.domain(
            chartwerk.data.map(
                function(dataPoint) { return dataPoint[chartwerk.datamap.base]; }
            ).sort()
        );
        werk.scales.x1.domain(keys).rangeRound([0, werk.scales.x0.bandwidth()]);
    },

    valueDomain: function(werk) {
        var keys = chartwerk.axes.color.domain.sort();

        var useDefaultMin = (
            (chartwerk.axes.value.min !== null) &&
            (!isNaN(chartwerk.axes.value.min))
        );

        var dataMin = (useDefaultMin) ? (chartwerk.axes.value.min) : (
            d3.min(chartwerk.data, function(d) {
                return d3.min(keys, function(key) { return d[key]; });
            })
        );

        if ((!useDefaultMin) && (dataMin > 0)) { dataMin = 0; }

        var useDefaultMax = (
            (chartwerk.axes.value.max !== null) &&
            (!isNaN(chartwerk.axes.value.max))
        );

        var dataMax = (useDefaultMax) ? (chartwerk.axes.value.max) : (
            d3.max(chartwerk.data, function(d) {
                return d3.max(keys, function(key) { return d[key]; });
            })
        );

        var extents = {
            min: dataMin,
            max: dataMax
        };

        werk.scales.y.domain([extents.min, extents.max]).nice();
    },

    axes: function(werk) {
        werk.axes = {
            x: d3.axisBottom(werk.scales.x0)
                    .tickSizeInner(6)
                    .tickSizeOuter(0)
                    .tickPadding(3),

            y: d3.axisLeft(werk.scales.y)
                    .tickSizeInner(-werk.dims.svg.width)
                    .tickSizeOuter(0)
                    .tickPadding(7)
                    .tickFormat( function(d){ 
                        var formatter = werk.scales.y.tickFormat();
                        if (d >= 0) {
                            return formatter(d) === '0' ? '0' : (
                                chartwerk.axes.value.prefix +
                                formatter(d) +
                                chartwerk.axes.value.suffix
                            );
                        } else {
                            return (
                                '-' +
                                chartwerk.axes.value.prefix +
                                formatter(Math.abs(d)) +
                                chartwerk.axes.value.suffix
                            );
                        }
                    }),
        };
    },

    valueTicks: function(werk){
        var s = chartwerk.ui.size;

        if (chartwerk.axes.value.format[s].customTicks.length > 0) { 
            werk.axes.y.tickValues(
                chartwerk.axes.value.format[s].customTicks
            );
        } else {
            hasTickConfig = (
                chartwerk.axes.value.format[s].ticks !== null
            ) && (
                !isNaN(chartwerk.axes.value.format[s].ticks)
            );

            if (hasTickConfig) {
                werk.axes.y.ticks(
                    chartwerk.axes.value.format[s].ticks
                );
            }
        }
    },

    highlightZero: function(werk) {
        var keys = chartwerk.axes.color.domain.sort();

        var dataMin = (
            (chartwerk.axes.value.min !== null) &&
            (!isNaN(chartwerk.axes.value.min))
        ) ? (
            chartwerk.axes.value.min
        ) : (
            d3.min(chartwerk.data, function(d) {
                return d3.min(keys, function(key) { return d[key]; });
            })
        );

        werk.highlightZeroLine = (dataMin < 0);
    },

    // Build dims, scales and axes.
    build: function(werk){
        this.parse(werk);
        this.dims(werk);
        this.scales(werk);
        this.baseDomain(werk);
        this.valueDomain(werk);
        this.axes(werk);
        this.valueTicks(werk);
        this.highlightZero(werk);
        return werk;
    },
};