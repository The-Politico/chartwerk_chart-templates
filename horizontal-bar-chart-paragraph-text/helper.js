var werkHelper = {
    parse: function(werk){
        
        werk.data = chartwerk.data.map(function(d){
            return {
                name: d[chartwerk.datamap.base],
                value: d[chartwerk.datamap.value]
            };
        })
        .sort(function(a, b){ return d3.descending(a.value, b.value); });
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
            div = {
                width: w - margins.left - margins.right,
                height: h - margins.top - margins.bottom
            };
        
        werk.dims.margins = margins;
        werk.dims.div = div;
    },

    scales: function(werk){
        var div = werk.dims.div;
        werk.scales = {
            x: d3.scaleLinear()
                .range([0, div.width]),
        };
    },
    

    valueDomain: function(werk){
        var max = d3.max(werk.data, function(d) { 
                return d.value; 
            });
        
        if (chartwerk.axes.value.min && chartwerk.axes.value.max) {
            werk.scales.x.domain(
                [chartwerk.axes.value.min, chartwerk.axes.value.max]
            );
        } else if (chartwerk.axes.value.min) {
            werk.scales.x.domain(
                [chartwerk.axes.value.min, max ]
            );
        } else if (chartwerk.axes.value.max) {
            werk.scales.x.domain(
                [0, chartwerk.axes.value.max]
            );
        } else {
            werk.scales.x.domain([0, max]);
        }
        
        werk.scales.x.nice();
    },


    // Build dims, scales and axes.
    build: function(werk){
        this.parse(werk);
        this.dims(werk);
        this.scales(werk);
        this.valueDomain(werk);
        return werk;
    },
};