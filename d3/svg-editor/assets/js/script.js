var width = Math.min(1200, document.getElementById('main_content').clientWidth);
height = 800;
var currentTool = "active"; // Selected tool in toolbox
var index = 0;
var svg = d3.select("#svg_wrapper").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);

//data for polygon
var points = [], g;
var dragging = false, drawing = false, startPoint;

var dragger = d3.behavior.drag()
    .on('drag', handleDrag)
    .on('dragend', function(d){
        dragging = false;
    });
function mousedown() {
    index++;
    //if currentTool == rect
    var m = d3.mouse(this);
  
    if(currentTool=="rect"){
        rect = svg.append("rect")
        .attr("x", m[0])
        .attr("y", m[1])
        .attr("height", 0)
        .attr("width", 0)
        .attr('id',"rect_"+index);

        svg.on("mousemove", mousemove);
    }else if(currentTool=="ellipse"){
        rect = svg.append("rect")
        .attr("x", m[0])
        .attr("y", m[1])
        .attr("height", 0)
        .attr("width", 0);

        svg.on("mousemove", mousemove);
    }else if(currentTool=="line"){
        line = svg.append("line")
        .attr("x1", m[0])
        .attr("y1", m[1])        
        .attr('id',"line_"+index)
        .attr('class','hide');

        svg.on("mousemove", mousemove);
    }
}

function mousemove(d) {
    var m = d3.mouse(this);
    if(currentTool=="rect"){
        rect.attr("width", Math.max(0, m[0] - +rect.attr("x")))
        .attr("height", Math.max(0, m[1] - +rect.attr("y")));
    }else if(currentTool=="circle"){

    }else if(currentTool=="line"){
        line.attr('x2',m[0]).attr('y2',m[1]);
        line.classed('hide',false);
    }else if(currentTool=="polygon"){
            if(!drawing) return;
    var g = d3.select('g.drawPoly');
    g.select('line').remove();
    var line1 = g.append('line')
                .attr('x1', startPoint[0])
                .attr('y1', startPoint[1])
                .attr('x2', d3.mouse(this)[0] + 2)
                .attr('y2', d3.mouse(this)[1])
                .attr('stroke', '#53DBF3')
                .attr('stroke-width', 1);
    }
}

function handleDrag() {
    if(drawing) return;
    var dragCircle = d3.select(this), newPoints = [], circle;
    dragging = true;
    var poly = d3.select(this.parentNode).select('polygon');
    var circles = d3.select(this.parentNode).selectAll('circle');
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
    for (var i = 0; i < circles[0].length; i++) {
        circle = d3.select(circles[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
    poly.attr('points', newPoints);
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function mouseup() {
    if(currentTool=="rect"){
        svg.on("mousemove", null);
    }else if(currentTool=="ellipse"){
        svg.on("mousemove", null);
    }else if(currentTool =="line"){
        svg.on("mousemove", null);
    }else if(currentTool=="polygon"){
        if(dragging) return;
        drawing = true;
        startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
        if(svg.select('g.drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
        if(d3.event.target.hasAttribute('is-handle')) {
            closePolygon();
            return;
        };
        points.push(d3.mouse(this));
        g.select('polyline').remove();
        var polyline = g.append('polyline').attr('points', points)
                        .style('fill', 'none')
                        .attr('stroke', '#000');
        for(var i = 0; i < points.length; i++) {
            g.append('circle')
            .attr('cx', points[i][0])
            .attr('cy', points[i][1])
            .attr('r', 4)
            .attr('fill', 'yellow')
            .attr('stroke', '#000')
            .attr('is-handle', 'true')
            .style({cursor: 'pointer'});
        }
    }
}
function closePolygon() {
    svg.select('g.drawPoly').remove();
    var g = svg.append('g');
    g.append('polygon')
    .attr('points', points)
    .style('fill', getRandomColor());
    for(var i = 0; i < points.length; i++) {
        var circle = g.selectAll('circles')
        .data([points[i]])
        .enter()
        .append('circle')
        .attr('cx', points[i][0])
        .attr('cy', points[i][1])
        .attr('r', 4)
        .attr('fill', '#FDBC07')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'move'})
        .call(dragger);
    }
    points.splice(0);
    drawing = false;
}
$(document).ready(function () {
    $("#line-btn").click(function(){
        currentTool = "line";
        $('.leftsidepannel a').removeClass('active');
        $(this).addClass("active");        
    });
    $("#rect-btn").click(function(){
        currentTool = "rect";
        $('.leftsidepannel a').removeClass('active');
        $(this).addClass("active");        
   });
    $("#pencil-btn").click(function(){
        currentTool = "pencil";
        $('.leftsidepannel a').removeClass('active');
        $(this).addClass("active");        
   });
    $("#polygon-btn").click(function(){
        currentTool = "polygon";
        $('.leftsidepannel a').removeClass('active');
        $(this).addClass("active");        
   });
});