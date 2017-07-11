var werkHelper = {
    parse: function(werk){
        werk.parsers = {
          base: d3.timeParse( chartwerk.axes.base.dateFormat ),
          value: function(d){ return d === '' ? NaN : +d; }
        };
        
        werk.data = chartwerk.axes.color.domain.map(function(category){
            return {
                name: category,
                values: chartwerk.data.map(function(d){
                    return {
                        x: werk.parsers.base(
                            String(d[chartwerk.datamap.base])
                        ),
                        y: werk.parsers.value(d[category])
                    };
                })
                .sort(function(a, b){ return d3.ascending(a.x, b.x); })
            };
        });
        
        // Get max and min of data 
        var xMax = d3.max(werk.data,function(series){return d3.max(series.values,function(d){return d.x; }); }),
	        xMin = d3.min(werk.data,function(series){return d3.min(series.values,function(d){return d.x; }); }),
	        yMax = d3.max(werk.data,function(series){return d3.max(series.values,function(d){return d.y; }); }),
	        yMin = d3.min(werk.data,function(series){return d3.min(series.values,function(d){return d.y; }); });
        
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
            x: d3.scaleTime()
                .range([0, svg.width]),
            y: d3.scaleLinear()
                .range([svg.height, 0]),
            color: chartwerk.axes.color.range.length > 1 ? 
                d3.scaleOrdinal()
                  .domain(chartwerk.axes.color.domain)
                  .range(chartwerk.axes.color.range) 
            :   function(d){return chartwerk.axes.color.range[0];},
        };
    },
    
    baseDomain:  function(werk){
        var xMax = d3.max(werk.data, function(category) {
                return d3.max(category.values, function(d){
                    return d.x; 
                }); 
            }),
            xMin = d3.min(werk.data, function(category) { 
                return d3.min(category.values, function(d){ 
                    return d.x;
                });
            });
        werk.scales.x.domain([xMin, xMax]);
    },

    valueDomain: function(werk){
        var yMax = d3.max(werk.data, function(category) { 
                return d3.max(category.values, function(d){ 
                    return d.y; 
                }); 
            }),
            yMin = d3.min(werk.data, function(category) {
                return d3.min(category.values, function(d){ 
                    return d.y; 
                }); 
            });
        
        if (chartwerk.axes.value.min && chartwerk.axes.value.max) {
            werk.scales.y.domain(
                [chartwerk.axes.value.min, chartwerk.axes.value.max]
            );
        } else if (chartwerk.axes.value.min) {
            werk.scales.y.domain(
                [chartwerk.axes.value.min, yMax ]
            );
        } else if (chartwerk.axes.value.max) {
            werk.scales.y.domain(
                [yMin, chartwerk.axes.value.max]
            );
        } else {
            werk.scales.y.domain([yMin, yMax]);
        }
        
        werk.scales.y.nice();
    },

    axes: function(werk){
        werk.axes = {
          x: d3.axisBottom(werk.scales.x)
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
                  return formatter(d) === '0' ? '0' : 
                  chartwerk.axes.value.prefix + formatter(d) + chartwerk.axes.value.suffix;
                } else {
                  return "-" + chartwerk.axes.value.prefix + formatter(Math.abs(d)) + chartwerk.axes.value.suffix;
                }
              }),
        };
    },

    baseTicks: function(werk){
        if (chartwerk.axes.base.type !== 'date') {
            return;
        }
        
        // Abstract this to a separate file once formats settled.
        var customLocale = {
          "dateTime": "%x, %X",
          "date": "%-m/%-d/%Y",
          "time": "%-I:%M:%S %p",
          "periods": ["AM", "PM"],
          "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "shortDays": ["S", "M", "T", "W", "T", "F", "S"],
          "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }
        
        d3.timeFormatDefaultLocale(customLocale);
        
        
        var formatMillisecond = d3.timeFormat(".%L"),
            formatSecond = d3.timeFormat(":%S"),
            formatMinute = d3.timeFormat("%I:%M"),
            formatHour = d3.timeFormat("%I %p"),
            formatDay = d3.timeFormat("%a %d"),
            formatWeek = d3.timeFormat("%b %d"),
            formatMonth = d3.timeFormat("%B"),
            formatYear = d3.timeFormat("%Y");
        
        
        var s = chartwerk.ui.size;
        var dateTick;
        switch(chartwerk.axes.base.format[s].dateString) {
            case 'Y':
                dateTick = d3.timeYear;
                formatYear = d3.timeFormat("%Y");
                break;
            case 'y':
                dateTick = d3.timeYear;
                formatYear = d3.timeFormat("'%y");
                break;
            case 'M':
                dateTick = d3.timeMonth;
                formatMonth = d3.timeFormat("%B");
                formatYear = d3.timeFormat("Jan. '%y");
                break;
            case 'm':
                dateTick = d3.timeMonth;
                formatMonth = d3.timeFormat("%b.");
                formatYear = d3.timeFormat("J/%y");
                break;
            case 'W':
            case 'w':
                dateTick = d3.timeWeek;
                formatMonth = d3.timeFormat("%b.");
                formatYear = d3.timeFormat("J/%y");
                break;
            case 'D':
                dateTick = d3.timeDay;
                formatMonth = d3.timeFormat("%b.");
                formatYear = d3.timeFormat("J/%y");
        }
        
        function multiFormat(date) {
          return (d3.timeSecond(date) < date ? formatMillisecond
              : d3.timeMinute(date) < date ? formatSecond
              : d3.timeHour(date) < date ? formatMinute
              : d3.timeDay(date) < date ? formatHour
              : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
              : d3.timeYear(date) < date ? formatMonth
              : formatYear)(date);
        }
        
        werk.axes.x.tickFormat(multiFormat)
        
        werk.axes.x.ticks(
            dateTick.every( chartwerk.axes.base.format[s].frequency )
        );
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