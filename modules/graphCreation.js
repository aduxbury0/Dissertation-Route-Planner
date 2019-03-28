const fs = require('fs');

function createEmptyAdjMatrix(length) {

	const matrixSize = length*5;
	const emptyMatrix = new Array(matrixSize);
	for(let i = 0; i < emptyMatrix.length; i++) {
		emptyMatrix[i] = new Array(matrixSize);
		for(let j = 0; j < emptyMatrix[i].length; j++){
			emptyMatrix[i][j] = 0;
		}

	}
	return emptyMatrix;
}

function getRelativeLocation(start, end) {
    
    const relativeStartLocation = ((start.x * 5) + start.y);
    const relativeEndLocation = ((end.x * 5) + end.y);
    
    return {relativeStart: relativeStartLocation, relativeEnd: relativeEndLocation}
}

function addEdge(start, end, weight, adjMatrix) {

    const relatives = getRelativeLocation(start, end);
    
	adjMatrix[relatives.relativeStart][relatives.relativeEnd] = weight;

	return adjMatrix;

}


function windOncoming(bearing, windDirection, dirTravel) {

	if(dirTravel === "right"){
		return false;
	}
	else if (dirTravel === "left"){
		return false;
	}
	else if (dirTravel === "forward"){
		return false;
	}
	else {
		return false;
	}

}

function windTail(bearing, windDirection, dirTravel) {
	if(dirTravel === "right"){
		return false;
	}
	else if (dirTravel === "left"){
		return false;
	}
	else if (dirTravel === "forward"){
		return false;
	}
	else {
		return false;
	}
}

function determineLeftWeights(set, inputAdjMatrix) {

	const weightsRaw = fs.readFileSync('./weights.json');
	const weights = JSON.parse(weightsRaw);
	const objectMatrix = set.objMatrix;
	let adjMatrix = inputAdjMatrix;

	for(let x = 0; x < objectMatrix.length; x++){
		for(let y = 0; y < objectMatrix[x].length; y++) {
            
            let weight = 0;

			//If we're not the left most node in the graph
			if(y !== 0) {
				//If the node we're traveling to is too high for our drone we just set an infinately high weight
				if(objectMatrix[x][y-1].height > set.ceiling) {
					weight = weights.height;
					const start = {
						x: x,
						y: y
					};
					const end = {
						x: x,
						y: y-1
					};
					adjMatrix = addEdge(start, end, weight, adjMatrix);
					continue;
                }
                                
				//Set weather Weightings
				if(objectMatrix[x][y-1].precipitation1H !== "*") {
					weight = weights.oneHour;
				}
				else if(objectMatrix[x][y-1].precipitation3H !== "*") {
					weight = weights.threeHour;
				}
				else if(objectMatrix[x][y-1].precipitation6H !== "*") {
					weight = weights.sixHour;
				}
				else if(objectMatrix[x][y-1].precipitation12H !== "*" || objectMatrix[x][y-1].precipitation24H !== "*") {
					weight = weights.twelveHour;
                }
                
				//set windspeed weightings
				if(objectMatrix[x][y].windSpeed > 10) {
					if(windOncoming(set.bearing, objectMatrix[x][y-1].windDirection, "left")){
						weight = weight + weights.windSpeed;
					}
					else if(windTail(set.bearing, objectMatrix[x][y-1].windDirection, "left")){
                        weight = weight + weights.windTail;
					}
                }                  

				//Set displacement Weights (for moving left or right instead of straight)
				if(y === 1){
					weight = weight + weights.farOff;
				}
				else if(y === 2){
					weight = weight + weights.closeOff;
                }
                
                const start = {
                    x: x,
                    y: y
                };
                const end = {
                    x: x,
                    y: y-1
                };

				if(weight < 0) weight = 0;
				adjMatrix = addEdge(start, end, weight, adjMatrix);             
			}
		}
	}

	return adjMatrix;
}

function determineRightWeights(set, inputAdjMatrix) {
	const weightsRaw = fs.readFileSync('./weights.json');
	const weights = JSON.parse(weightsRaw);
	const objectMatrix = set.objMatrix;
	let adjMatrix = inputAdjMatrix;

	for(let x = 0; x < objectMatrix.length; x++){
		for(let y = 0; y < objectMatrix[x].length; y++) {
            
            let weight = 0;
            
			//If we're not the right most node in the graph
			if(y !== 4) {
				//If the node we're traveling to is too high for our drone we just set an infinately high weight
				if(objectMatrix[x][y+1].height > set.ceiling) {
					weight = weights.height;
					const start = {
						x: x,
						y: y
					};
					const end = {
						x: x,
						y: y+1
					};
					adjMatrix = addEdge(start, end, weight, adjMatrix);
					continue;
				}
				//Set weather Weightings
				if(objectMatrix[x][y+1].precipitation1H !== "*") {
					weight = weights.oneHour;
				}
				else if(objectMatrix[x][y+1].precipitation3H !== "*") {
					weight = weights.threeHour;
				}
				else if(objectMatrix[x][y+1].precipitation6H !== "*") {
					weight = weights.sixHour;
				}
				else if(objectMatrix[x][y+1].precipitation12H !== "*" || objectMatrix[x][y+1].precipitation24H !== "*") {
					weight = weights.twelveHour;
				}

				//set windspeed weightings
				if(objectMatrix[x][y].windSpeed > 10) {
					if(windOncoming(set.bearing, objectMatrix[x][y].windDirection, "right")){
						weight = weight + weights.windSpeed;
					}
					else if(windTail(set.bearing, objectMatrix[x][y].windDirection, "right")){
						weight = weight + weights.windTail;
					}

				}

				//Set displacement Weights (for moving left or right instead of straight)
				if(y === 3){
					weight = weight + weights.farOff;
				}
				else if(y === 2){
					weight = weight + weights.closeOff;
				}

				const start = {
					x: x,
					y: y
				};
				const end = {
					x: x,
					y: y+1
                };
                
				if(weight < 0) weight = 0;
				adjMatrix = addEdge(start, end, weight, adjMatrix);

			}
		}
	}

	return adjMatrix;
}

