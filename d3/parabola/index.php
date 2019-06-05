<!DOCTYPE html>
<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">   
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
   <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
   <title>Parabola Chart</title>
   <style>      
      svg { width: 100%; height: 100%; }
      path {
      fill: none;
      stroke: teal;
      }

      .axis line{
        stroke: #aaa;
      }
      .axis path, line {
      stroke: black;
      shape-rendering: crispEdges;
      }
      .axis text {
      fill: black;
      font-size: 11px;
      }
      #chart_wrapper{
      width: 100%;      
      }
      #input_wrapper{          
      padding:30px;
      box-sizing: border-box;
      }

      .line1,.line2{
        stroke-width:2px;
      }
      .line1text, .line2text{
        text-anchor: middle;
      }
      .line1text{
        fill: #66bb6a;
      }
      .line1{
        stroke: #66bb6a;
      }
      .line2text{
        fill: #e53935;
      }
      .line2{
        stroke: #e53935;
      }

      .xline{
        stroke: #004884;
        stroke-width: 3px;
      }
      .yline{
        stroke-width: 3px;
        stroke: red;
        stroke-dasharray: 7 3;
      }

      .demand_circle{
        fill:#ff7f00;
      }
      .circle_pos{
        fill: #ff7f00;
        text-anchor: middle;
      }
      label{
        display: block;        
      }

      #test_table td,#system_table td,#demand_table td{
        border: 1px solid black;
        padding:10px;
      }
      #test_table,#system_table,#demand_table{
        text-align: center;
      }
      table input{
        text-align: center;
        max-width: 100px;
      }
      #system_table label{
        color: #e53935;
      }
      #demand_table label{
        color: #ff7f00;
      }
      #test_table label{
        color: #66bb6a;        
      }      

      @media screen and (max-width: 767px){
        table input{
          max-width: 50px;
        }
      }
   </style>
</head>
<body>
  <?php 
    if($_GET){
    var_dump($_GET);
  }
  ?>
   <div id="chart_wrapper"></div>
<div id="input_wrapper">
   <div class="container-fluid">
      <div class="row">
         <div class="col-sm-12">

          <form method="GET">
            <h2> Test results </h2>
            <table id="test_table" class="table">
               <tr>
                  <td>
                     <div><label> X6 :</label><input type="text" id="x6" onchange="changeABC(2)" value="1500" /></div>
                  </td>
                  <td>
                     <div><label> X5 :</label><input type="text" id="x5" onchange="changeABC(2)" value="1000" /></div>
                  </td>
                  <td>
                     <div><label> X4 :</label><input type="text" id="x4" onchange="changeABC(2)" value="0"/></div>
                  </td>
                  <td>Flow</td>
               </tr>
               <td>
                  <div><label> Y6 :</label><input type="text" id="y6" onchange="changeABC(2)" value="80" /></div>
               </td>
               <td>
                  <div><label> Y2 :</label><input type="text" id="y5" onchange="changeABC(2)" value="100" /></div>
               </td>
               <td>
                  <div><label> Y1 :</label><input type="text" id="y4" onchange="changeABC(2)" value="110" /></div>
               </td>
               <td>Pressure</td>
               <tr>
               </tr>
            </table>

            <h2> System Data </h2>
            <table id="system_table" class="table">
               <tr>
                  <td>
                     <div><label> X3 :</label><input type="text" id="x3" onchange="changeABC(1)" name="x3" value="1500" /></div>
                  </td>
                  <td>
                     <div><label> X2 :</label><input type="text" id="x2" onchange="changeABC(1)" name="x2" value="1000"/></div>
                  </td>
                  <td>
                     <div><label> X1 :</label><input type="text" id="x1" onchange="changeABC(1)" name="x1" value="0"/></div>
                  </td>
                  <td>Flow</td>
               </tr>
               <tr>
                  <td>
                     <div><label> Y3 :</label><input type="text" id="y3" onchange="changeABC(1)" name="y3" value="90" /></div>
                  </td>
                  <td>
                     <div><label> Y2 :</label><input type="text" id="y2" onchange="changeABC(1)" name="y2" value="100"/></div>
                  </td>
                  <td>
                     <div><label> Y1 :</label><input type="text" id="y1" onchange="changeABC(1)" name="y1" value="105"/></div>
                  </td>
                  <td>Pressure</td>
               </tr>
            </table>

            <h3>System demand</h3>
            <table id="demand_table" class="table">
            <tr><td><label> X7 :</label><input type="text" id="x7" value="800" name="x7" onchange="changeCircle()"/></td></tr>
            <tr><td><label> Y7 :</label><input type="text" id="y7" value="80" name="y7" onchange="changeCircle()"/></td></tr>
          </table>
          <input type="submit" value="Send" />
        </form>
         </div>
      </div>
   </div>
