/*$( document ).ready(function() {

})*/

function printAttributes(obj, attributes){
	console.log("{")
	for (var i = 0; i < attributes.length; i++){
		console.log(attributes[i] + ": " + obj[attributes[i]]);
	}
	console.log("}")
}