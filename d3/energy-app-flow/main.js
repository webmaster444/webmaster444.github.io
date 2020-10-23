var overallChartData, detailChartData;
d3.json('energy-initial-test-v3.json', function(json){
    let cities = json.children;
    let selectedCity = "Westmorland";
    let selectedCityData = "";
    cities.forEach(function(city){
        if(city.name==selectedCity){
            selectedCityData = city.children;
        }
    })
    addSidebarItems(selectedCityData);
    detailChartData = selectedCityData;
    
    if($('body').hasClass('screen3')){
        // $('.all-checkbox').trigger('change');
    }

    overallChartData = getChartData(json);    
})

function addSidebarItems(buildingsData){    
    buildingsData.forEach(function(building){
        buildingItemHTML = '<div class="building-item"><a><img src="arrow-down.png" alt=""><h4 class="color-white uppercase">'+building.name+'</h4><div class="status-wrapper"><div class="status-online"></div></div><label class="checkbox-container"><input type="checkbox" class="parent-checkbox"><span class="checkmark"></span></label></a>'
        if(building.children!=undefined){
            buildingItemHTML += '<ul>';
            building.children.forEach(function(d){
                buildingItemHTML += '<li class="building-subitem"><h5 class="color-white uppercase">'+d.name+'</h5><div class="status-wrapper"><div class="status-online"></div></div><label class="checkbox-container"><input type="checkbox"><span class="checkmark"></span></label></li>'
            })
            buildingItemHTML += '</ul>';
        }        
        buildingItemHTML +='</div>';
        $('.building-items').append(buildingItemHTML);
    })    
}

$(document).on('click','.building-item > a', function(){
    $(this).siblings('ul').toggleClass('hide');
})

function getAllCheckedBoxes(){
    let checkedBoxes = [];
    $('.building-lists-wrapper ul li').each(function(){
        if($(this).find('input[type="checkbox"]').prop('checked')){
            checkedBoxes.push($(this).find('h5').html());
        }
    });
    return checkedBoxes;
}

$(document).on('change', '.building-lists-wrapper ul input[type="checkbox"]', function(){
    getAllCheckedBoxes();
})

$(document).on('change','.parent-checkbox', function(){
    $(this).closest('.building-item').find('ul input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    getAllCheckedBoxes();
})

$(document).on('change','.all-checkbox', function(){
    $('.building-lists-wrapper input[type="checkbox"]').prop('checked', $(this).prop('checked'));
    getAllCheckedBoxes();
})

function getChartData(json){
    let chartData = [];
    
    let cities = json.children;
    let selectedCity = "Westmorland";
    let selectedCityData = "";
    cities.forEach(function(city){
        if(city.name==selectedCity){
            selectedCityData = city.children;
        }
    })
    selectedCityData.forEach(function(buildings){
        if(buildings.children!=undefined){
            buildings['children'].forEach((building)=>{
                if(building.boilers!=undefined){
                    let boilers = building['boilers'][0]['boilers'];                        
                    building.boilers = makeOneChild(boilers);
                }
                chartData.push(building);
            })
        }
    })
    return chartData;
}

function array_merge(array1, array2){    
    let res = [];
    Object.keys(array1).forEach(function(key){
        if(typeof array1[key]!='object'){
            if(array1[key]==undefined){
                array1[key] = 0
            }
            if(array2[key]==undefined){
                array2[key] =0
            }
            res[key] = array1[key] + array2[key];
        }else{
            res[key] = array_merge(array1[key],array2[key]);
        }        
    })
    return res;
}

function makeOneChild(array1){
    let res = array1[0];
    for(let i=1;i<array1.length;i++){
        res = array_merge(res, array1[[i]]);
    }    
    return res;
}

function filterDataByCheckbox(){
    let checked = getAllCheckedBoxes();
    let filteredData = overallChartData.filter(c=>checked.includes(c.name));
    return makeOneChild(filteredData);
}