var werkHelper = {
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
                height: h + 2 - margins.top - margins.bottom
            };
        
        werk.dims.margins = margins;
        werk.dims.svg = svg;
    },
    
    scales: function(werk){
        var svg = werk.dims.svg;
        werk.scales = {
            color: chartwerk.axes.color.quantize ? 
                d3.scaleQuantize() : d3.scaleOrdinal(),
        };
        
        werk.scales.color
            .domain(chartwerk.axes.color.domain)
            .range(chartwerk.axes.color.range);
    },

    // Build dims, scales and axes.
    build: function(werk){
        this.dims(werk);
        this.scales(werk);
        return werk;
    },
};