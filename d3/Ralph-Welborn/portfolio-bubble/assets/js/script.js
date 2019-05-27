var wrapperWidth = $("#chart_wrapper").width(),
    height = 500,
    margin = {
        left: 50,
        right: 50,
        top: 100,
        bottom: 70
    };

var xOption = "Fungibility (.1 - 1.0)";
var yOption = 'Pure Play (1-6) (1 = low)';
var rOption = 'Revenue Contribution (+ to 100%)';
var detailLevel = 1;

var width = wrapperWidth - margin.left - margin.right;
var radius = d3.scaleLinear().rangeRound([0,50]); // Node circle radius;

var myColor = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#chart_wrapper").append('svg').attr("width", width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear().rangeRound([0, width]);
var x_axis = d3.axisBottom(x);

var y = d3.scaleLinear().rangeRound([height,0]);
var y_axis = d3.axisLeft(y);
var jsonData;

const div = d3
  .select('#chart_wrapper')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

var circlesWrapper;

d3.csv("assets/bubble-data.csv").then(function(data) {    
    var colorGroup = [];

    data.forEach(function(d){
        if(detailLevel == 1){
            var tmpC = d["Industry"] + d["Assets"];
            if(!colorGroup.includes(tmpC)){
                colorGroup.push(tmpC);
            }            
            d['name'] = d['Industry'] + d['Assets'];
        }else if(detailLevel == 2){
            var tmpC = d["Industry"] + d["Assets"] + d["Capabilities"];
            if(!colorGroup.includes(tmpC)){
                colorGroup.push(tmpC);
            }            
            d['name'] = d['Industry'] + d['Assets'] + d['Capabilities'];
        }
        
        d['x'] = d[xOption];
        d['y'] = d[yOption];
        d['r'] = d[rOption];        
    })

    jsonData = data;

    graphData = updateData(detailLevel);    
    myColor.domain(colorGroup);
        
    // x.domain(d3.extent(data, function(d) { return parseFloat(d.x); }));
    x.domain([0.1, 1.0]);
    // y.domain([0, d3.max(data.map(function(d){return parseFloat(d[yOption])}))]);
    y.domain([0,6]);
    radius.domain([0, d3.max(graphData.map(function(d){return parseFloat(d[rOption])}))]);
    
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .attr('class','y axis')
        .call(d3.axisLeft(y));

    svg
        .append("text").attr('class','y_label_text')
        .attr("transform", "translate(-35," +  (height+margin.bottom)/2 + ") rotate(-90)")
        .text(yOption);

    svg
        .append("text").attr('class','x_label_text')
        .attr("transform", "translate("+ ((margin.left + width)/2) + ","+  (height +50) + ")")
        .attr('text-anchor','middle')
        .text(xOption);

    circlesWrapper = svg.append('g');
    var wrapper = circlesWrapper.selectAll('.circle_wrapper').data(graphData).enter().append('g').attr('class','circle_wrapper');

    wrapper.append('circle')
        .attr('class','node_circle')
        .attr('cx',(d)=>x(d[xOption]))
        .attr('cy',(d)=>y(d[yOption]))
        .attr('r',(d)=>radius(d[rOption]))
        .attr('fill',(d)=>{
            if(detailLevel == 1){
                return myColor(d["Industry"] + d["Assets"]);
            }else if(detailLevel == 2){
                return myColor(d["Industry"] + d["Assets"] + d["Capabilities"]);
            }
        })        
        .on('mouseover', d => {                    
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(d['name'])
            .style('left', (d3.event.layerX ) +  'px')
            .style('top', (d3.event.layerY - 28) + 'px');
        })
        .on('mouseout', () => {
          div
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

    // wrapper.append('text').attr('class','node_text hide').attr("x",(d)=>x(parseTime(d.date))).attr('y',(d)=>y(parseFloat(d[yOption])) - radius(d[rOption]) - 5).text((d)=>d.name).attr('text-anchor','middle');

    // var legend_wrapper = svg.append('g').attr('class','legend_wrapper').attr("transform","translate("+(wrapperWidth - 300) + ',0)');
    // legend_wrapper.append('text').attr('x',0).attr('y', 0).text('X axis : Time');
    // legend_wrapper.append('text').attr('class','y_axis_legend').attr('x',0).attr('y', 20).text('Y axis : ' + changeText(yOption));
    // legend_wrapper.append('text').attr('class','radius_legend').attr('x',0).attr('y', 40).text('Radius : ' + changeText(rOption));
    // var legend = legend_wrapper.selectAll('.legend').data(industries).enter().append('g').attr('class','legend').attr('transform',function(d,i){
    //     return "translate(0," + ((i+2) * 30) + ")";
    // });
    // legend.append('circle').attr('cx', 0).attr('cy',10).attr('r', 10).attr("fill",(d)=>myColor(d));
    // legend.append('text').attr('x', 15).attr('y',15).text((d)=>d);
});

// $("#swap_btn").click(function(){
//     if(yOption == "revenue"){
//         yOption = 'finance';
//     }else{
//         yOption = 'revenue';
//     }

//     if(rOption == 'finance'){
//         rOption = 'revenue';
//     }else{
//         rOption = 'finance';
//     }

//     // if(yOption == 'finance'){
//     //     $('.yoption_span').html("Last Financing Size (in mm)");        
//     // }else{
//     //     $('.yoption_span').html("Revenue (in mm)");        
//     // }
    
//     // if(rOption == 'finance'){
//     //     $('.roption_span').html("Last Financing Size (in mm)");        
//     // }else{
//     //     $('.roption_span').html("Revenue (in mm)");        
//     // }

//     updateChart(yOption, rOption);
// });

function updateChart(newData){
    // svg.selectAll('.circle_wrapper').remove();
    // var wrapper = svg.selectAll('.circle_wrapper').data(newData).enter().append('g').attr('class','circle_wrapper');

    // radius.domain([0, d3.max(newData.map(function(d){return parseFloat(d[rOption])}))]);
    // wrapper.append('circle')
    //     .attr('class','node_circle')
    //     .attr('cx',(d)=>x(d[xOption]))
    //     .attr('cy',(d)=>y(d[yOption]))
    //     .attr('r',(d)=>radius(d[rOption]))
    //     .attr('fill',(d)=>{
    //         if(detailLevel == 1){
    //             return myColor(d["Industry"] + d["Assets"]);
    //         }else if(detailLevel == 2){
    //             return myColor(d["Industry"] + d["Assets"] + d["Capabilities"]);
    //         }
    //     })
    //     .style('cursor', 'pointer')
    //     .on('mouseover', (d) => {            
    //       div
    //         .transition()
    //         .duration(200)
    //         .style('opacity', 0.9);
    //       div
    //         .html(d['name'])
    //         .style('left', (d3.event.layerX ) +  'px')
    //         .style('top', (y(d.y) + margin.top) + 'px');
    //     })
    //     .on('mouseout', () => {
    //       div
    //         .transition()
    //         .duration(500)
    //         .style('opacity', 0);
    //     });
    
    // svg.select('.y_axis_legend').text('Y axis : ' + changeText(yOption));
    // svg.select('.radius_legend').text('Radius : ' + changeText(rOption));

        var circle = circlesWrapper.selectAll("circle")
            .data(newData);
        
        circle.exit().remove();//remove unneeded circles
        circle.enter().append("circle").on('mouseover', d => {                    
          div
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          div
            .html(d['name'])
            .style('left', (d3.event.layerX ) +  'px')
            .style('top', (d3.event.layerY - 28) + 'px');
        })
        .on('mouseout', () => {
          div
            .transition()
            .duration(500)
            .style('opacity', 0);
        })
        .transition()
            .duration(500)
            .attr("r",0).attr('class','node_circle')
            .attr('cx',(d)=>x(d[xOption]))
            .attr('cy',(d)=>y(d[yOption]))
            .attr('r',(d)=>radius(d[rOption]))
            .attr('fill',(d)=>{
                if(detailLevel == 1){
                    return myColor(d["Industry"] + d["Assets"]);
                }else if(detailLevel == 2){
                    return myColor(d["Industry"] + d["Assets"] + d["Capabilities"]);
                }
            })

        //update all circles to new positions
        circle.transition()
            .duration(500)
            .attr('class','node_circle')
            .attr('cx',(d)=>x(d[xOption]))
            .attr('cy',(d)=>y(d[yOption]))
            .attr('r',(d)=>radius(d[rOption]))
            .attr('fill',(d)=>{
                if(detailLevel == 1){
                    return myColor(d["Industry"] + d["Assets"]);
                }else if(detailLevel == 2){
                    return myColor(d["Industry"] + d["Assets"] + d["Capabilities"]);
                }
            })            
}


function changeText(text){
    if(text == "revenue"){
        return "Revenue (in mm)";       
    }else if(text == "finance"){
        return "Last Financing Size (in mm)";
    }
}

function updateLevel(value){
    detailLevel = value;
}

$('.detaillevel input[type=radio]').on('change', function() {
    updateLevel(this.value);
    updateChart(updateData(this.value));
});

function updateData(level){
    var result = [];
    if(level == 1){
    var level1Data = d3.nest()
        .key(function(d) { return d['Industry']; })
        .key(function(d) { return d['Assets']; })
        .rollup(function(v) {             
            return {
            x: d3.sum(v, function(d){return d[xOption]}) / v.length,
            y: d3.sum(v, function(d){return d[yOption]}) / v.length,
            r: d3.sum(v, function(d){return d[rOption]}) / v.length,
            name: v[0]['Industry'] + ' : ' + v[0]['Assets'],
            }
        })
        .entries(jsonData);
        
    var idArrays = [];
    level1Data.forEach(function(lvl){                    
        lvl.values.forEach(function(val){                     
            var tmp1 = new Object;
            tmp1['Industry'] = lvl.key;
            tmp1['Assets'] = val.key;
            tmp1[xOption] = val.value.x;
            tmp1[yOption] = val.value.y;
            tmp1[rOption] = val.value.r;
            tmp1['name']  = val.value.name;    
            var str = val.value.name.toLowerCase();
            tmp1['id']    = str.replace(/\s/g, '');            
            result.push(tmp1);
        })        
    })           
        return result;
    }else if(level == 2){
        return jsonData;
    }
}