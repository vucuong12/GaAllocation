function GA(clients, resources){
	this.clients = clients;
	this.resources = resources;
	this.popmax = 200;
	this.mutationRate = 0.01;
	this.population = new Population(this.clients, this.resources, this.mutationRate, this.popmax);
	this.updateDataset = function (clients, resources){
		this.clients = clients;
		this.resources = resources;
		this.population = new Population(this.clients, this.resources, this.mutationRate, this.popmax);
	}
	this.runGA = function(){
		while (1){
			// Generate mating pool
			this.population.naturalSelection();
			//Create next generation
			this.population.generate();
			// Calculate fitness
			this.population.calcFitness();

			this.population.evaluate();

			this.displayInfo();
			// If we found the target phrase, stop
			if (this.population.isFinished()) {
				break;
			}
			
		}
		return this.population.getBest();
	}

	this.displayInfo = function() {

	  	// Display current status of population
	  	var answer = this.population.getBest(); // {maxClients, matchingClients: [[R1,R2],[R2,],[R1]]}
	  	$("#maxNumClients").html("Max number of clients:<br>" + answer.maxClients);

	  	//Matching result
	  	var htmlString = "";
	  	for (var i = 0; i < answer.matchingClients.length; i++){
	    	htmlString += "Client " + (i + 1) + " : ";
	    	for (var j = 0; j < answer.matchingClients[i].length; j++){
	      		htmlString += "resource " +(1 + answer.matchingClients[i][j]) + " , "; 
	    	}
	    	htmlString += "<br>";
	 	}
		$("#matchingResult").html("Matching Result:<br>" + htmlString);

		//Stats
	  	var statstext = "total generations:     " + this.population.getGenerations() + "<br>";
	  	statstext +=    "average fitness:       " + (this.population.getAverageFitness()) + "<br>";
	  	statstext +=    "total population:      " + this.popmax + "<br>";
	  	statstext +=    "mutation rate:         " + Math.floor(this.mutationRate * 100) + "%";
	  	$("#stats").html(statstext);

	}
}