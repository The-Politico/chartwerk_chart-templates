function draw(){
    var map = window.StateGridMap();
    
    map.create('#chart', chartwerk.data, {
        'column': chartwerk.datamap.scale,
        'colorRange': chartwerk.axes.color.range,
        'colorDomain': chartwerk.axes.color.domain,
        'stateColumn': chartwerk.datamap.base,
        'isNumeric': chartwerk.axes.color.quantize,
        'size': chartwerk.ui.size,
    });
    
    window.addEventListener('resize', function() {
       map.resize(); 
    });
}