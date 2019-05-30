var chart_wrapper = d3.select("#d3chart");
var wrapperWidth = $("#d3chart").width(),
    height = $("#d3chart").height(),
    margin = {
        left: 50,
        right: 350,
        top: 100,
        bottom: 70
    };
var width = wrapperWidth - margin.left - margin.right;
var lineFunction = d3.line()
    .x(function(d) {
        return d[0];
    })
    .y(function(d) {
        return d[1];
    })

function drawChartfromJson(data) {
    var jsonData = JSON.parse(data);

    var array = jsonData.bb.split(',');
    array[2] = parseFloat(array[2]) + 10;
    array[3] = parseFloat(array[3]) + 30;

    var newviewBox = array.join(' ');
    chart_wrapper.html('');
    var svg = chart_wrapper.append('svg')
        .attr("width", wrapperWidth)
        .attr('height', height)
        .attr("viewBox", newviewBox)
        .append('g').attr("transform", "translate(0, 15)")

    var node = svg.selectAll('g.node').data(jsonData.objects).enter().append('g').attr('class', d => 'node ' + d.type);



    d3.selectAll(".node.FMZ")
        .append('rect').attr('x', (d) => {
            return d._draw_[1].rect[0] - d._draw_[1].rect[2];
        }).attr('y', (d) => {
            return d._draw_[1].rect[1] - d._draw_[1].rect[3];
        }).attr('width', (d) => {
            return 2 * d._draw_[1].rect[2];
        }).attr('height', (d) => {
            return 2 * d._draw_[1].rect[3];
        }).attr("fill", "white").attr("stroke", "black");

    d3.selectAll(".node.WTW")
        .append("svg:image")
        .attr('x', d=>d._draw_[1].rect[0] - d._draw_[1].rect[2])
        .attr('y', d=>d._draw_[1].rect[1] - d._draw_[1].rect[3])
        .attr('width', d=>d._draw_[1].rect[2] * 2)
        .attr('height', d=>d._draw_[1].rect[2])
        .attr("xlink:href", "images/WTW.png");        

    d3.selectAll(".node.SRES")
            .append("svg:image")
        .attr('x', d=>d._draw_[1].rect[0] - d._draw_[1].rect[2] )
        .attr('y', d=>d._draw_[1].rect[1] - d._draw_[1].rect[3])
        .attr('width', d=>d._draw_[1].rect[2] * 2)
        .attr('height', d=>d._draw_[1].rect[2])
        .attr("xlink:href", "images/SRES.png");  

    d3.selectAll(".node.WPS")
            .append("svg:image")
        .attr('x', d=>d._draw_[1].rect[0] - d._draw_[1].rect[2] * 2)
        .attr('y', d=>d._draw_[1].rect[1])
        .attr('width', d=>d._draw_[1].rect[2] * 2)
        .attr('height', d=>d._draw_[1].rect[2])
        .attr("xlink:href", "images/WPS.png");

        // .append('polygon').attr("points", d => {
        //     var pointsA = [];
        //     var x = d._draw_[1].rect[0] - d._draw_[1].rect[2];
        //     var y = d._draw_[1].rect[1] - d._draw_[1].rect[3];
        //     var tmp1 = [],
        //         tmp2 = [],
        //         tmp3 = [],
        //         tmp4 = [],
        //         tmp5 = [];
        //     tmp1.push(x);
        //     tmp1.push(y);

        //     tmp2.push(d._draw_[1].rect[0]);
        //     tmp2.push(d._draw_[1].rect[1] - d._draw_[1].rect[3] - 5);

        //     tmp3.push(d._draw_[1].rect[0] + d._draw_[1].rect[2]);
        //     tmp3.push(y);

        //     tmp4.push(d._draw_[1].rect[0] + d._draw_[1].rect[2]);
        //     tmp4.push(d._draw_[1].rect[1] + d._draw_[1].rect[3]);

        //     tmp5.push(x);
        //     tmp5.push(d._draw_[1].rect[1] + d._draw_[1].rect[3]);
        //     pointsA.push(tmp1);
        //     pointsA.push(tmp2);
        //     pointsA.push(tmp3);
        //     pointsA.push(tmp4);
        //     pointsA.push(tmp5);

        //     return pointsA;
        // }).attr("fill", "none").attr("stroke", "black");


    node.append('text').attr('x', (d) => {
        return d._ldraw_[2].pt[0]
    }).attr('y', (d) => {
        return d._ldraw_[2].pt[1] + 7;
    }).attr("text-anchor", "middle").text(d => d._ldraw_[2].text);

    var edge = svg.selectAll('g.edge').data(jsonData.edges).enter().append('g').attr('class', 'edge');

    edge.append('path').attr('d', d => {
            var pointsA = d._draw_[1].points;
            return lineFunction(pointsA)
        })
        .attr("fill", 'none').attr("stroke", "black");

    edge.append('polygon').attr('points', d => {
        return d._hdraw_[3]['points']
    });
    edge.append('text')
        .attr("x", d => {
            if (d._ldraw_ != undefined) {
                return d._ldraw_[2].pt[0]
            }
        })
        .attr("y", d => {
            if (d._ldraw_ != undefined) {
                return d._ldraw_[2].pt[1]
            }
        })
        .text(d => {
            if (d._ldraw_ != undefined) {
                return d._ldraw_[2].text
            }
        });
}