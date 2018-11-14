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

  var orphansWithoutLinksLength = orphansWithoutLinks.length;
  var orphansWithoutLinks1 = orphansWithoutLinks.filter(function(d,i){
  	if(i<orphansWithoutLinksLength/2){
  		return d;
  	}
  })

  var orphansWithoutLinks2 = orphansWithoutLinks.filter(function(d,i){
  	if(i>=orphansWithoutLinksLength/2){
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
  vizChartScript += 'subgraph cluster_orphans_without_links { label="orphans without links";	style=dashed; ';
  vizChartScript +='subgraph cluster_orphans_without_links_0 { label="";	style=invis;'
    orphansWithoutLinks1.forEach(function(d){            		    	
			vizChartScript += '"'+d['url']+'" ' + '[ color=gray, href="'+d['url']+'",'+'label=<'+wrapTable(d['title'])+'>, shape=record, style="rounded,filled"]; ';
		})
							           
	vizChartScript += 'placeholder_orphans_without_links_0 [ label="", style=invis ];}';

  vizChartScript +='subgraph cluster_orphans_without_links_1 { label="";	style=invis;'
    orphansWithoutLinks2.forEach(function(d){            		    	
			vizChartScript += '"'+d['url']+'" ' + '[ color=gray, href="'+d['url']+'",'+'label=<'+wrapTable(d['title'])+'>, shape=record, style="rounded,filled"]; ';
		})
							           
	vizChartScript += 'placeholder_orphans_without_links_1 [ label="", style=invis ];}';
	vizChartScript +='}';
                        
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
                        


            // weightGroup.forEach(function(weight,i){
            // 	placeholder_1->placeholder_2[ label="weight=16", rank=same, shape=none, style=invis ];
            // 	vizChartScript +='pl'
            // })  
            vizChartScript += 'placeholder_orphans_without_links_1->placeholder_orphans_without_links_0[ label="weight=16", rank=same, shape=none, style=invis ];';
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
                	var ts = value['title'].replace(/[^a-zA-Z ]/g, "");
                	vizChartScript +='"'+value['url']+'" [ color=pink, href="'+value['url']+'", label=<'+wrapTable(value['title'])+'>, shape=record, style="rounded,filled" ];'
                }else{
                	var ts = value['title'].replace(/[^a-zA-Z ]/g, "");
                	vizChartScript +='"'+value['url']+'" [ color=orange, href="'+value['url']+'", label=<'+wrapTable(value['title'])+'>, shape=oval, style="rounded,filled" ];'
                }            		
            	})
            	vizChartScript +='placeholder_'+n.key+' [ label="weight='+n.key+'", rank=same, shape=none, style=invis ];}';
            })

            vizChartScript += '}';
            
			var options = {
			  format: 'svg'  
			}

            console.log(vizChartScript);
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

		
wrapTable("airtable: use dedicated tables for milestones & labels + auto provision them");
wrapTable("Show epic's completion rate");
wrapTable("feat: use a minimal record when an error occurs");
wrapTable("make '--fetch' the default behavior (add '--no-fetch' instead)");
wrapTable("Support Cross-Provider dependencies (GitHub -> GitLab)");
function wrapTable(title){	
    title = title.replace(/&/g, "#");    
    title = title.replace(/->/g, "#");    
 	var words = title.split(/\s+/).reverse(),
    word,
    line = [];    
            
    var tString = '<table>';  
    var tdString = '';
    console.log(words);
    while (word = words.pop()) {    
        line.push(word);        
        tdString = '<tr><td>'+line.join(" ") +'</td></tr>';                
        if (line.join(" ").length > 30) {
            line.pop();
            tdString = '<tr><td>' + (line.join(" ")) + '</td></tr>';
            tString +=tdString;
            line = [word];                                    
            tdString = '<tr><td>' + (word) + '</td></tr>';
            if(words.length == 0){                
                tString +=tdString;
            }
        }else if(words.length == 0){            
            tString +=tdString;
        }
    };
    tString +='</table>';

    console.log(tString);
    return tString;
}