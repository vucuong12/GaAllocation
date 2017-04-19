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

  this.best = "";

  this.population = [];
  for (var i = 0; i < num; i++) {
    this.population.push(new DNA(clients, resources));
  }
  this.matingPool = [];


  // Fill our fitness array with a value for every member of the population
  this.calcFitness = function() {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness();
    }
  }
  this.calcFitness();

  // Generate a mating pool
  this.naturalSelection = function() {
    // Clear the ArrayList
    this.matingPool = [];

    var maxFitness = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    // Based on fitness, each member will get added to the mating pool a certain number of times
    // a higher fitness = more entries to mating pool = more likely to be picked as a parent
    // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (var i = 0; i < this.population.length; i++) {
      
      var fitness = maxFitness === 0 ? 1 : (this.population[i].fitness) / maxFitness;// map(this.population[i].fitness,0,maxFitness,0,1);
      var n = Math.floor(fitness * 100);  // Arbitrary multiplier, we can also use monte carlo method
      for (var j = 0; j < n; j++) {              // and pick two random numbers
        this.matingPool.push(this.population[i]);
      }
    }

  }

  // Create a new generation
  this.generate = function() {
    //console.log("generate " + this.generations)
    
    // Refill the population with children from the mating pool
    for (var i = 0; i < this.population.length; i++) {
      var a = Math.floor(random(0, this.matingPool.length - 1));
      var b = Math.floor(random(0, this.matingPool.length - 1));
      var partnerA = this.matingPool[a];
      var partnerB = this.matingPool[b];
      var child = partnerA.crossover(partnerB);
      child.mutate(this.mutationRate);
      this.population[i] = child;
    }
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

    if (this.generations === 500 || worldrecord === this.perfectScore) {
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

