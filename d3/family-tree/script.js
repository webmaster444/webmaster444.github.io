var colorArray = {
    "mother": "#ffe3fa",
    "father": "#cfe5fb"
};

var marriedCircleWidth = 20, marriedTextFontSize = 12;
var fontSizeArray = [15,15,14,13,12,11,10,8];
var marriedFontSizeArray = [12,12,12,10,10,9,9,8];

var width = 1000,
    height = 1000,
    radius = 50 * Math.max(width, height) / 100,
    x = d3.scaleLinear().range([0, 2 * Math.PI]),
    y = d3.scalePow().exponent(1.3).domain([0, 1]).range([0, radius]),
    // y = d3.scaleLinear().domain([0,1]).range([0,radius]);
    padding = 5;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2)
    .append("g")
    .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

var partition = d3.partition();
    // .value(function(d) {
    //     return 50; //d.appropriation14;
    // });

var arc = d3.arc()
    .startAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
    })
    .endAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
    })
    .innerRadius(function(d) {
        return Math.max(0, y(d.y0)) + marriedCircleWidth;
    })
    .outerRadius(function(d) {
        return Math.max(0, y(d.y1));
    });

const middleArcLine = d => {
    const halfPi = Math.PI/2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw

    if (invertDirection) { angles.reverse(); }

    const path = d3.path();

    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
};

const middleMarriedArcLine = d => {
    if(d.children){
        const halfPi = Math.PI/2;
        const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];        

        const r = (Math.max(0, y(d.children[1].y0)) + marriedCircleWidth + Math.max(0, y(d.y1)) ) /2 + 3;

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
        if (invertDirection) { angles.reverse(); }        
        const path = d3.path();
        path.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path.toString();
    }     
    return "";
};


var married_arc = d3.arc()
    .startAngle(function(d) {   
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
    })
    .endAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
    })
    .innerRadius(function(d) {        
        return Math.max(0, y(d.children[1].y0)) + marriedCircleWidth;
    })
    .outerRadius(function(d) {
        return Math.max(0, y(d.y1));         
    });

var minY = 0;
var maxY = 2;

var currentdepth = 0;
var currentobject = 0;
var currentid = 0;
var rootobject = 0;


function updateGraph(path) {
    d3.json("fulldata.json", function(data) {
        var tree_data = makeTreeData(data);
        buildGraph(tree_data);
    })
}

