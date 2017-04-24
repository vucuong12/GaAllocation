
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Genetic Algorithm, Evolving Shakespeare

// A class to describe a population of virtual organisms
// In this case, each organism is just an instance of a DNA object

function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Population(clients, resources, m, num) {

	this.population;                   // Array to hold the current population
	this.matingPool;                   // ArrayList which we will use for our "mating pool"
	this.generations = 0;              // Number of generations
	this.finished = false;             // Are we finished evolving?
	this.nClients = clients.length;                   // Target phrase
	this.nResources = resources.length;
	this.mutationRate = m;             // Mutation rate
	this.perfectScore = 1;
	this.nearbyResForClientByType = [];

	this.best = "";

	this.population = [];

	this.matingPool = [];
	this.accumulativeProb = [];

	this.createNearbyResForClientByType = function(GAclients, GAresources) {
		for (var clientID = 0; clientID < GAclients.length; clientID++){
				var oneClient = {};
				for (var i = 0; i < GAclients[clientID].nearbyResources.length; i++){
					var resourceType = GAresources[GAclients[clientID].nearbyResources[i]].type;
					if (oneClient[resourceType.toString()]){
							oneClient[resourceType.toString()].push(GAclients[clientID].nearbyResources[i])
					} else {
							oneClient[resourceType.toString()] = [-1, GAclients[clientID].nearbyResources[i]];
					}
				}

				
				this.nearbyResForClientByType.push(oneClient);
		}
	}
	this.createNearbyResForClientByType(clients, resources);
	for (var i = 0; i < num; i++) {
		this.population.push(new DNA(clients, resources, this.nearbyResForClientByType));
	}


	this.calcFitness = function() {
		for (var i = 0; i < this.population.length; i++) {
			this.population[i].calcFitness();
		}
	}
	this.calcFitness();


	this.naturalSelection1 = function() {
		var maxFitness = 0;
		for (var i = 0; i < this.population.length; i++) {
			if (this.population[i].fitness > maxFitness) {
				maxFitness = this.population[i].fitness;
			}
		}

		for (var i = 0; i < this.population.length; i++) {
			var fitness = maxFitness === 0 ? 1 : (this.population[i].fitness) / maxFitness;
			var n = Math.floor(fitness * 100);  
			for (var j = 0; j < n; j++) {       
				this.matingPool.push(this.population[i]);
			}
		}

	}
	/*
		O(n) n = total number of clients
	*/
	this.naturalSelection = function(){
		this.accumulativeProb = [];

		var totalFitness = 0;
		for (var i = 0; i < this.population.length; i++){
			totalFitness += this.population[i].fitness;
		}

		if (totalFitness == 0){
			for (var i = 0;i < this.population.length; i++){
				this.accumulativeProb.push((i + 1) / (this.population.length))
			}
		} else {
			var sum = 0;
			for (var i = 0; i < this.population.length; i++){
				sum += totalFitness === 0 ? 1 : this.population[i].fitness / totalFitness;
				this.accumulativeProb.push(sum);
			}
		}

		
		this.accumulativeProb[this.accumulativeProb.length - 1] = 1.0;
	}
	/*
		Return chromosome having accumulative value target such that prob[chroIndex - 1] <= target < prob[chroIndex]
		target = [0, 1]


	*/
	this.binarySearch = function(accumulativeProb, target){
		var targetChroIndex = -1;
		var left = 0, right = this.population.length - 1;
		while (left <= right){
			var mid = Math.floor((left + right) / 2);
			if (target <= accumulativeProb[mid]){
				targetChroIndex = mid;
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}
		return this.population[targetChroIndex];
	}

	this.chooseOneRandomChromosome = function () {
		return this.binarySearch(this.accumulativeProb, Math.random());
	}

	// Create a new generation 
	// O(nPop * nServices)
	this.generate = function() {
		var newPopulation = [];
		var bestFiveChro = [];
		for (var iter = 0; iter < ELITISM_NUM; iter++){
			var maxValue = -1;
			var maxIndex = -1;
			for (var i = 0; i < this.population.length; i++){
				if (maxValue < this.population[i].fitness && bestFiveChro.indexOf(i) === -1){
					maxValue = this.population[i].fitness;
					maxIndex = i;
				}
			}
			bestFiveChro.push(maxIndex);  
		}

		for (var i = 0; i < ELITISM_NUM; i++) {
			newPopulation.push(this.population[bestFiveChro[i]]);
		}
		
		for (var i = 0; i < this.population.length - ELITISM_NUM; i++) {
			var partnerA = this.chooseOneRandomChromosome();
			var partnerB = this.chooseOneRandomChromosome();
			var child = partnerA.crossover(partnerB);
			child.mutate(this.mutationRate);
			newPopulation.push(child);
		}
		this.population = newPopulation;
		this.generations++;
	}


	this.getBest = function() {
		return this.best;
	}

	// Compute the current "most fit" member of the population
	this.evaluate = function() {
		var worldrecord = 0.0;
		var index = 0;
		for (var i = 0; i < this.population.length; i++) {
			if (this.population[i].fitness > worldrecord) {
				index = i;
				worldrecord = this.population[i].fitness;
			}
		}

		this.best = this.population[index].getMatching();
		if (this.getGenerations() % VIEW_RATE === 0){
			
			console.log("Generations: " + this.getGenerations() + ": " + this.getBest().maxClients + ". Fitness: " + this.getBest().fitness + ". nCapacityViolations: " + this.getBest().nCapacityViolations);
			//printAttributes(this.getBest(), ["maxClients", "fitness","nConnectedClients", "nTotalValidCon", "nCapacityViolations"])
		}
		if (this.generations === MAX_GENERATIONS || worldrecord === this.perfectScore) {
			this.finished = true;
		}
	}

	this.isFinished = function() {
		return this.finished;
	}

	this.getGenerations = function() {
		return this.generations;
	}

	// Compute average fitness for the population
	this.getAverageFitness = function() {
		var total = 0;
		for (var i = 0; i < this.population.length; i++) {
			total += this.population[i].fitness;
		}
		return total / (this.population.length);
	}
}

