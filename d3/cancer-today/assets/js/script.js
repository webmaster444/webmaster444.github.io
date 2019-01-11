var nCount = 10;
var width = 960,
    height = 500; // adjust for height of input bar div
var color = d3.scale.category20();
// draw and append the container
var svg = d3.select("#chart_content").append("svg")
  .attr("width", width).attr("height", height);
var charts = d3.select("#chart_content");
// set the thickness of the inner and outer radii
var min = Math.min(width, (height-50));
var chart_r = min / 2;
// construct default pie laoyut
var pie = d3.layout.pie().value(function(d){ return d; }).sort(null);
// construct arc generator
var arc = d3.svg.arc()
  .outerRadius(chart_r)
  .innerRadius(chart_r * 0.7);
// creates the pie chart container
var g = svg.append('g')
var g = svg.append('g')
  .attr('transform', function(){
    if ( window.innerWidth >= 960 ) var shiftWidth = width / 2;
    if ( window.innerWidth < 960 ) var shiftWidth = width / 3;
    return 'translate(' + shiftWidth + ',' + height / 2 + ')';
  })
var tooltip = d3.select('#chart_content')
    .append('div')
    .attr('class','tooltip')
// generate random data
var data = makeData(+nCount);
// enter data and draw pie chart
var path = g.datum(data).selectAll("path")
  .data(pie)
  .enter().append("path")
    .attr("class","piechart")
    .attr("fill", function(d,i){ return color(i); })
    .attr("d", arc)
    .each(function(d){ this._current = d; })
    .on('mouseover',function(d){      
      pathAnim(d3.select(this), 1);
          tooltip.transition()    
              .duration(200)    
              .style("opacity", .9);    
          tooltip.html(d.data.toFixed(2) + "<br/>")  
              .style("left", (d3.event.pageX) + "px")   
              .style("top", (d3.event.pageY - 28) + "px");
    }).on('mouseout',function(){
      var thisPath = d3.select(this);
      if (!thisPath.classed('clicked')) {
          pathAnim(thisPath, 0);
      }
      div.transition()    
        .duration(500)    
        .style("opacity", 0); 
    }).on('click',function(){        
        var thisPath = d3.select(this);
        var clicked = thisPath.classed('clicked');
        pathAnim(thisPath, ~~(!clicked));   
    })
function render(){  
  // generate new random data
  data = makeData(+nCount);
  // add transition to new path
  g.datum(data).selectAll("path").data(pie).transition().duration(1000).attrTween("d", arcTween)
  // add any new paths
  g.datum(data).selectAll("path")
    .data(pie)
  .enter().append("path")
    .attr("class","piechart")
    .attr("fill", function(d,i){ return color(i); })
    .attr("d", arc)
    .each(function(d){ this._current = d; })

  // remove data not being used
  g.datum(data).selectAll("path")
    .data(pie).exit().remove();    
}
render();

function makeData(size){
  return d3.range(size).map(function(item){
   return Math.random()*100;
  });
};
// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function pathAnim(path, dir) {
    switch(dir) {
      case 0:
        path.transition()
          .duration(500)
          .ease('bounce')
          .attr('d', d3.svg.arc()
              .innerRadius(chart_r * 0.7)
              .outerRadius(chart_r)
          );
      break;

      case 1:
        path.transition()
          .attr('d', d3.svg.arc()
              .innerRadius(chart_r * 0.7)
              .outerRadius(chart_r * 1.08)
          );
        break;
    }
}

$(document).ready(function () {

  $('#updateData').on('click',function(){
    render();
  })
});

