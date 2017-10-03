function draw(){
    var map = window.StateGridMap();
    map.create('#chart', chartwerk.data, {
        'column': chartwerk.datamap.scale,
        'colorScale': chartwerk.axes.color.range,
        'legendItems': chartwerk.axes.color.domain,
        'stateColumn': chartwerk.datamap.base
    });
}