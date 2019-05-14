var wrapperWidth = $("#chart_wrapper").width(),
    height = 700,
    margin = {
        left: 150,
        right: 550,
        top: 50,
        bottom: 50
    };

var width = wrapperWidth - margin.left - margin.right;
var radius = d3.scaleLinear().rangeRound([0,50]); // Node circle radius;

var myColor = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#chart_wrapper").append('svg').attr("width", width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

var x = d3.scaleTime().rangeRound([0, width]);
var x_axis = d3.axisBottom(x);

var parseTime = d3.timeParse("%M-%d-%Y");
var xFormat = "%Y";

var y = d3.scaleBand().rangeRound([height * 3 / 4,0]);

var jsonData;
var yLine = d3.scaleLinear().rangeRound([height / 4,0]);

var industries = ["fund","idxa","idxb"];
var categoreis = ["fund","idxa","idxb", "dispersion", 'correlation'];
d3.json("assets/data.json").then(function(data) {
    data.forEach(function(d){      
        d['startDate'] = Date.parse(d['date']);
        var t = new Date(Date.parse(d['date']));
        t.setMonth(t.getMonth()+1); 
        d['endDate'] = Date.parse(t);
    })

    data.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);

    console.log(data);
    jsonData = data;

    myColor.domain(categoreis);
    
    x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
    y.domain(industries);       
    // radius.domain([0, d3.max(data.map(function(d){return parseFloat(d[rOption])}))]);

    // console.log(d3.max(data.map(function(d){return parseFloat(d[rOption])})));
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat(xFormat)));

    // Add the Y Axis
    svg.append("g")
        .attr('class','y axis')
        .call(d3.axisLeft(y).tickSize(-width - 30).tickSizeOuter(0).tickFormat((d)=>changeText(d)));
    
    industries.forEach(function(industry){
        var y1 = d3.scaleLinear().rangeRound([y.bandwidth(),0]);
        var iMax = d3.max(data,(d)=>Math.abs(d[industry]));
        y1.domain([-iMax, iMax]);

        var g_wrapper = svg.append('g').attr('class','g_'+industry).attr('transform','translate(0,'+y(industry)+')');

        g_wrapper.selectAll('.bar').data(data).enter().append('rect').attr('class','bar').attr('x',(d)=>x(d.startDate)).attr("y",(d)=>y1(Math.max(0, d[industry]))).attr("width",(d)=>x(d.endDate) - x(d.startDate)).attr("height", (d)=>Math.abs(y1(d[industry]) - y1(0))).attr('fill',(d)=>myColor(industry));
    });

    yLine.domain([d3.min([d3.min(data.map(function(o) { return o.dispersion; })),d3.min(data.map(function(o) { return o.correlation; }))]), d3.max([Math.max.apply(Math, data.map(function(o) { return o.dispersion; })),Math.max.apply(Math, data.map(function(o) { return o.correlation; }))])]);
    
    var dispersionLine = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.startDate); })
    .y(function(d) { return yLine(d.dispersion); });

    var correlationLine = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.startDate); })
    .y(function(d) { return yLine(d.correlation); });

    var line_wrapper = svg.append('g').attr('class','line_wrapper').attr("transform","translate(0,"+height * 3 / 4 +")");
    line_wrapper.append('path').attr('d',dispersionLine(data)).attr('stroke', myColor('dispersion')).attr('class','line_path');
    line_wrapper.append('path').attr('d',correlationLine(data)).attr('stroke', myColor('correlation')).attr('class','line_path');
});

function changeText(text){
    if(text == "idxa"){
        return "IDX A Alpha";       
    }else if(text == "idxb"){
        return "IDX B Alpha";
    }else if(text == "fund"){
        return "Fund Alpha";
    }else if(text == "correlation"){
        return "Correlation";
    }else if(text == "dispersion"){
        return "Dispersion";
    }
}