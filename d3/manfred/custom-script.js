var vizChartScript = 'digraph G {	center=true;	compound=true;	constraint=false;	margin=0.2;	nodesep=0.1;	overlap=compress;	rankdir=LR;	ranksep=0.3;	sep=-0.7;	splines=true;	truecolor=true;';	

d3.json("data.json", function(error, data) {
  var showData = data.filter(function(d){
    if(d['is-hidden']==false){
      return d;
    }
  })
  var orphansWithoutLinks = showData.filter(function(d){
    if(d['is-linked-with-an-epic']==false && d['is-orphan']==true){
      return d;
    }
  })

	var graphData = showData.filter(function(d){
    if(d['is-linked-with-an-epic']==true || d['is-orphan']==false){
      return d;
    }
  })
            
  makeLinks(graphData);

  //orphans without links
  vizChartScript += 'subgraph cluster_orphans_without_links { label="orphans without links";	style=dashed; subgraph cluster_orphans_without_links_0 { label="";	style=invis;'
    orphansWithoutLinks.forEach(function(d){            		
			vizChartScript += '"'+d['url']+'" ' + '[ color=gray, href="'+d['url']+'",'+'label=<'+d['number']+'>, shape=record, style="rounded,filled"]; ';
		})
							           
	vizChartScript += 'placeholder_orphans_without_links_0 [ label="", style=invis ];}}';
            
            // console.log(linksData);
            var weightGroup = [];
            graphData.map(function(d){
                if(weightGroup.indexOf(d['weight'])==-1){
                    weightGroup.push(d['weight'])
                }
            });
            
            weightGroup.sort(d3.ascending);
            var nestedData = d3.nest()
            .key(function(d) {
                return d['weight']
            })            
            .entries(graphData);                        
            
            console.log(weightGroup);


            // weightGroup.forEach(function(weight,i){
            // 	placeholder_1->placeholder_2[ label="weight=16", rank=same, shape=none, style=invis ];
            // 	vizChartScript +='pl'
            // })  
            vizChartScript += 'placeholder_orphans_without_links_0->placeholder_1[ label="weight=16", rank=same, shape=none, style=invis ];';
            for(var i=0;i<weightGroup.length-1;i++){
            	var w = weightGroup[i];
            	vizChartScript +='placeholder_'+w+'->placeholder_'+weightGroup[++i]+'[ label="weight=16", rank=same, shape=none, style=invis ];'
            }
            nestedData.forEach(function(n){
            	vizChartScript +='subgraph cluster_weight_'+n.key+' {label="weight='+n.key+'";	rank=same;	shape=none;	style=invis;';
            	n.values.forEach(function(value){
            		var shapeType = 'record';
                if(value['labels']!==null){
                    var labelIDs = value['labels'].map(function(label){
                        return label['ID'];
                    });
                    if(labelIDs.indexOf('epic')!==-1){
                        shapeType = 'oval';
                    }else{
                    	shapeType = 'record';
                    }                        
                };
                if(shapeType=='record'){
                	vizChartScript +='"'+value['url']+'" [ color=pink, href="'+value['url']+'", label=<'+value['number']+'>, shape=record, style="rounded,filled" ];'
                }else{
                	vizChartScript +='"'+value['url']+'" [ color=orange, href="'+value['url']+'", label=<'+value['number']+'>, shape=oval, style="rounded,filled" ];'
                }            		
            	})
            	vizChartScript +='placeholder_'+n.key+' [ label="weight='+n.key+'", rank=same, shape=none, style=invis ];}';
            })

            vizChartScript += '}';
            console.log(vizChartScript);
			var options = {
			  format: 'svg'  
			}

			var image = Viz(vizChartScript, options);
			var main = document.getElementById('main');

			main.innerHTML = image;

        });
// SVG
function makeLinks(showData){    
    showData.forEach(function(datum){
        if(datum['children']!==null){                                    
            datum['children'].forEach(function(child){                                           	
                vizChartScript += '"'+datum['url']+'"->"'+child+'"[color=orange, dir=none, style=dashed ]; ';
            })                                    
        }
    })    
}

function getIndexByUrl(url,data){
    var number;
    data.forEach(function(d){
        if(d['url']==url){
            number =  d['number'];
        }
    })
    return number;
}				
