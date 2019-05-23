var wrapperWidth = $("#chart_wrapper").width(),
    wrapperHeight = 800;

var margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
};

var optionData,csvData;
var width = wrapperWidth - margin.left - margin.right;
var height = wrapperHeight - margin.top - margin.bottom;
var svg = d3.select("#chart_wrapper").append('svg').attr("width", wrapperWidth).attr("height", wrapperHeight).append("g").attr("transform", 'translate('+margin.left+',' + margin.top + ')')
var fader = function(color) {
        return d3.interpolateRgb(color, "#fff")(0.2);
    },
    color = d3.scaleOrdinal(d3.schemeCategory10.map(fader)),
    format = d3.format(",d");

var treemap = d3.treemap()
    .padding(1)
    .round(true);

function sumByCost(d) {
    return d['Cost'];
}

function sumByTime(d) {
    return d['Time'];
}

var x = d3.scaleLinear().range([0, width]);
var x_axis = d3.axisBottom(x);
d3.csv("assets/changed-data.csv").then(function(data) {
d3.json("assets/filter-data.json").then(function(option){

    csvData = data;
    optionData = option;

    var viewby = $("input[name='viewby']:checked").val();


    viewBySelectUpdate();

    var filters = option.filters.map(function(d){return d.name});

    filters.forEach(function(opt){
        var html = '<option value="'+opt+'">'+opt+'</option>';
        $("#filterbySelect").append(html);
    })


    getSubFilters();
    selectOne("filter");

    getColorGroups();
    var newData = getData(viewby, $("#viewBySelect").val(), data);

    getTags(newData);
    drawChart(viewby, 'Cost', $("#viewBySelect").val(), newData);
})
})

function getData(viewby, viewValue, data){
    return data.filter(function(d){return d[viewby] == viewValue});
}

function drawChart(viewby, sizeby, viewValue, data){
    var businessUnitData = d3.nest()
        .key(function(d) {
            return d["Department"];
        })
        .rollup(function(v) {
            return d3.sum(v, function(d) {
                return d[sizeby];
            });
        })
        .entries(data);

    x.domain([0, d3.sum(businessUnitData, function(d) {
        return d.value
    })]);

    businessUnitData.forEach(function(u, i) {
        var x = 0;
        for (var j = 0; j < i; j++) {
            x += businessUnitData[j]['value'];
        }

        u.startX = x;
    })

    svg.html('');

    var units_g = svg.selectAll('.unit_g').data(businessUnitData).enter().append('g').attr('class', (d, i) => 'unit_g unit_' + i).attr('transform', (d) => "translate(" + x(d.startX) + ",0)");
    units_g.append('rect').attr('x', 0).attr("width", (d) => x(d.value)).attr("y", -50).attr("height", 50)
    // .attr('fill', (d)=>color(d.key))
    .attr('fill', 'black')
    .attr('fill-opacity', 0.7);
    units_g.append('text').attr("x", 10).attr('y', -20).text((d) => d.key).attr("fill", 'white');

    businessUnitData.forEach(function(d, i) {
        
        var newData = data.filter(function(datum) {
            return datum['Department'] == d.key
        });

        var departmentData = d3.nest()
            .key(function(d) {
                return d['Department'];
            })
            .entries(newData);        

        var newObj = new Object;
        newObj['name'] = d.key;
        newObj['children'] = departmentData[0].values;
        
        var root = d3.hierarchy(newObj)
            .eachBefore(function(d) {
                d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
            })
            .sum(sumByCost)
            .sort(function(a, b) {                
                return b.height - a.height || b.value - a.value;
            });

        treemap.size([x(d.value), height]);
        treemap(root);

        var selectorEle = '.unit_' + i;

        var cell = d3.select(selectorEle).selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + d.x0 + "," + d.y0 + ")";
            });

        cell.append("rect")
            .attr("id", function(d) {
                return d.data.id;
            })
            .attr("width", function(d) {
                return d.x1 - d.x0;
            })
            .attr("height", function(d) {
                return d.y1 - d.y0;
            })
            .attr("fill", function(d) {
                return color(d.parent.data.id);
            });

        cell.append("clipPath")
            .attr("id", function(d) {
                return "clip-" + d.data.id.replace(/\s+/g, '-').toLowerCase();
            })
            .append("use")
            .attr("xlink:href", function(d) {
                return "#" + d.data.id;
            });

        cell.append("text")
            .attr("clip-path", function(d) {
                return "url(#clip-" + d.data.id.replace(/\s+/g, '-').toLowerCase() + ")";
            })
            .attr("x", (d) => (d.x1 - d.x0) / 2)
            .attr("y", (d) => (d.y1 - d.y0) / 2)
            .attr('text-anchor', 'middle')
            .text(function(d) {                
                return d.data.Capability ;
            });

        cell.append("title")
            .text(function(d) {
                return d.data.Capability + "\n" + format(d.value);
            });

    })
}

function selectOne(name){
    $('input[name="'+name + '"]').first().prop('checked',true);
}

function getTags(data){
    var tags = [];

    var tag = $("#tagsSelect").val();

    data.map(function(d){return d[tag]}).forEach(function(d){
        if(!tags.includes(d)){
            tags.push(d);
        }
    });

    $("#tags_section").html("");
    tags.forEach(function(t){
        var html = '<span class="tag">'+t+'</span>';
        $("#tags_section").append(html);
    })
}

function getColorGroups(){    
    var filterV = $("#filterbySelect").val();
    var subfilter = $("input[name='filter']:checked").val();
        
    var colorGroups = [];
    optionData.filters.forEach(function(opt){
        if(opt.name == filterV){
            opt.children.forEach(function(o){
                if(o.name == subfilter){
                    colorGroups = o.children;
                }
            })
        }
    });
    
    return colorGroups;
}

$(document).on('change','input[name="viewby"]',function(){
    viewBySelectUpdate();
    var newData = getData($("input[name='viewby']:checked").val(), $("#viewBySelect").val(), csvData);
    getTags(newData);
});

$(document).on('change','input[name="filter"]',function(){
    getColorGroups();
});

$(document).on('change','#viewBySelect',function(){
    var newData = getData($("input[name='viewby']:checked").val(), $("#viewBySelect").val(), csvData);
    drawChart($("input[name='viewby']:checked").val(), 'Cost', $("#viewBySelect").val(), newData);    
    getTags(newData);
});

$(document).on('change','#filterbySelect',function(){
    getSubFilters();
    selectOne("filter");
    getColorGroups();
});

function getSubFilters(){
    var selectedFilter = $("#filterbySelect").val();

    $("#filter_radio_section").html("");
    optionData.filters.forEach(function(opt){
        if(opt.name == selectedFilter){
            opt.children.map(function(o){return o.name}).forEach(function(n){
                var html = '<input type="radio" name="filter" value="'+n +'"/>' + n;
                $("#filter_radio_section").append(html);
            })
        }        
    })
}

function viewBySelectUpdate(){
    var viewby = $("input[name='viewby']:checked").val();    

    var viewbyOptions = [];

    csvData.map(function(d){return d[viewby]}).forEach(function(d){
        if(!viewbyOptions.includes(d)){
            viewbyOptions.push(d);
        }
    })
    $("#viewBySelect").html('');
    viewbyOptions.forEach(function(opt){
        var html = '<option value="'+opt+'">'+opt+'</option>';
        $("#viewBySelect").append(html);
    })
}