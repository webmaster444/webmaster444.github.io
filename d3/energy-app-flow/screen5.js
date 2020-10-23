let detailData, cuData;
d3.json('energy-initial-test-v3.json', function(json){
    let cities = json.children;    
    let selectedCity = "Westmorland";
    let selectedCityData = "";
    cities.forEach(function(city){
        if(city.name==selectedCity){
            selectedCityData = city.children;
        }
    })
    // addSidebarItems(selectedCityData);
    detailData = selectedCityData;
    // let boilers = selectedCityData[0].children[0].boilers[0].boilers;
    cuData = getBoilers('Schools','School1');
    updateSingleScreen("#template-profile",cuData,'template-profile');
    updateSingleScreen("#boiler-load",cuData,'boiler-load');
    updateSingleScreen("#mg2-status",cuData,'mg2-status');
    $('.all-checkbox, .parent-checkbox').attr('disabled','disabled');
})


function updateSingleScreen(wrapper, chartData,type){
    $(wrapper).find('.charts-wrapper').html("");    
    let currentStep = $(wrapper).find('.screen-step.active').html().toLowerCase();
    chartData.forEach(function(boiler){
        let line1, line2, line1Text, line2Text;
        switch(type){
            case "template-profile":
                line1 = boiler['flow-sparkline'][currentStep];
                line2 = boiler['return-sparkline'][currentStep];
                line1Text = "Flow";
                line2Text = "Return";
                break;
            case "boiler-load":
                line1 = boiler['loady1-sparkline'][currentStep];
                line2 = boiler['loady2-sparkline'][currentStep];
                line1Text = "Y2";
                line2Text = "Y1";
                break;
            case "mg2-status":
                line1 = boiler['m2gstatusy1-sparkline'][currentStep];
                line2 = boiler['m2gstatusy2-sparkline'][currentStep];
                line1Text = "Y2";
                line2Text = "Y1";
                break;
        }

        let width = $(wrapper).find('.charts-wrapper').width(), height = 200;        
        let margin = {top:30, left:40,right:0,bottom:30};
        width = width - margin.left - margin.right;
        var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().rangeRound([height, 0]);
        x.domain([0, d3.max(Object.keys(line1))]);
        y.domain([0, d3.max([d3.max(line1),d3.max(line2)])]);
        // update widget text and value
        
        // draw area chart
        let svg = d3.select(wrapper).select('.charts-wrapper').append('svg').attr('width',(width+margin.left+margin.right)).attr('height',(height+margin.top+margin.bottom)).append("g").attr("transform", "translate("+margin.left+", 30)");
        var line = d3.line()
        .x(function(d,i) { return x(i); })
        .y(function(d) { return y(d); })
        
        var xAxis = d3.axisBottom(x).tickSize(0).ticks(0);
        var yAxis = d3.axisLeft(y).tickSize(0).ticks(0);

        svg.append("g").attr("class", "axis").attr('transform','translate(0,'+(height)+')').call(xAxis);
        svg.append("g").attr("class", "axis").call(yAxis);
        
        svg.selectAll('.line1').data([line1]).enter().append("path")
        .attr("class", "line1 line")
        .attr("d", line);

        svg.selectAll('.line2').data([line2]).enter().append("path")
        .attr("class", "line2 line")
        .attr("d", line);

        
        svg.append('text').attr('x',-5).attr('y',y(line1[0])+5).attr('class','label').text(line1Text).attr('text-anchor','end').attr('fill','white');
        svg.append('text').attr('x',-5).attr('y',y(line2[0])+5).attr('class','label').text(line2Text).attr('text-anchor','end').attr('fill','white');
    })        
}

$('.screen-step').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    let type = $(this).closest('.one-third').attr('type');
    let wrapperClass = $(this).closest('.one-third').attr('id');
    
    // let boilers=detailData['boilers'];
    updateSingleScreen('#'+wrapperClass,cuData,type); 
    // reload data and change that screen
    // d3.json('energy-initial-test-v3.json', function(json){
    //     let cities = json.children;
    //     let cityNames = cities.map(function(d){return d.name});
    //     let selectedCity = "Westmorland";
    //     let selectedCityData = "";
    //     cities.forEach(function(city){
    //         if(city.name==selectedCity){
    //             selectedCityData = city.children;
    //         }
    //     })        
    //     let boilers = selectedCityData[0].children[0].boilers[0].boilers;
       
    // })
})

$(document).on('change','.building-subitem input[type="checkbox"]', function(){    
    // let boilers=detailChartData['boilers'];
    // console.log(detailChartData);
    // updateSingleScreen("#template-profile",boilers,'template-profile');
    // updateSingleScreen("#boiler-load",boilers,'boiler-load');
    // updateSingleScreen("#mg2-status",boilers,'mg2-status');
    $('.building-subitem input[type="checkbox"]').prop('checked',false);
    $(this).prop('checked',true);
})

$(document).on('click','.building-subitem', function(){
    let buildingName = $(this).find('h5').html();
    let buildingType = $(this).closest('.building-item').find('h4').html();
    cuData = getBoilers(buildingType, buildingName);    
    updateSingleScreen("#template-profile",cuData,'template-profile');
    updateSingleScreen("#boiler-load",cuData,'boiler-load');
    updateSingleScreen("#mg2-status",cuData,'mg2-status');
})

function getBoilers(buildingType, buildingName){
    let cuBuildings = detailData.filter((d)=>d.name==buildingType);
    let cuBuilding = cuBuildings[0].children.filter((d)=>d.name==buildingName);
    return cuBuilding[0]['boilers'][0]['boilers'];
}