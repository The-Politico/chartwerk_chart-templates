var werkHelper = {
    prototype: function() {
        d3.selection.prototype.moveToFront = function() {
          return this.each(function(){
            this.parentNode.appendChild(this);
          });
        };
    },
    
    slugify: function(text){
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },
    
    parse: function(werk){
        var slugify = this.slugify;
        werk.data = chartwerk.data.map(function(d){
            return {
                county: slugify(d[chartwerk.datamap.base]),
                value: d[chartwerk.datamap.scale],
                // value: chartwerk.axes.color.quantize ? 
                //     +d[chartwerk.datamap.scale] : d[chartwerk.datamap.scale],
                tooltip: chartwerk.datamap.custom.tooltip !== '' ?
                    d[chartwerk.datamap.custom.tooltip] : null,
            };
        });
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
            color: chartwerk.axes.color.quantize ? 
                d3.scaleThreshold() : d3.scaleOrdinal(),
        };
        
        werk.scales.color
            .domain(chartwerk.axes.color.domain)
            .range(chartwerk.axes.color.range);
    },

    // Build dims, scales and axes.
    build: function(werk){
        this.prototype();
        this.parse(werk);
        this.dims(werk);
        this.scales(werk);
        return werk;
    },
};

