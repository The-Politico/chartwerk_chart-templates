function draw(){
    var map = window.StateGridMap();
    map.create('#chart', chartwerk.data, {
        'column': 'federal'
    });
}