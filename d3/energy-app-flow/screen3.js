function updateSingleScreen(wrapper, chartData,type){
    $(wrapper).html("");
    let m2gon = chartData.m2gstatuson, m2goff=chartData.m2gstatusoff;
    let currentStep = $(wrapper).closest('.screen-frame').find('.screen-step.active').html().toLowerCase();

    let m2gonSparkline, m2goffSparkline;
    switch(type){
        case "boilerfires":
            m2gonSparkline = m2gon['boilerfires-sparkline'][currentStep];
            m2goffSparkline = m2goff['boilerfires-sparkline'][currentStep];
            break;
        case "co2savingkg":
            m2gonSparkline = m2gon['co2savingkg-sparkline'][currentStep];
            m2goffSparkline = m2goff['co2savingkg-sparkline'][currentStep];
            break;
        case "reductionkwh":
            m2gonSparkline = m2gon['reductionkwh-sparkline'][currentStep];
            m2goffSparkline = m2goff['reductionkwh-sparkline'][currentStep];
            break;
    }

    let width = $(wrapper).width(), height = $('.screen-frame').height() - 175;
    
    let margin = {top:30, left:30,right:30,bottom:30};
    var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);
    x.domain([0, d3.max(Object.keys(m2gonSparkline))]);
    y.domain([0, d3.max([d3.max(m2gonSparkline),d3.max(m2goffSparkline)])]);
    // update widget text and value
    updateWidget(m2gon,m2goff,currentStep,type,wrapper);
    // draw area chart
    let svg = d3.select(wrapper).append('svg').attr('width',width).attr('height',height).append("g").attr("transform", "translate(0, 20)");
    var area = d3.area()
    .x(function(d,i) { return x(i); })
    .y0(function(d) { return y(0); })
    .y1(function(d) { return y(d); })
    
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    svg.append("g").attr("class", "axis").call(xAxis);
    svg.append("g").attr("class", "axis").call(yAxis);
    
    svg.selectAll('.m2goffarea').data([m2goffSparkline]).enter().append("path")
    .attr("class", "m2goffarea")
    .attr("d", area)
    .attr("dy", "10em");

    svg.selectAll('.m2gonarea').data([m2gonSparkline]).enter().append("path")
    .attr("class", "m2gonarea")
    .attr("d", area)
    .attr("dy", "10em");

    svg.append('text').attr('x',width).attr('y',y(d3.max(m2gonSparkline))+5).text(d3.max(m2gonSparkline)).attr('text-anchor','end').attr('fill','white');
    svg.append('text').attr('x',width).attr('y',y(d3.max(m2goffSparkline))+5).text(d3.max(m2goffSparkline)).attr('text-anchor','end').attr('fill','white');
}

function updateWidget(withm2g, withoutm2g, interval, type, wrapper){
    let value = withm2g[type][interval]-withoutm2g[type][interval];
    switch(type){
        case "boilerfires":
            $(wrapper).closest('.screen-frame').find('.widget-value').html(value);
            break;
        case "co2savingkg":
            $(wrapper).closest('.screen-frame').find('.widget-value').html(value+'Kg');
            break;
        case "reductionkwh":
            $(wrapper).closest('.screen-frame').find('.widget-value').html(value+'kWh');
            break;     
        default:
            $(wrapper).closest('.screen-frame').find('.widget-value').html(value);
    }    
}

$('.screen-step').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    let type = $(this).closest('.single-screen').attr('type');
    let wrapperClass = $(this).closest('.single-screen').find('.screen-chart').attr('id');

    let filteredData = filterDataByCheckbox();
    let boilers=filteredData['boilers'];
    updateSingleScreen('#'+wrapperClass,boilers,type);        
})


$(document).on('change','.placeholder input[type="checkbox"], .building-lists-wrapper input[type="checkbox"]', function(){
    let filteredData = filterDataByCheckbox();
    let boilers=filteredData['boilers'];
    updateSingleScreen("#boiler-chart",boilers,'boilerfires');
    updateSingleScreen("#carbon-chart",boilers,'co2savingkg');
    updateSingleScreen("#reduction-chart",boilers,'reductionkwh');
})