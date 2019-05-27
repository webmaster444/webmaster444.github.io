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
var svg = d3.select("#chart_wrapper").append('svg').attr("width", wrapperWidth).attr("height", wrapperHeight).append("g").attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')


var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(20).strength(1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    // .force("x", d3.forceX(width / 2).strength(0.015))
    // .force("y", d3.forceY(height / 2).strength(0.015));
    //     .force("charge", d3.forceManyBody())
    // // .force("link", d3.forceLink(links).distance(20).strength(1))
    // .force("x", d3.forceX())
    // .force("y", d3.forceY());
    // .on("tick", ticked);

d3.json("assets/js/data.json", function(error, graph) {
  if (error) throw error;

  // console.log(graph);
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.1).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

d3.json("newjson.json", function(error, data) {
  var nodes = data.filter(function(d){ return d.from == d.to});
  var links = data.filter(function(d){ return d.from != d.to});

  var graph = new Object;
  graph['nodes'] = [];
  nodes.forEach(function(node){
    var tmp = new Object;
    tmp['id'] = node['from'];    
    tmp['group'] = Math.floor((Math.random() * 100) % 4 );
    graph['nodes'].push(tmp);
  })

  console.log(graph.nodes);

  graph['links'] = [];
  links.forEach(function(link, i){    
    var tmp1 = new Object;
    tmp1['source'] = link['from'];
    tmp1['target'] = link['to'];
    tmp1['value'] = link['width'];    
    graph['links'].push(tmp1);
  });

  // console.log(graph);

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    
  var circles = node.append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  var lables = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('x', 6)
      .attr('y', 3);

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
})