</div>
   <script>
    var margin = {top: 50, right: 100, bottom: 100, left: 100};
    
    if($("#chart_wrapper").width() < 767){
      margin.left = 30;
      margin.right = 30;
      margin.top = 30;
      margin.bottom = 30;
    }
      
      var width = $("#chart_wrapper").width() - margin.left - margin.right;

      var height = 800 - margin.top - margin.bottom;

      if($("#chart_wrapper").width() < 767){
        height = width * 2 / 3 - margin.top - margin.bottom;
      }      
      
      var svg = d3.select("#chart_wrapper").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var a = 1, b= 1, c = 1;
      var fn = function (x,a,b,c) {
        return a * Math.pow(x, 2) + b * x + c; 
      };
      
      var x = d3.scale.linear()
        .range([0, width]);
      
      var y = d3.scale.linear()
        .range([height, 0]);
      
      var xAxis = d3.svg.axis()
        .scale(x);
      
      var yAxis = d3.svg.axis()
        .orient('left')
        .scale(y);
      
      var line = d3.svg.line()
        .interpolate('basis')
        .x(function (d) {return x(d.x);})
        .y(function (d) {return y(d.y);});
      
      x.domain([0,2500]);
      y.domain([0, 200]);
      
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.tickSize(-height));
      
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis.tickSize(-width));

    svg
        .append("text").attr('class', 'y_label_text')
        .attr("transform", "translate(-35," + (height + margin.bottom) / 2 + ") rotate(-90)")
        .text("Pressure [PSI] ");

    svg
        .append("text").attr('class', 'x_label_text')
        .attr("transform", "translate(" + ((margin.left + width) / 2) + "," + (height + 50) + ")")
        .attr('text-anchor', 'middle')
        .text("Flow [GPM]");

      drawDemandCircle($("#x7").val(), $("#y7").val());
      function drawDemandCircle(cx,cy){
        svg.select('.demand_circle').remove();
        svg.append('circle').attr('class','demand_circle').attr('cx',x(cx)).attr('cy',y(cy)).attr('r',10);

        svg.select('.circle_pos').remove();
        svg.append('text').attr('class','circle_pos').attr('x',x(cx) - 50).attr('y',y(cy) - 10).text("X7,Y7");
        svg.append('text').attr('class','circle_pos').attr('x',x(cx) - 50).attr('y',y(cy) + 10).text("(" +cx +"," +cy+")");
        svg.append('text').attr('class','circle_pos').attr('x',x(cx) + 50).attr("y",y(cy)+30).text("System Demand");
      }
      changeABC(1);
      changeABC(2);
      drawStaticLines();      
      function drawStaticLines(){
        svg.append('line').attr('class','xline').attr('x1',x(0)).attr('x2',x(2500)).attr('y1',y(65)).attr('y2',y(65));
        svg.append('line').attr('class','xline').attr('x1',x(0)).attr('x2',x(2500)).attr('y1',y(140)).attr('y2',y(140));
        svg.append('text').attr('x',x(0)+3).attr('y',y(65) - 10).text("Min Pressure 65% 65 [PSI]").attr("fill","#004884");
        svg.append('text').attr('x',x(0)+3).attr('y',y(140) - 10).text("Max Pressure 140% 140 [PSI]").attr("fill","#004884");
        svg.append('line').attr('class','yline').attr('x1',x(1000)).attr('x2',x(1000)).attr('y1',y(0)).attr('y2',y(200));
        svg.append('line').attr('class','yline').attr('x1',x(1500)).attr('x2',x(1500)).attr('y1',y(0)).attr('y2',y(200));
        svg.append("text").attr("transform", "translate("+(x(1000) + 20)+"," + (y(0) - 5) + ") rotate(-90)").attr("fill","red").text("1000 [GPM] ");
        svg.append("text").attr("transform", "translate("+(x(1000) - 10)+"," + (y(0) - 5) + ") rotate(-90)").attr("fill","black").text("100% Capacity");
        svg.append("text").attr("transform", "translate("+(x(1500) + 20)+"," + (y(0) - 5) + ") rotate(-90)").attr("fill","red").text("1500 [GPM] ");
        svg.append("text").attr("transform", "translate("+(x(1500) - 10)+"," + (y(0) - 5) + ") rotate(-90)").attr("fill","black").text("150% Capacity ");
      }
      function drawChart(x1,x2,x3,y1,y2,y3,lineno){
        //get a,b,c value
        var denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
        a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
        b = (x3^2 * (y1 - y2) + x2^2 * (y3 - y1) + x1^2 * (y2 - y3)) / denom;
        c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;                     
        
        var data = d3.range(d3.min([x1,x2,x3]), d3.max([x1,x2,x3])).map(function (d) {
          return {x:d, y:fn(d,a,b,c)};
        });             

        if(lineno == 1){
          svg.select('.line1').remove();
          svg.append('path')        
          .datum(data)
          .attr('class','line1')
          .attr('d', line);

          svg.selectAll('.line1text').remove();
          svg.append('text').attr('x',x(x1)).attr('y',y(y1) - 10).text("X1,Y1").attr('class','line1text');
          svg.append('text').attr('x',x(x1)).attr('y',y(y1) + 10).text("("+x1+',' +y1 +")").attr('class','line1text');
          svg.append('text').attr('x',x(x2)).attr('y',y(y2) - 10).text("X2,Y2").attr('class','line1text');
          svg.append('text').attr('x',x(x2)).attr('y',y(y2) + 10).text("("+x2+',' +y2 +")").attr('class','line1text');
          svg.append('text').attr('x',x(x3)).attr('y',y(y3) - 10).text("X3,Y3").attr('class','line1text');
          svg.append('text').attr('x',x(x3)).attr('y',y(y3) + 10).text("("+x3+',' +y3 +")").attr('class','line1text');

          svg.append("text").attr("x", x(x3) - 500).attr("y",y(y3) - 10).text("Test Results").attr('class','line1text').attr("font-weight",'bold');
        }else{
          svg.select('.line2').remove();
          svg.append('path')        
          .datum(data)
          .attr('class','line2')
          .attr('d', line);

          svg.selectAll('.line2text').remove();
          svg.append('text').attr('x',x(x1)).attr('y',y(y1) - 10).text("X4,Y4").attr('class','line2text');
          svg.append('text').attr('x',x(x1)).attr('y',y(y1) + 10).text("("+x1+',' +y1 +")").attr('class','line2text');
          svg.append('text').attr('x',x(x2)).attr('y',y(y2) - 10).text("X5,Y5").attr('class','line2text');
          svg.append('text').attr('x',x(x2)).attr('y',y(y2) + 10).text("("+x2+',' +y2 +")").attr('class','line2text');
          svg.append('text').attr('x',x(x3)).attr('y',y(y3) - 10).text("X6,Y6").attr('class','line2text');
          svg.append('text').attr('x',x(x3)).attr('y',y(y3) + 10).text("("+x3+',' +y3 +")").attr('class','line2text');
        }         
      }

      function changeABC(lineno){
        if(lineno == 1){
          var x1 = $("#x1").val();
          var x2 = $("#x2").val();
          var x3 = $("#x3").val();
          var y1 = $("#y1").val();
          var y2 = $("#y2").val();
          var y3 = $("#y3").val();
          if(x1 && x2 && x3 && y1 && y2 && y3){
            drawChart(x1,x2,x3,y1,y2,y3, lineno);            
          }else{
            console.log('error');
          }
        }else if(lineno  == 2){
          var x1 = $("#x4").val();
          var x2 = $("#x5").val();
          var x3 = $("#x6").val();
          var y1 = $("#y4").val();
          var y2 = $("#y5").val();
          var y3 = $("#y6").val();
          if(x1 && x2 && x3 && y1 && y2 && y3){
            drawChart(x1,x2,x3,y1,y2,y3, lineno);            
          }else{
            console.log('error');
          }
        }
      }

      function changeCircle(){
       drawDemandCircle($("#x7").val(), $("#y7").val()); 
      }

  $(window).on("resize", function () {
    draw();
  });
   </script>
</body>