$( document ).ready(function() {
	var RESOURCE_RADIUS = 5;
	var CLIENT_RADIUS = 7.5;
	var CANVAS_WIDTH = 800;
	var CANVAS_HEIGHT = 600;
	/*------------------*/
	var NUM_RESOURCES = 10;
	var NUM_CLIENTS = 4;
	var SERVICE_TYPES = 3;
	var MAX_CLIENTS_PER_RESOURCE = 30;
	var MAX_RANGE_PER_CLIENT = 400;
	/*------------------*/
	var geneticAlgorithm = new GA([],[]);

	var resources = [];
	var clients = [];
	var matchingResult = [];
	var canvas = document.getElementById("myCanvas");
	var canvasLeft = canvas.offsetLeft,
    	canvasTop = canvas.offsetTop;

	function initCanvas()
	{
	    
	    canvas.width = CANVAS_WIDTH; //document.body.clientWidth; //document.width is obsolete
	    canvas.height = CANVAS_HEIGHT; //document.body.clientHeight; //document.height is obsolete
	    
	}


	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	initCanvas()

	function distance(x, y, x1, y1){
		return Math.sqrt((x-x1) * (x - x1) + (y - y1) * (y - y1));
	}

	function isSeparated(x, y, r, x1, y1, r1){
		return (r + r1 + 6 < distance(x, y, x1, y1))
	}

	function insideCirle(x, y, x1, y1, r1){
		return distance(x, y, x1, y1) <= r1;
	}

	function isGoodlocation(x, y, r){
		for (var i = 0; i < resources.length; i++){
			if (!isSeparated(x, y, r, resources[i].location[0], resources[i].location[1], RESOURCE_RADIUS)) {
				return false;
			}
		}

		for (var i = 0; i < clients.length; i++){
			if (!isSeparated(x, y, r, clients[i].location[0], clients[i].location[1], CLIENT_RADIUS)) {
				return false;
			}
		}
		return true;
	}

	function drawResource(x, y){
		ctx.beginPath();
		ctx.arc(x, y, RESOURCE_RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = "blue";
		ctx.fill();
		
	}

	function drawClient(x, y){
		ctx.beginPath();
		ctx.arc(x, y, CLIENT_RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
		
	}

	function drawText(text, x, y){
		ctx.font = "15px Arial";
		ctx.fillText(text,x,y);
	}

	function random(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function initResources(){
		
		for (var i = 0; i < NUM_RESOURCES; i++){
			var x, y;
			while (1){
				x = random(RESOURCE_RADIUS + 1, CANVAS_WIDTH - RESOURCE_RADIUS - 1);
				y = random(RESOURCE_RADIUS + 1, CANVAS_HEIGHT - RESOURCE_RADIUS - 1);
				if (isGoodlocation(x, y, RESOURCE_RADIUS)) {
					break;
				}
			}
			var newResource = {
				location:[x,y],
				maxClients: random(1, MAX_CLIENTS_PER_RESOURCE),
				serviceType: random(0, SERVICE_TYPES - 1)
			}
			resources.push(newResource);
		}
	}

	function initClients(){

		for (var i = 0; i < NUM_CLIENTS; i++){
			var x, y;
			while (1){
				x = random(CLIENT_RADIUS + 1, CANVAS_WIDTH - CLIENT_RADIUS - 1);
				y = random(CLIENT_RADIUS + 1, CANVAS_HEIGHT - CLIENT_RADIUS - 1);
				if (isGoodlocation(x, y, CLIENT_RADIUS)) {
					break;
				}
			}
			var randomServices = [];
			//Create random services for this client
			var curServiceType = random(0, SERVICE_TYPES - 1); 
			randomServices.push(curServiceType);
			while (1){
				if (curServiceType + 1 >= SERVICE_TYPES) break;
				curServiceType = random(curServiceType + 1, SERVICE_TYPES);
				if (curServiceType < SERVICE_TYPES) {
					randomServices.push(curServiceType);
				}

			}
			var newClient = {
				location: [x, y],
				services: randomServices,
				radius: MAX_RANGE_PER_CLIENT
			}
			clients.push(newClient);
		}
	}

	function findNodeAtXY(x, y){
		for (var i = 0; i < clients.length; i++){
			if (insideCirle(x, y, clients[i].location[0], clients[i].location[1], CLIENT_RADIUS)){
				return {
					type: "client",
					node: clients[i]
				}
			}
		}

		for (var i = 0; i < resources.length; i++){
			if (insideCirle(x, y, resources[i].location[0], resources[i].location[1], RESOURCE_RADIUS)){
				return {
					type: "resource",
					node: resources[i]
				}
			}
		}
		return {
			type: "none"
		}
	}

	function drawClients(){
		for (var i = 0; i < clients.length; i++){
			drawClient(clients[i].location[0], clients[i].location[1]);
		}
	}

	function drawResources(){
		for (var i = 0; i < resources.length; i++){
			drawResource(resources[i].location[0], resources[i].location[1]);
		}
	}

	function drawLine(x, y, x1, y1){
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x1,y1);
		ctx.stroke();
	}

	function drawMatching(){
		for (var clientID = 0; clientID < matchingResult.length; clientID++){
			var clientX = clients[clientID].location[0];
			var clientY = clients[clientID].location[1];

			for (var j = 0; j < matchingResult[clientID].length; j++){
				var resourceID = matchingResult[clientID][j];
				var resourceX = resources[resourceID].location[0];
				var resourceY = resources[resourceID].location[1];
				drawLine(clientX, clientY, resourceX, resourceY)

			}
		}
	}

	function clearCanvas() {
	    var canvas = document.getElementById("myCanvas");
	    var ctx = canvas.getContext("2d");
	    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function redrawCanvas(){
		clearCanvas();
		drawClients();
		drawResources();
		drawMatching();
	}

	function createDataset1(){
	  var clients = [], resources = [];
	  clients.push({services: [1], nearbyResources: [0,3]})
	  clients.push({services: [1], nearbyResources: [0,1]})
	  clients.push({services: [0], nearbyResources: [1]})
	  clients.push({services: [0,1], nearbyResources: [0,1,2,3]})

	  //Resources
	  resources.push({"type": 1, "maxClient": 2});
	  resources.push({"type": 0, "maxClient": 1});
	  resources.push({"type": 1, "maxClient": 2});
	  resources.push({"type": 0, "maxClient": 2});
	  return [clients, resources];
	}

	function createDatasetFromMap(){
	  var GAclients = [], GAresources = [];
	  for (var i = 0; i < clients.length; i++){
	  	var nearbyRes = [];
	  	for (var j = 0; j < resources.length; j++){
	  		if (insideCirle(resources[j].location[0], resources[j].location[1], clients[i].location[0], clients[i].location[1], clients[i].radius)){
	  			nearbyRes.push(j);
	  		}
	  	}
	  	var newClient = {
	  		services: clients[i].services,
	  		nearbyResources: nearbyRes 
	  	}
	  	GAclients.push(newClient);
	  }

	  for (var i = 0; i < resources.length; i++){
	  	var newResource = {
	  		type: resources[i].serviceType,
	  		maxClient: resources[i].maxClients
	  	}
	  	GAresources.push(newResource);
	  }
	 
	  return [GAclients, GAresources];
	}



	function matchClientsAndResources(){
		//Fake matchingResult
		/*matchingResult = [];
		for (var i = 0; i < clients.length; i++){
			matchingResult.push([random(0, resources.length - 1), random(0, resources.length - 1)])
		}
		return;*/

		//Create dataset for GA to run
		var GAclients = [], GAresources = [];
		var res = createDatasetFromMap();
		GAclients = res[0];
		GAresources = res[1];
		geneticAlgorithm.updateDataset(GAclients, GAresources);
		var result = geneticAlgorithm.runGA();
		matchingResult = result.matchingClients; //[[R1,R2],[R2,],[R1]]

	}

	

	


	/*
		Event handlers
	*/

	function displayInfo(type, node, x, y){

		if (type === "client") {
			// $('#popup_div').text("OK" ).css({left:x,top:y}).show();
			$('#popup_div').text("Services: " + node.services).css({left:x,top:y}).css({color:"red"}).show();
			var circleX = canvasLeft + node.location[0] - node.radius;
			var circleY = canvasTop + node.location[1] - node.radius;
			$('#circle').css({width:  node.radius * 2, height:  node.radius * 2, left:circleX,top:circleY, "border-radius": node.radius }).css({color:"red"}).show();
		} else if (type === "resource") {
			// $('#popup_div').text("OK" ).css({left:x,top:y}).show();
			$('#popup_div').text("Type: " + node.serviceType + ". Capacity: " + node.maxClients).css({left:x,top:y}).css({color:"blue"}).show();
			$('#circle').hide();
		} else {
			$('#popup_div').hide();
			$('#circle').hide();
		}
	}

	window.onmousemove = function (event) {
	    
	    var x = event.pageX - canvasLeft,
	        y = event.pageY - canvasTop;
	    console.log("Hovering");
	    var node = findNodeAtXY(x, y);
	    displayInfo(node.type, node.node, event.pageX, event.pageY)
	};
	canvas.addEventListener('click', function(event) {
		var nodeType = $("input[name='options']:checked").val();
		var radius = nodeType === "client" ? CLIENT_RADIUS : RESOURCE_RADIUS;
		
	    var x = event.pageX - canvasLeft,
	        y = event.pageY - canvasTop;
	    console.log("Choose (x, y) = " + "(" + x + "," + y + ")");
	    if (!isGoodlocation(x, y, radius)) {
	    	return alert("Cannot add a node in this location, which is too close to an existing node. Try again !");
	    } else {
	    	// alert("Good");
	    	if (nodeType === "client"){
	    		prepareClientModal();
	    		$('.selectpicker').selectpicker("refresh");
	    		$("#clientModal").modal("show");
	    		$("#addClientBtn").click(function(){
					var selectedServices = getSelectedServices();
					$("#clientModal").modal("hide");
					var newClient = {
						location: [x, y],
						services: selectedServices,
						radius: MAX_RANGE_PER_CLIENT
					}
					clients.push(newClient);
					matchClientsAndResources();
					redrawCanvas();
				})
	    	} else if (nodeType === "resource"){
	    		// Add maxClients, type

	    	} else {
	    		alert("Error: Wrong node type !")
	    	}
	    	return;
	    }
	    
	}, false);

	function prepareClientModal(){
		$('#servicesType').empty();
		for (var type = 0; type < SERVICE_TYPES; type++){

			$('#servicesType').append($('<option>', { 
		        value: type,
		        text : type
		    }));
		}
		
	}

	function getSelectedServices(){
		var selectedValues = $('#servicesType').val();
		var res = [];
		for (var i = 0; i < selectedValues.length; i++){
			res.push(Number(selectedValues[i]));
		}
		console.log(JSON.stringify(res));
		return res;
	}




	/*
		RUN THE FOLLOWING CODE FIRST
	*/
	initClients();
	initResources();
	redrawCanvas();
	matchClientsAndResources();
	redrawCanvas();



})