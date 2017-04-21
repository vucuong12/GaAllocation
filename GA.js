


function GA(clients, resources){
	this.clients = clients;
	this.resources = resources;
	this.popmax = POP_MAX;
	this.mutationRate = MUTATION_RATE;
	//this.population = new Population(this.clients, this.resources, this.mutationRate, this.popmax);
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

			
			// If we found the target phrase, stop
			if (this.population.isFinished()) {
				this.displayInfo();
				break;
			}
			
		}
		return this.population.getBest();
	}

	this.displayInfo = function() {


	  	// Display current status of population
	  	var answer = this.population.getBest(); // {maxClients, matchingClients: [[R1,R2],[R2,],[R1]]}
	  	//console.log(this.generations())
	  	//console.log("Best answer " + JSON.stringify(answer));
	  	if (answer.nCapacityViolations > 0) {
	  		$("#maxNumClients").html("Cannot find any valid solution")
	  		return;
	  	}
	  	
	  	$("#maxNumClients").html("Max number of clients:<br>" + answer.maxClients);

	  	//Matching result
	  	var htmlString = "";
	  	for (var i = 0; i < answer.matchingClients.length; i++){
	    	htmlString += "Client " + (i) + " : ";
	    	for (var j = 0; j < answer.matchingClients[i].length; j++){
	      		htmlString += "resource " +(answer.matchingClients[i][j]) + " , "; 
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