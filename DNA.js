var PEN_CONST = 0.5;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function newType(DNANumTypes, geneIndex) {

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

  this.isValid = true;
  this.nTotalValidCon = 0;
  this.nCapacityViolations = 0;
  this.nConnectedClients = 0;
 

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

  this.calcFitness1 = function() {

  }
  /*
    isValid, nConnectedClients, total number of valid connections, number of violations of capacity constraint, 
    (maybe) nConnections excluding satisfied services
  */
  this.calFactors = function(){
    this.isValid = true;
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

        //console.log("check valid " + clients[clientID].nearbyResources.indexOf(matchedResourceID))
        if (clients[clientID].nearbyResources.indexOf(matchedResourceID) === -1 || serviceType !== this.resources[matchedResourceID].type){
          this.isValid = false;
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
      this.nCapacityViolations += Math.max(0, numClientsPerResource[i] - this.resources[i].maxClient);
    }
  }

  // Fitness function (returns floating point % of "correct" characters)
  this.calcFitness = function() {
    this.calFactors();
   /* console.log("Factors are ");
    console.log("IsValid = " + this.isValid);
    console.log("nTotalValidCon = " + this.nTotalValidCon);
    console.log("nCapacityViolations = " + this.nCapacityViolations);
    console.log("nConnectedClients = " + this.nConnectedClients);
    console.log("    ");  */
    var res = 0;
    if (!this.isValid || this.nCapacityViolations > 0){
      res = this.nTotalValidCon - PEN_CONST * this.nCapacityViolations;
      //console.log("Not valid");
    } else {
      console.log("Valid");
      var VALID_CONST = this.clients.length;
      res = VALID_CONST * 1000 + (VALID_CONST * this.nConnectedClients + this.nTotalValidCon);
    }
    
    this.fitness = res;
    this.maxClients = this.nConnectedClients;
    return;



    
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
