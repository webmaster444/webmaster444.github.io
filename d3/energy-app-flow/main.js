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
})

function addSidebarItems(buildingsData){    
    buildingsData.forEach(function(building){
        console.log(building);
        buildingItemHTML = '<div class="building-item"><a><img src="arrow-down.png" alt=""><h4 class="color-white uppercase">'+building.name+'</h4><div class="status-wrapper"><div class="status-online"></div></div><label class="checkbox-container"><input type="checkbox"><span class="checkmark"></span></label></a>'
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