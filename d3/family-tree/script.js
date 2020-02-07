var colorArray = {
    "mother": "#ffe3fa",
    "father": "#cfe5fb"
};
var width = 1000,
    height = 1000,
    radius = 50 * Math.max(width, height) / 100,
    x = d3.scale.linear().range([0, 2 * Math.PI]),
    y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
    padding = 5;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2)
    .append("g")
    .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

var partition = d3.layout.partition()
    .value(function(d) {
        return 50; //d.appropriation14;
    });

var arc = d3.svg.arc()
    .startAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
    })

    .endAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
    })

    .innerRadius(function(d) {
        return Math.max(0, y(d.y));
    })

    .outerRadius(function(d) {
        return Math.max(0, y(d.y + d.dy));
    });


var minY = 0;
var maxY = 2;

var currentdepth = 0;
var currentobject = 0;
var currentid = 0;
var rootobject = 0;


function updateGraph(path) {
    d3.json("data.json", function(data) {
        var tree_data = makeTreeData(data);
        buildGraph(tree_data);
    })
}

function buildGraph(jsondata) {

    var root = jsondata;
    var path = svg.selectAll("path")
        .data(partition.nodes(root))
        .enter()
        .append("path")
        .attr("id", function(d, i) {
            if (i == 0) {
                rootobject = d;
            }
            if (d.id == currentid) {
                currentobject = d;
            }
            return "path-" + i;
        })

        .attr("d", arc)
        .attr("fill-rule", "evenodd");

    //add text
    var text = svg.selectAll("text")
        .data(partition.nodes(root));

    var textEnter = text
        .enter()
        .append("text")
        //starting opacity
        //hides all those but the inner ring
        .style("pointer-events", "none")
        //color fill
        //#000000 is black
        .style("font-size", "10px")
        .style("fill", "#000000")
        .attr("text-anchor", function(d) {
            return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
        })

        .attr("dy", ".2em")
        //checks for multiline names
        .attr("transform", function(d) {
            var multiline = (d.name || "")
                .split(" ")
                .length > 1.5,
                angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                rotate = angle + (multiline ? -.5 : 0);

            return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
        })

    //1st row of text
    textEnter
        .append("tspan")
        .attr("x", 0)
        .text(function(d) {
            txt = d.name.split(" ");
            for (var i = txt.length - 1; i >= 0; i--) {
                if (txt[i].length < 4 && i != 0) {
                    txt[i - 1] += txt[i];
                    txt.splice(i, 1);
                }

            }
            return d.depth ? txt[0] : "";
        });

    //2nd row of text
    textEnter
        .append("tspan")
        .attr("x", 0)
        .attr("dy", ".9em")
        .text(function(d) {
            txt = d.name.split(" ");
            for (var i = txt.length - 1; i >= 0; i--) {
                if (txt[i].length < 4 && i != 0) {
                    txt[i - 1] += txt[i];
                    txt.splice(i, 1);
                }

            }
            return d.depth ? txt[1] || "" : "";
        });

    //3rd row
    textEnter
        .append("tspan")
        .attr("x", 0)
        .attr("dy", ".9em")
        .text(function(d) {
            txt = d.name.split(" ");
            for (var i = txt.length - 1; i >= 0; i--) {
                if (txt[i].length < 4 && i != 0) {
                    txt[i - 1] += txt[i];
                    txt.splice(i, 1);
                }

            }
            return d.depth ? txt[2] || "" : "";
        });

    //fourth row (if necessary)
    textEnter
        .append("tspan")
        .attr("x", 0)
        .attr("dy", ".9em")
        .text(function(d) {
            txt = d.name.split(" ");
            for (var i = txt.length - 1; i >= 0; i--) {
                if (txt[i].length < 4 && i != 0) {
                    txt[i - 1] += txt[i];
                    txt.splice(i, 1);
                }

            }
            return d.depth ? txt[3] || "" : "";
        });

    d3.selectAll("text")
        .style("pointer-events", "none");

    d3.selectAll("path")
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) {
            if (d.gender == "root") {
                return "white";
            }
            return colorArray[d.gender];
        })
}

window.onload = function() {
    updateGraph("index2.json");
}

function makeTreeData(data) {
    let res = insertData(data);
    return res;
}

function insertData(data, gender = "root") {
    let res = {};
    let tmp = {};
    tmp.name = data.first + " " + data.last;
    tmp.gender = gender;
    if (Object.keys(data.parents).length != 0) {
        tmp.children = [];
        tmp.children.push(insertData(data.parents.mother, "mother"));
        tmp.children.push(insertData(data.parents.father, "father"));
    }
    res = tmp;
    return res;
}