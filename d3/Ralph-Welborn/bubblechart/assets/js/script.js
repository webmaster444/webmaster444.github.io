var wrapperWidth = $("#chart_wrapper").width(),
    height = 500,
    margin = {
        left: 50,
        right: 50,
        top: 100,
        bottom: 50
    };

var width = wrapperWidth - margin.left - margin.right;
var radius = d3.scaleLinear().rangeRound([0,50]); // Node circle radius;

var myColor = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#chart_wrapper").append('svg').attr("width", width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

var x = d3.scaleTime().rangeRound([0, width]);
var x_axis = d3.axisBottom(x);

var parseTime = d3.timeParse("%d-%b-%Y");
var xFormat = "%d-%b-%Y";

var y = d3.scaleLinear().rangeRound([height,0]);
var y_axis = d3.axisLeft(y);

var yOption = 'revenue';
var rOption = 'finance';
d3.csv("assets/bubble2.csv").then(function(data) {
    var industries = [];

    data.forEach(function(d){
        if(!industries.includes(d['Industry Focus'])){
            industries.push(d['Industry Focus']);
        }
        d['group'] = d['Industry Focus'];
        d['finance'] = d['Last Financing Size (in mm)'];
        d['revenue'] = d['Revenue (in mm)'];
        d['name'] = d['Company Name'];
        d['date'] = d['Year Founded'];
        d['description'] = d['Description'];
    })

    myColor.domain(industries);

    console.log(myColor.domain());
    x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
    y.domain([0, d3.max(data.map(function(d){return parseFloat(d[yOption])}))]);   
    console.log(d3.max(data.map(function(d){return parseFloat(d[yOption])})));
    radius.domain([0, d3.max(data.map(function(d){return parseFloat(d[rOption])}))]);

    // console.log(d3.max(data.map(function(d){return parseFloat(d[rOption])})));
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat(xFormat)));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    var wrapper = svg.selectAll('.circle_wrapper').data(data).enter().append('g').attr('class','circle_wrapper');

    wrapper.append('circle')
        .attr('cx',(d)=>x(parseTime(d.date)))
        .attr('cy',(d)=>y(d[yOption]))
        .attr('r',(d)=>radius(d[rOption]))
        .attr('fill',(d)=>myColor(d['group']))
        .on('mouseover',function(d) {
            d3.select(this.parentNode).select('text').classed('hide',false);
            d3.select('.description').html(d.description);
        })
        .on('mouseout',function () {
            d3.select(this.parentNode).select('text').classed('hide',true);
            d3.select('.description').html('');
        });

    wrapper.append('text').attr("x",(d)=>x(parseTime(d.date))).attr('y',(d)=>y(parseFloat(d[yOption]) + radius(d[rOption]) + 5)).text((d)=>d.name).attr('text-anchor','middle').attr('class','hide');


});
