function draw(){

    var keys = chartwerk.datamap.sort;
    
    var table = d3.select("#chart")
        .append("div")
        .attr("id","table")
        .append("table");
    
    var thead = table.append("thead");
    
    keys.forEach(function(k){
        thead.append("th")
            .attr("class", "sort")
            .attr("data-sort", k)
            .text(k);
    });
    
    var tbody = table.append("tbody")
            .attr("class", "list");
    
    chartwerk.data.forEach(function(d){
        var tr = tbody.append("tr");
        keys.forEach(function(k){
            tr.append("td")
                .attr("class", "td "+ k)
                .text(d[k]);
        });
    });
    
    var tableOptions = {
      valueNames: keys
    };

    var tableList = new List('table', tableOptions);
    
    // List
    
    var list = d3.select("#chart")
        .append("div")
        .attr("id","list")
        .attr("class","hidden");
    
    list.append("ul")
        .attr("class", "list");
    
    paras = keys.map(function(k){
        return '<p><span class="list-hed">'+k+'</span> <span class="'+k+'"></span></p>';
    }).join('');
    
    var listOptions = {
      valueNames: keys,
      item: '<li>'+paras+'</li>'
    };
    
    var listList = new List('list', listOptions, chartwerk.data);
    
    function switchStyle(){
        if($("#chart").width() < $("#table")[0].scrollWidth){
            $("#table").addClass("hidden");
            $("#list").removeClass("hidden");
        }
    }
    setTimeout(function(){
        switchStyle();
    }, 100);
    

}