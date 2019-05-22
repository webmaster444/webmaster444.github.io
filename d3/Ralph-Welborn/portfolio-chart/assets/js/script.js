var wrapperWidth = $("#chart_wrapper").width(),
    wrapperHeight = 800;

var margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
};

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

function sumByValue(d) {
    return d.value;
}

var x = d3.scaleLinear().range([0, width]);
var x_axis = d3.axisBottom(x);

d3.csv("assets/changed-data.csv").then(function(data) {
    var businessUnitData = d3.nest()
        .key(function(d) {
            return d['Business Unit'];
        })
        .rollup(function(v) {
            return d3.sum(v, function(d) {
                return d['Cost'];
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

    var units_g = svg.selectAll('.unit_g').data(businessUnitData).enter().append('g').attr('class', (d, i) => 'unit_g unit_' + i).attr('transform', (d) => "translate(" + x(d.startX) + ",0)");
    units_g.append('rect').attr('x', 0).attr("width", (d) => x(d.value)).attr("y", -50).attr("height", 50)
    // .attr('fill', (d)=>color(d.key))
    .attr('fill', 'black')
    .attr('fill-opacity', 0.7);
    units_g.append('text').attr("x", 10).attr('y', -20).text((d) => d.key).attr("fill", 'white');

    businessUnitData.forEach(function(d, i) {
        console.log(d);
        var newData = data.filter(function(datum) {
            return datum['Business Unit'] == d.key
        });

        var departmentData = d3.nest()
            .key(function(d) {
                return d['Department'];
            })
            .rollup(function(v) {
                return d3.sum(v, function(d) {
                    return d['Cost'];
                });
            })
            .entries(newData);

        var newObj = new Object;
        newObj['name'] = d.key;
        newObj['children'] = departmentData;

        console.log(newObj);
        var root = d3.hierarchy(newObj)
            .eachBefore(function(d) {
                d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
            })
            .sum(sumByValue)
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
                return d.data.key ;
            });

        cell.append("title")
            .text(function(d) {
                return d.data.key + "\n" + format(d.value);
            });
    })
})