function draw(){
    var map = window.StateGridMap();
    console.log(chartwerk.data);
    map.create('#chart', chartwerk.data, {
        'column': 'federal',
        'colorScale': chartwerk.axes.color.range,
        'legendItems': chartwerk.axes.color.domain,
        'stateColumn': chartwerk.datamap.ignore[0]
    });
}