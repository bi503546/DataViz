
(function (d3) {
    'use strict';
    const xAxisLabelText = 'Nombre de Vente par modèle';
    const svg = d3.select('svg');
  
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    

    const render = data => {
      svg.selectAll("*").remove();
      var allModels = new Array();
      var modelsNeufs=new Array();
      var modelsOccasions = new Array();
      for (var i = 1; i <  Object.keys(data).length -1 ; i++) {
        if(allModels != null){
          if(allModels.find( car => (car.nom === data[i].nom))){
            var x = allModels.findIndex(car => (car.nom === data[i].nom));
            allModels[x].nombre +=1;
          }
          else {
            var maVoiture = Object();
            maVoiture.marque = data[i].marque;
            maVoiture.nom = data[i].nom;
            maVoiture.model = data[i].marque +' '+data[i].nom;
            maVoiture.occasion = data[i].occasion;
            maVoiture.nbPorte = data[i].nbPortes;
            maVoiture.nbPlace = data[i].nbPlaces;
            maVoiture.nombre = 1;
            allModels.push(maVoiture);
            if(data[i].occasion == 'true'){
              modelsOccasions.push(maVoiture);
            }
            if(data[i].occasion == 'false'){
              modelsNeufs.push(maVoiture);
            }
          }
        }
        if(modelsNeufs != null){
          if(modelsNeufs.find( car => (car.nom === data[i].nom))){
            var x = modelsNeufs.findIndex(car => (car.nom === data[i].nom));
            modelsNeufs[x].nombre +=1;
          }
        }
        if(modelsOccasions != null){
          if(modelsOccasions.find( fruit => (fruit.nom === data[i].nom))){
            var x = modelsOccasions.findIndex(fruit => (fruit.nom === data[i].nom));
            modelsOccasions[x].nombre +=1;
          }
        }

    }
    console.log("modelsOccasions : ",modelsOccasions );
    console.log("modelsNeufs : ",modelsNeufs );
    console.log("allModels : ",allModels );

    d3.select("#graphe").on("change", update)
    

    
    d3.select("#trois").on("change",update);
    d3.select("#cinq").on("change",update);
			update();
			
      
      var filteredData = new Array();
    	function update(){
        var newData = new Array();
        var titleText = "";
        console.log("Update !!")
        if(d3.select("#graphe").node().value =="grapheNeuf"){
          console.log("grapheNeuf");
          titleText = 'Les véhicules Neufs les plus achetés';
          newData = modelsNeufs;
        }
        else if(d3.select("#graphe").node().value =="grapheOccasion"){
          console.log("grapheOccasion");
          titleText = 'Les véhicules Occasions les plus achetés';
          newData = modelsOccasions;
        }
        else if(d3.select("#graphe").node().value =="grapheAll"){
          console.log("grapheAll");
          titleText = 'Les véhicules Neufs et Occasions les plus achetés';
          newData = allModels;
        }
        else {
          alert("choisie un graphe");
        }
        if(d3.select("#trois").property("checked")){
          filteredData = newData.filter(function(d,i){return d.nbPorte == "3";});
          svg.selectAll("*").remove();
          if(d3.select("#cinq").property("checked")){
            let cinq = newData.filter(function(d,i){return d.nbPorte == "5";});
            for(let i = 0; i < cinq.length; i++ ){
              filteredData.push(cinq[i]);
            }
            console.log("filteredData => ", filteredData)
            svg.selectAll("*").remove();
          }
        } 
        else if(d3.select("#cinq").property("checked")){
          filteredData = newData.filter(function(d,i){return d.nbPorte == "5";});
          svg.selectAll("*").remove();
          if(d3.select("#trois").property("checked")){
            let trois = newData.filter(function(d,i){return d.nbPorte == "3";});
            for(let i = 0; i < trois.length; i++ ){
              newData.push(trois[i]);
            }
            console.log("filteredData => ", filteredData)
            svg.selectAll("*").remove();
          }
        }else {
            filteredData = newData;	
            console.log("new Date sans checkBox=> ", newData);
            svg.selectAll("*").remove();
        }	
        var max = d3.max(filteredData, function(d) { return +d.nombre} );
        filteredData.forEach(x => {
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
            .domain(filteredData.map(yValue))
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
          
          g.selectAll('rect').data(filteredData)
            .enter().append('rect')
            .attr("class", "bar")
              .attr('y', d => yScale(yValue(d)))
              .attr('width', d => xScale(xValue(d)))
              .attr('height', yScale.bandwidth())
              .on("mouseover", function(d) {
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9)
                    .style("background", "lightgray")
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("width", 200 +"px")
                    .style("height", 110+"px")
                    .style("padding", 2+"px")
                    .style("font", 16+"px sans-serif")
                    .style("border", 0+"px")
                    .style("border-radius", 8+"px")
                    .style("overflow","hidden");
                div.html(d.model + "<br>occasion : "+ d.occasion +"<br>Nombre de Vente : "+ d.nombre + "<br>Nombre de Place :"+ d.nbPlace + "<br>Nombre de Porte :" + d.nbPorte)
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
      
      
    }
    d3.csv('file.csv').then(data => {    
      render(data);
    });
  
  }(d3));
  