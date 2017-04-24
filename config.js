var RESOURCE_RADIUS = 5;
var CLIENT_RADIUS = 7.5;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;
/*------------------*/
var NUM_RESOURCES = 105;
var NUM_CLIENTS = 100;
var SERVICE_TYPES = 7;
var MAX_CLIENTS_PER_RESOURCE = 10;
var MAX_RANGE_PER_CLIENT = 150;


var MAX_GENERATIONS = 100;
var ELITISM_NUM = Math.floor(MAX_GENERATIONS / 20);

var PEN_CONST = 0.5; //Penalty cost for violation of degree constraint


var POP_MAX = 200;  //Population
var MUTATION_RATE = 0.01   


var VIEW_RATE = 1