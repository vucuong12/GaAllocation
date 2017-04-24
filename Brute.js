


function Brute(clients, resources){
	this.clients = clients;
	this.resources = resources;
	this.nearbyResForClientByType = nearbyResForClientByType;
	this.curCapacity = []

	this.createNearbyResForClientByType = function(GAclients, GAresources) {
		for (var clientID = 0; clientID < GAclients.length; clientID++){
				var oneClient = {};
				for (var i = 0; i < GAclients[clientID].nearbyResources.length; i++){
					var resourceType = GAresources[GAclients[clientID].nearbyResources[i]].type;
					if (oneClient[resourceType.toString()]){
							oneClient[resourceType.toString()].push(GAclients[clientID].nearbyResources[i])
					} else {
							oneClient[resourceType.toString()] = [GAclients[clientID].nearbyResources[i]];
					}
				}

				
				this.nearbyResForClientByType.push(oneClient);
		}
	}

	this.init = function (){
		this.createNearbyResForClientByType(this.clients, this.resources);
		for (var i = 0; i < this.resources.length; i++){
			this.curCapacity.push(this.resources[i].maxClients)
		}
	}
	

	this.updateDataset = function (clients, resources){
		this.clients = clients;
		this.resources = resources;
		init();
	}
	/*
		Return the best result: {maxClients, matchingClients: [[R1,R2],[R2,],[R1]]}
	*/
	this.runBrute = function(){
		//run()
		
	}

	this.displayInfo = function() {




	}
}