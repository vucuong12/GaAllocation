


function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Constructor (makes a random DNA)
function DNA(clients, resources, nearbyResForClientByType) {
	this.clients = clients;
	this.resources = resources;
	this.maxClients = 0;
	this.matchingClients = [];

	this.nearbyResForClientByType = nearbyResForClientByType;



	// The genetic sequence
	this.genes = [];


	this.nTotalValidCon = 0;
	this.nCapacityViolations = 0;
	this.nConnectedClients = 0;
 

	this.fitness = 0;
	
	
	

	this.newType = function(clientID, resourceType) {
		var randomIndex = getRandomInt(0, this.nearbyResForClientByType[clientID][resourceType].length - 1);
		var res = this.nearbyResForClientByType[clientID][resourceType][randomIndex];
		//console.log("---------Wrong type " + res);
		return res;
	}

	for (var i = 0; i < this.clients.length; i++) {
		for (var j = 0; j < this.clients[i].services.length; j++){
			this.genes.push(this.newType(i, this.clients[i].services[j])); 
		}
		
	}

	

	this.getMatching = function(){
		return this
	}

	this.calcFitness1 = function() {

	}
	/*
		nConnectedClients, total number of valid connections, number of violations of capacity constraint, 
		(maybe) nConnections excluding satisfied services
	*/
	this.calFactors = function(){

		this.nTotalValidCon = 0;
		this.nCapacityViolations = 0;
		this.nConnectedClients = 0;

		var numClientsPerResource = [];
		
		this.matchingClients = [];

		for (var i = 0; i < this.resources.length; i++){
			numClientsPerResource.push(0);
		}

		var geneIndex = -1;
		for (var clientID = 0; clientID < this.clients.length; clientID++){
			var haveEnoughResources = true;
			var matchedResources = [];
			for (var j = 0; j < this.clients[clientID].services.length; j++){
				geneIndex += 1;
				var serviceType = this.clients[clientID].services[j]; //resource type for this service
				var matchedResourceID = this.genes[geneIndex];
				if (matchedResourceID === -1){ //One service is not matched with any resource
					haveEnoughResources = false;
				} else {
					this.nTotalValidCon++;
					numClientsPerResource[matchedResourceID] += 1;
					matchedResources.push(matchedResourceID);
				}
			}
			if (haveEnoughResources){
				this.nConnectedClients += 1;
				this.matchingClients.push(matchedResources);
			} else {
				this.matchingClients.push([]);
			}
		}

		//Calculate nCapacityViolations
		for (var i = 0; i < this.resources.length; i++){
			this.nCapacityViolations += Math.max(0, numClientsPerResource[i] - this.resources[i].maxClients);
		}
	}

	// Fitness function (returns floating point % of "correct" characters)
	// O(m). m = total number of services used by clients (length of a chromosome)
	this.calcFitness = function() {
		this.calFactors();
	 /* console.log("Factors are ");
		console.log("IsValid = " + this.isValid);
		console.log("nTotalValidCon = " + this.nTotalValidCon);
		console.log("nCapacityViolations = " + this.nCapacityViolations);
		console.log("nConnectedClients = " + this.nConnectedClients);
		console.log("    ");  */
		var res = 0;
		if (this.nCapacityViolations > 0){
			res = this.nTotalValidCon - PEN_CONST * this.nCapacityViolations;
			//console.log("Not valid " + this.isValid + " " + this.nCapacityViolations);
		} else {
			//console.log("Valid");
			var VALID_CONST = this.clients.length;
			res = VALID_CONST * this.nConnectedClients + this.nTotalValidCon;
		}
		
		this.fitness = res;
		this.maxClients = this.nConnectedClients;

		return;
	}

	// Crossover
	this.crossover = function(partner) {
		// A new child
		var child = new DNA(this.clients, this.resources, this.nearbyResForClientByType);
		
		var midpoint = Math.floor(Math.random() * (this.genes.length)); // Pick a midpoint
		
		// Half from one, half from the other
		for (var i = 0; i < this.genes.length; i++) {
			if (i > midpoint) child.genes[i] = this.genes[i];
			else              child.genes[i] = partner.genes[i];
		}
 
		return child;
	}

	// Based on a mutation probability, picks a new random character
	this.mutate = function(mutationRate) {
		var geneIndex = -1;
		for (var clientID = 0; clientID < this.clients.length; clientID++){
			for (var j = 0; j < this.clients[clientID].services.length; j++){
				geneIndex++;
				var resourceType = this.clients[clientID].services[j];
				if (Math.random() < mutationRate) {
					this.genes[geneIndex] = this.newType(clientID, resourceType);
				}  
			}
		}
	}
}
