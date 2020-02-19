
(function (d3) {
    'use strict';
    const titleText = 'Modèles de véhicule occasions les plus achetés';
    const xAxisLabelText = 'Nombre de Vente par modèle ';
    const yAxisLabelText = 'Modèles de véhicule';
    const svg = d3.select('svg');  
    const width = +svg.attr('width');
    const height = +svg.attr('height');
  
    const render = data => {
      svg.selectAll("*").remove();
      var modelsOccasions = new Array();
      for (var i = 1; i <  Object.keys(data).length -1 ; i++) {
        if(modelsOccasions != null){
          if(modelsOccasions.find( fruit => (fruit.nom === data[i].nom))){
            var x = modelsOccasions.findIndex(fruit => (fruit.nom === data[i].nom));
            modelsOccasions[x].nombre +=1;
          }
          else {
            var maVoiture = Object();
            maVoiture.marque=data[i].marque;
            maVoiture.nom =data[i].nom;
            maVoiture.occasion=data[i].occasion;
            maVoiture.model = data[i].marque +' '+data[i].nom;
            maVoiture.nombre = 1;
            if(data[i].occasion == 'true'){
              modelsOccasions.push(maVoiture);
            }
          }
        }
      }
  
      console.log("modelsOccasions : ",modelsOccasions );
      var max = d3.max(modelsOccasions, function(d) { return +d.nombre} );
      modelsOccasions.forEach(x => {
        const xValue = x => x.nombre;
        const yValue = x => x.model;
        const margin = { top: 50, right: 40, bottom: 77, left: 180 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        const xScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, innerWidth]);
        
        const yScale = d3.scaleBand()
          .domain(modelsOccasions.map(yValue))
          .range([0, innerHeight])
          .padding(0.1);
        
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
          .selectAll('.domain, .tick line')
            .remove();
        
        const xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
        
        xAxisG.select('.domain').remove();
        
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 65)
            .attr('x', innerWidth / 2)
            .attr('fill', 'black')
            .text(xAxisLabelText);
        
        g.selectAll('rect').data(modelsOccasions)
          .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => xScale(xValue(d)))
            .attr('height', yScale.bandwidth());
        
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(titleText);
      });      
    };
  
    d3.csv('file.csv').then(data => {      
      render(data);
    });
  
  }(d3));
  