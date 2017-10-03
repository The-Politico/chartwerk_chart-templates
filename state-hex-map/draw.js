function draw(){
    var map = window.StateGridMap();
    map.create('#chart', chartwerk.data, {
        'column': chartwerk.datamap.base,
        'colorScale': chartwerk.axes.color.range,
        'legendItems': chartwerk.axes.color.domain,
        'stateColumn': chartwerk.datamap.ignore[0]
    });
}