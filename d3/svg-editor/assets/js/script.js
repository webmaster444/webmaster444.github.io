var width = Math.min(1200, document.getElementById('main_content').clientWidth);
height = 800;
var currentTool = "active"; // Selected tool in toolbox
var index = 0;
var svg = d3.select("#svg_wrapper").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);

var margin = {top:50};
//data for polygon
var points = [], g;
var dragging = false, drawing = false, startPoint;

var svgWidth = 560, svgHeight = 800;
var padding = 30
var roomStart = svgWidth / 4 + padding;
var index = 2;
var squareWidth = 30;
var roomWidth = 360, roomHeight = 700;
drawBasicFloor();
function drawBasicFloor(){
    svg.append('rect').attr('x', svgWidth/4).attr('y',50).attr('width',roomWidth).attr('height',700).attr('fill',"red");
    svg.append('circle').attr('cx', svgWidth/4).attr('cy',svgHeight / 2).attr('r',svgHeight/6).attr('fill',"red");    
    svg.append('circle').attr('cx', svgWidth/4).attr('cy',svgHeight / 2).attr('r',30).attr('fill',"steelblue").attr('stroke','black').attr('id','circle_1');    
    drawRect(roomStart,margin.top+padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding,squareWidth,squareWidth);
    drawRect(roomStart - 10, margin.top+padding+40, squareWidth * 6, 10);
    drawRect(roomStart,margin.top+padding+60,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding+60,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding+60,squareWidth,squareWidth);

    drawRect(roomStart,margin.top+padding + squareWidth * 3 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding + squareWidth * 3 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding + squareWidth * 3 + padding,squareWidth,squareWidth);
    drawRect(roomStart - 10, margin.top+padding+40 + squareWidth * 3 + padding, squareWidth * 6, 10);
    drawRect(roomStart,margin.top+padding+60 + squareWidth * 3 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding+60 + squareWidth * 3 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding+60 + squareWidth * 3 + padding,squareWidth,squareWidth);

    drawRect(roomStart,margin.top+padding + squareWidth * 14 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding + squareWidth * 14 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding + squareWidth * 14 + padding,squareWidth,squareWidth);
    drawRect(roomStart - 10, margin.top+padding+40 + squareWidth * 14 + padding, squareWidth * 6, 10);
    drawRect(roomStart,margin.top+padding+60 + squareWidth * 14 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding+60 + squareWidth * 14 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding+60 + squareWidth * 14 + padding,squareWidth,squareWidth);


    drawRect(roomStart,margin.top+padding + squareWidth * 18 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding + squareWidth * 18 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding + squareWidth * 18 + padding,squareWidth,squareWidth);
    drawRect(roomStart - 10, margin.top+padding+40 + squareWidth * 18 + padding, squareWidth * 6, 10);
    drawRect(roomStart,margin.top+padding+60 + squareWidth * 18 + padding,squareWidth,squareWidth);
    drawRect(roomStart + padding + squareWidth,margin.top+padding+60 + squareWidth * 18 + padding,squareWidth,squareWidth);
    drawRect(roomStart + 2 * (padding + squareWidth),margin.top+padding+60 + squareWidth * 18 + padding,squareWidth,squareWidth);

    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 2 * 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 3* 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 9 * 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 10 * 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 11* 50, 25, 40);
    drawRect(roomStart + svgWidth / 5 * 2, margin.top+padding + 12 * 50, 25, 40);

    drawRect(roomStart + roomWidth - 80, margin.top+ padding, 10, 200);
    drawRect(roomStart + roomWidth - 120, margin.top+ padding + 4 * 50 + 25, 25, 200);
    drawRect(roomStart + roomWidth - 80, margin.top+ padding + 9 * 50, 10, 200);

    drawRect(roomStart - 80, svgHeight / 2 - svgHeight / 6 + 50, squareWidth, squareWidth);
    drawRect(roomStart , svgHeight / 2 - svgHeight / 6 + 50, squareWidth, squareWidth);
    drawRect(roomStart - 80, svgHeight / 2 - svgHeight / 6 + 190, squareWidth, squareWidth);
    drawRect(roomStart , svgHeight / 2 - svgHeight / 6 + 190, squareWidth, squareWidth);

    drawRect(roomStart - 130, svgHeight / 2 - svgHeight / 6 + 90, squareWidth, squareWidth);
    drawRect(roomStart - 130, svgHeight / 2 - svgHeight / 6 + 150, squareWidth, squareWidth);

    drawRect(roomStart + svgWidth / 5 * 2 - 40, svgHeight / 2 - svgHeight / 6 + 50, squareWidth, squareWidth);
    drawRect(roomStart + svgWidth / 5 * 2 - 40, svgHeight / 2 - svgHeight / 6 + 2 * 50, squareWidth, squareWidth);
    drawRect(roomStart + svgWidth / 5 * 2 - 40, svgHeight / 2 - svgHeight / 6 + 3 * 50, squareWidth, squareWidth);
    drawRect(roomStart + svgWidth / 5 * 2 - 40, svgHeight / 2 - svgHeight / 6 + 4 * 50, squareWidth, squareWidth);    

    drawRect(roomStart + roomWidth - 30, margin.top-10, 20, roomHeight+20, "white");
    drawRect(roomStart + roomWidth - 10, margin.top-10, 40, roomHeight+20, "lightgreen");
    drawRect(roomStart + roomWidth + 30, svgHeight / 2 - 100, 30, 200, "purple");
    drawRect(roomStart + roomWidth + 30, margin.top + 30, 20, 50, "white");
    drawRect(roomStart + roomWidth + 30, margin.top + 600, 20, 50, "white");
}


var dragger = d3.drag()
    .on('drag', handleDrag)
    .on('end', function(d){
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
function drawRect(x,y,width, height,backcolor="none",strokeStyle){
    index++;
    svg.append('rect').attr('x',x).attr('y',y).attr('width',width).attr('height',height).attr('id','rect_'+index).attr('fill',backcolor).attr('stroke','black');
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
    g.selectAll('line').remove();
    var line1 = g.append('line')
                .attr('x1', startPoint[0])
                .attr('y1', startPoint[1])
                .attr('x2', d3.mouse(this)[0] + 2)
                .attr('y2', d3.mouse(this)[1])
                .attr('stroke', 'red')
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
    for (var i = 0; i < circles._groups[0].length; i++) {
        circle = d3.select(circles._groups[0][i]);
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
        .call(dragger)
        .style({cursor: 'move'})
        
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