d3.json('energy-initial-test-v3.json', function(json){
    let cities = json.children;
    let cityNames = cities.map(function(d){return d.name});
    let selectedCity = "Westmorland";
    let selectedCityData = "";
    cities.forEach(function(city){
        if(city.name==selectedCity){
            selectedCityData = city.children;
        }
    })
    addSidebarItems(selectedCityData);
    let boilers = selectedCityData[0].children[0].boilers[0].boilers[0];
    updateSingleScreen("#boiler-chart",boilers,'boilerfires');
    updateSingleScreen("#carbon-chart",boilers,'co2savingkg');
    updateSingleScreen("#reduction-chart",boilers,'reductionkwh');
})


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
function addSidebarItems(buildingsData){    
    buildingsData.forEach(function(building){
        buildingItemHTML = '<div class="building-item"><img src="arrow-down.png" alt=""><h4 class="color-white uppercase">'+building.name+'</h4><div class="status-wrapper"><div class="status-online"></div></div><label class="checkbox-container"><input type="checkbox"><span class="checkmark"></span></label></div>';
        $('.building-items').append(buildingItemHTML);
    })    
}

$('.screen-step').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    let type = $(this).closest('.single-screen').attr('type');
    let wrapperClass = $(this).closest('.single-screen').find('.screen-chart').attr('id');

    // reload data and change that screen
    d3.json('energy-initial-test-v3.json', function(json){
        let cities = json.children;
        let cityNames = cities.map(function(d){return d.name});
        let selectedCity = "Westmorland";
        let selectedCityData = "";
        cities.forEach(function(city){
            if(city.name==selectedCity){
                selectedCityData = city.children;
            }
        })        
        let boilers = selectedCityData[0].children[0].boilers[0].boilers[0];
        updateSingleScreen('#'+wrapperClass,boilers,type);        
    })
})
