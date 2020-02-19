
(function (d3) {
    'use strict';
    const titleText = 'Modèles de véhicule les plus achetés';
    const xAxisLabelText = 'Nombre de Vente par modèle';
    const svg = d3.select('svg');
  
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    

    const render = data => {
        svg.selectAll("*").remove();
      var allModels = new Array();
      for (var i = 1; i <  Object.keys(data).length -1 ; i++) {
        if(allModels != null){
          if(allModels.find( car => (car.nom === data[i].nom))){
            var x = allModels.findIndex(car => (car.nom === data[i].nom));
            allModels[x].nombre +=1;
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
            allModels.push(maVoiture);
            }
        }
    }
   
      var max = d3.max(allModels, function(d) { return +d.nombre} );
      allModels.forEach(x => {
        console.log("allmodel.nombre de "+ x.model + " : "+ x.nombre);
        const xValue = x => x.nombre;
        const yValue = x => x.model;
        const margin = { top: 50, right: 40, bottom: 77, left: 180 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        const div = d3.select("body").append("div")
        .attr("class", "tooltip")         
        .style("opacity", .9);

        const xScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, innerWidth]);
        
        const yScale = d3.scaleBand()
          .domain(allModels.map(yValue))
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
          .call(d3.axisLeft(yScale).ticks(6))
          .selectAll('.domain, .tick line')
            .remove();
        
        const xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
        
        xAxisG.select('.domain').remove();
        
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 65)
            .attr('x', innerWidth / 2)
            .text(xAxisLabelText);
        
        g.selectAll('rect').data(allModels)
          .enter().append('rect')
          .attr("class", "bar")
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
            
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(titleText);
     
    });
    }
    d3.csv('file.csv').then(data => {    
      render(data);
    });
  
  }(d3));
  