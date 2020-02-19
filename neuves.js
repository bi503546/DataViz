
(function (d3) {
  'use strict';
  const titleText = 'Modèles de véhicule Neuves les plus achetés';
  const xAxisLabelText = 'Nombre de Vente';
  const yAxisLabelText = 'Modèles de véhicule';
  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const render = data => {
    var modelsNeufs=new Array();
    for (var i = 1; i <  Object.keys(data).length -1 ; i++) {
      if(modelsNeufs != null){
        if(modelsNeufs.find( car => (car.nom === data[i].nom))){
          var x = modelsNeufs.findIndex(car => (car.nom === data[i].nom));
          modelsNeufs[x].nombre +=1;
        }
        else {
          var maVoiture = Object();
          maVoiture.marque=data[i].marque;
          maVoiture.nom =data[i].nom;
          maVoiture.model = data[i].marque +' '+data[i].nom;
          maVoiture.occasion=data[i].occasion;
          maVoiture.nbPorte = data[i].nbPortes;
          maVoiture.nbPlace = data[i].nbPlaces;
          maVoiture.nombre = 1;
          if(data[i].occasion == 'true'){
            modelsNeufs.push(maVoiture);
          }
        }
      }
    }


    var max = d3.max(modelsNeufs, function(d) { return +d.nombre} );
    svg.selectAll("*").remove();
    modelsNeufs.forEach(x => {
      const xValue = x => x.nombre;
      const yValue = x => x.model;
      const margin = { top: 50, right: 40, bottom: 77, left: 180 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const div = d3.select("body").append("div")
        .attr("class", "tooltip");
      
      const yScale = d3.scaleBand()
        .domain(modelsNeufs.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);
      const xScale = d3.scaleLinear()
        .domain([0, max+1])
        .range([0, innerWidth]);
      
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      const xAxisTickFormat = number =>
        d3.format('.3s')(number)
          .replace('G', 'B');
      
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);
      
      g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");
      const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);
      
      xAxisG.select('.domain').remove();
      
      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('y', 65)
          .attr('x', innerWidth / 2)
          .attr('fill', 'black')
          .text(xAxisLabelText);
      
      g.selectAll('rect').data(modelsNeufs)
        .enter().append('rect')
          .attr('y', d => yScale(yValue(d)))
          .attr('width', d => xScale(xValue(d)))
          .attr('height', yScale.bandwidth())
          .on("mouseover", function(d) {
            div.transition()        
            .duration(200)      
            .style("opacity", .9)
            .style("background", "lightsteelblue")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("width", 150 +"px")
            .style("height", 60+"px")
            .style("padding", 2+"px")
            .style("font", 16+"px sans-serif")
            .style("border", 0+"px")
            .style("border-radius", 8+"px")
            .style("overflow","hidden");
            div.html("Nombre : "+ d.nombre + "<br>nb de Place :"+ d.nbPlace + "<br>nb de Porte :" + d.nbPorte)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
          


      /**
       * position: absolute;			
    text-align: center;			
    width: 60px;					
    height: 60px;					
    padding: 2px;				
    font: 12px sans-serif;		
    background: lightsteelblue;	
    border: 0px;		
    border-radius: 8px;			
    pointer-events: none;
       */
      g.append('text')
          .attr('class', 'title')
          .attr('y', -10)
          .text(titleText);
    }

    );
    
  };

  d3.csv('file.csv').then(data => {    
    render(data);
  });

}(d3));