function buildGraph(jsondata) {    
    // root = partition(jsondata);
    var root = d3.hierarchy(jsondata);
    root.sum(function(d){return d.children ? 0 : 1;});

    svg.selectAll("path.married-arc")
    .data(partition(root).descendants().filter(function(d){        
        return d.depth < root.height;}))
        .enter()
        .append("path")
        .attr('attr-depth',(d)=>d.depth)
        .attr('class','married-arc')        
        .attr("d", married_arc)
        .style("fill", "#eee");

    var inner_arc_wrapper = svg.selectAll(".inner_arc_wrapper")
        .data(partition(root).descendants().filter(function(d){return d.height > 3;}))
        // .data(partition(root).descendants())
        .enter().append('g').attr('class','inner_arc_wrapper');

    inner_arc_wrapper
        .append("path")
        .attr('class','main-arc')
        .attr("id", function(d, i) {
            if (i == 0) {
                rootobject = d;
            }
            if (d.id == currentid) {
                currentobject = d;
            }
            return "path-" + i;
        }).style("fill", function(d) {
            if (d.data.gender == "root") {
                return "white";
            }
            return colorArray[d.data.gender];
        })
        .attr("d", arc)
        .attr("fill-rule", "evenodd");

    inner_arc_wrapper.append('path')
        .attr('class', 'hidden-arc')
        .attr('id', (_, i) => `hiddenArc${i}`)
        .attr('d', middleArcLine);

    inner_arc_wrapper.append('path')
        .attr('class', 'hidden-married-arc')
        .attr('id', (_, i) => `hiddenMarriedArc${i}`)
        .attr('d', middleMarriedArcLine);

    let textInfo = inner_arc_wrapper.append('text').style('font-size',d=>{ return fontSizeArray[d.depth]})
    // Add white contour
    textInfo.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
        .text(d => d.data.name)
        .style('fill', 'none');

    textInfo.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
        .text(d => d.data.name);

    let marriedInfo = inner_arc_wrapper.append('text').attr('class','married-info-text').style('font-size',d=>{return marriedFontSizeArray[d.depth]})
    // Add white contour
    // marriedInfo.append('textPath')
    //     .attr('startOffset','50%')
    //     .attr('xlink:href', (_, i) => `#hiddenMarriedArc${i}` )
    //     .text(d=>d.data.married)
    //     .style('fill', 'none');

    marriedInfo.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#hiddenMarriedArc${i}` )
        .text(d => d.data.married);


    // // Outer 4 circles
    var outer_arc_wrapper = svg.selectAll(".outer_arc_wrapper")
        .data(partition(root).descendants().filter(function(d){return d.height <= 3;}))
        .enter().append('g').attr('class','outer_arc_wrapper');

    outer_arc_wrapper
        .append("path")
        .attr('class','main-arc')
        .attr("id", function(d, i) {
            if (i == 0) {
                rootobject = d;
            }
            if (d.id == currentid) {
                currentobject = d;
            }
            return "path-" + i;
        }).style("fill", function(d) {
            if (d.data.gender == "root") {
                return "white";
            }
            return colorArray[d.data.gender];
        })
        .attr("d", arc)

    // outer_arc_wrapper.append('path')
    //     .attr('class', 'hidden-arc')
    //     .attr('id', (_, i) => `outerhiddenArc${i}`)
    //     .attr('d', middleArcLine);

    outer_arc_wrapper.append('path')
        .attr('class', 'hidden-married-arc')
        .attr('id', (_, i) => `outerhiddenMarriedArc${i}`)
        .attr('d', middleMarriedArcLine);

    // outertextInfo = outer_arc_wrapper.append('text').style('font-size',d=>{ return fontSizeArray[d.depth]})
    // // Add white contour
    // outertextInfo.append('textPath')
    //     .attr('startOffset','50%')
    //     .attr('xlink:href', (_, i) => `#outerhiddenArc${i}` )
    //     .text(d => d.data.name)
    //     .style('fill', 'none');

    // outertextInfo.append('textPath')
    //     .attr('startOffset','50%')
    //     .attr('xlink:href', (_, i) => `#outerhiddenArc${i}` )
    //     .text(d => d.data.name);

    outermarriedInfo = outer_arc_wrapper.append('text').attr('class','married-info-text').style('font-size',d=>{return marriedFontSizeArray[d.depth]});
    // Add white contour
    // outermarriedInfo.append('textPath')
    //     .attr('startOffset','50%')
    //     .attr('xlink:href', (_, i) => `#outerhiddenMarriedArc${i+4}` )
    //     .text(d=>d.data.married)
    //     .style('fill', 'none');

    outermarriedInfo.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#outerhiddenMarriedArc${i}` )
        .text(d => d.data.married);

    // //add text
    var text = svg.selectAll("text.out")
        .data(partition(root).descendants().filter(function(d){return d.height <=3;}));

    var textEnter = text
        .enter()
        .append("text")
        .attr('class','out')
        //starting opacity
        //hides all those but the inner ring
        .style("pointer-events", "none")
        //color fill
        //#000000 is black
        .style("font-size", d=>{return fontSizeArray[d.depth]})
        .style("fill", "#000000")
        .attr("text-anchor", function(d) {
            return x(d.x1 / 2) > Math.PI ? "end" : "start";
        })

        .attr("dy", ".2em")
        //checks for multiline names
        .attr("transform", function(d) {
            var multiline = (d.data.name || "")
                .split(" ")
                .length > 1.5,
                // angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                angle = x(d.x0 + (d.x1 - d.x0) / 2) * 180 / Math.PI - 90,
                rotate = angle + (multiline ? -.5 : 0);
                
            return "rotate(" + rotate + ")translate(" + (y(d.y0) + 2*marriedCircleWidth + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
        })

    //1st row of text
    textEnter
        .append("tspan")
        .attr("x", 0)
        .text(function(d) {
            txt = d.data.name.split(" ");
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
            txt = d.data.name.split(" ");
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
            txt = d.data.name.split(" ");
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
            txt = d.data.name.split(" ");
            for (var i = txt.length - 1; i >= 0; i--) {
                if (txt[i].length < 4 && i != 0) {
                    txt[i - 1] += txt[i];
                    txt.splice(i, 1);
                }

            }
            return d.depth ? txt[3] || "" : "";
        });

    // var g_wrapper = svg.selectAll('.g_wrapper').data(partition.nodes(root)).enter().append('g').attr('class','g_wrapper');
    
}

window.onload = function() {
    updateGraph();
}

function makeTreeData(data) {
    let res = insertData(data);
    return res;
}

function insertData(data, gender = "root") {
    let res = {};
    let tmp = {};
    tmp.name = data.first + " " + data.last;
    tmp.birth = data.birth;
    tmp.gender = gender;
    if(Object.keys(data).includes('parents')){    
        tmp.children = [];
        tmp.children.push(insertData(data.parents.mother, "mother"));
        tmp.children.push(insertData(data.parents.father, "father"));
        tmp.married = data.parents.married;
    }
    res = tmp;
    return res;
}