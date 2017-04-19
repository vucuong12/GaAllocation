function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function newType(DNANumTypes) {
  return getRandomInt(0, DNANumTypes);
}

// Constructor (makes a random DNA)
function DNA(clients, resources) {
  this.clients = clients;
  this.resources = resources;
  this.maxClients = 0;
  this.matchingClients = [];
  // The genetic sequence
  this.genes = [];



  this.fitness = 0;
  for (var i = 0; i < this.clients.length; i++) {
    for (var j = 0; j < this.clients[i].services.length; j++){
      this.genes.push(newType(this.resources.length)); 
    }
    
  }

  this.getMatching = function(){
    return {
      "maxClients": this.maxClients,
      "matchingClients": this.matchingClients
    }
  }

  // Fitness function (returns floating point % of "correct" characters)
  this.calcFitness = function() {
    
    var score = 0.0;
    var geneIndex = 0;
    var numClientsPerResource = [];
    for (var i = 0; i < this.resources.length; i++){
      numClientsPerResource.push(0);
    }
    for (var i = 0; i < this.clients.length; i++) {
      var allSatisfied = true;
      var matchedResources = [];
      for (var j = 0; j < this.clients[i].services.length; j++){
        var serviceType = this.clients[i].services[j]; //resource type for this service
        var resourceID = this.genes[geneIndex];
        geneIndex++;  
        if (resourceID === this.resources.length) {
          allSatisfied = false; // One service is not bound to any resource
          continue;
        }
        
        var resourceType = this.resources[resourceID].type;
        var resourceMaxClient = this.resources[resourceID].maxClient;
        if (serviceType === resourceType && this.clients[i].nearbyResources.indexOf(resourceID) > -1
        && numClientsPerResource[resourceID] < resourceMaxClient){
          numClientsPerResource[resourceID]++;
          matchedResources.push(resourceID);
        } else {
          return 0.0;
        }
        
      }
      if (allSatisfied) {
        score += 1;
        this.matchingClients.push(matchedResources);
      } else {
        this.matchingClients.push([]);
      }
    }
    this.fitness = score / this.clients.length;
    this.maxClients = score;
  }

  // Crossover
  this.crossover = function(partner) {
    // A new child
    var child = new DNA(this.clients, this.resources);
    
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
    for (var i = 0; i < this.genes.length; i++) {
      if (Math.random() < mutationRate) {
        this.genes[i] = newType(this.resources.length);
      }
    }
  }
}