function determineForwardWeights(set, inputAdjMatrix) {

	const weightsRaw = fs.readFileSync('./weights.json');
	const weights = JSON.parse(weightsRaw);
	const objectMatrix = set.objMatrix;
	let adjMatrix = inputAdjMatrix;

	for(let x = 0; x < objectMatrix.length; x++){
		for(let y = 0; y < objectMatrix[x].length; y++) {
            
            let weight = 0;
            
            if(x !== objectMatrix.length - 1) {
                //If the node we're traveling to is too high for our drone we just set an infinately high weight
                if(objectMatrix[x+1][y].height > set.ceiling) {
                    weight = weights.height;
                    const start = {
                        x: x,
                        y: y
                    };
                    const end = {
                        x: x+1,
                        y: y
                    };
                    adjMatrix = addEdge(start, end, weight, adjMatrix);
                    continue;
                }
                //Set weather Weightings
                if(objectMatrix[x+1][y].precipitation1H !== "*") {
                    weight = weights.oneHour;
                }
                else if(objectMatrix[x+1][y].precipitation3H !== "*") {
                    weight = weights.threeHour;
                }
                else if(objectMatrix[x+1][y].precipitation6H !== "*") {
                    weight = weights.sixHour;
                }
                else if(objectMatrix[x+1][y].precipitation12H !== "*" || objectMatrix[x+1][y].precipitation24H !== "*") {
                    weight = weights.twelveHour;
                }

                //set windspeed weightings
                if(objectMatrix[x+1][y].windSpeed > 10) {
                    if(windOncoming(set.bearing, objectMatrix[x][y].windDirection, "Forward")){
                        weight = weight + weights.windSpeed;
                    }
                    else if(windTail(set.bearing, objectMatrix[x][y].windDirection, "Forward")){
                        weight = weight + weights.windTail;
                    }

                }

                const start = {
                    x: x,
                    y: y
                };
                const end = {
                    x: x+1,
                    y: y
                };
                
                if(weight < 0) weight = 0;

                adjMatrix = addEdge(start, end, weight+1, adjMatrix);
            }
		}
	}

	return adjMatrix;


}

function ensureConnected(set, inputAdjMatrix) {
    
	const objectMatrix = set.objMatrix;
    let adjMatrix = inputAdjMatrix;
    
    for(let x = 0; x < objectMatrix.length; x++){
		for(let y = 0; y < objectMatrix[x].length; y++) {

            if(y !== 0) {

                const start = {
					x: x,
					y: y
				};
				const end = {
					x: x,
					y: y-1
                };

                let relatives = getRelativeLocation(start, end);

                if(adjMatrix[relatives.relativeStart][relatives.relativeEnd] <= 0){
                    adjMatrix[relatives.relativeStart][relatives.relativeEnd] = 1;
                }

            }
            if(y !== 4) {
                const start = {
					x: x,
					y: y
				};
				const end = {
					x: x,
					y: y+1
                };

                let relatives = getRelativeLocation(start, end);

                if(adjMatrix[relatives.relativeStart][relatives.relativeEnd] <= 0){
                    adjMatrix[relatives.relativeStart][relatives.relativeEnd] = 1;
                }
            }
            if(x !== (objectMatrix.length-1)){
                const start = {
					x: x,
					y: y
				};
				const end = {
					x: x+1,
					y: y
                };

                let relatives = getRelativeLocation(start, end);

                if(adjMatrix[relatives.relativeStart][relatives.relativeEnd] <= 0){
                    adjMatrix[relatives.relativeStart][relatives.relativeEnd] = 1;
                }
            }

            
        }
    }

    return adjMatrix;

}

function determineWeights(set) {
    
	let adjMatrix = createEmptyAdjMatrix(set.objMatrix.length);

	adjMatrix = determineLeftWeights(set, adjMatrix);

	adjMatrix = determineRightWeights(set, adjMatrix);

	adjMatrix = determineForwardWeights(set, adjMatrix);
    
    adjMatrix = ensureConnected(set, adjMatrix);

	set.adjMatrix = adjMatrix;

	return set;

}

module.exports = {

	createGraph(set) {

		set = determineWeights(set);

		return set;

	}

}