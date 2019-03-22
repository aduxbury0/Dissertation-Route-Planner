const fs = require('fs');

function createEmptyAdjMatrix(length) {

    const matrixSize = length*5;
    let emptyMatrix = new Array(matrixSize);
    for(let i = 0; i < emptyMatrix.length; i++) {
        emptyMatrix[i] = new Array(matrixSize);
        for(let j = 0; j < emptyMatrix[i].length; j++){
            emptyMatrix[i][j] = 0;
        }

    }
    return emptyMatrix;
}

function addEdge(start, end, weight, matrix) {

    const relativeStartLocation = ((start.x * 5) + start.y);
    const relativeEndLocation = ((end.x * 5) + end.y);
    
    matrix[relativeStartLocation][relativeEndLocation] = weight;

    return matrix;

}


function windOncoming(bearing, windDirection, lOrR) {

    if(lOrR === "right"){

        // bearing = (bearing + 90) % 360;
        // let windUpper = (windDirection + 35) % 360;
        // let windLower = (windDirection - 35) % 360;


        return false;
        
    }
    else if (lOrR === "left"){
        // bearing = (bearing + 270) % 360;
        return false;
    }
    else {
        return false;
    }

}

function windTail(bearing, windDirection, lOrR) {
    return false;
}

function determineLeftWeights(set, inputAdjMatrix, ceiling) {

    const weightsRaw = fs.readFileSync('../weights.json');
    const weights = JSON.parse(weightsRaw);
    
    let objectMatrix = set.array;
    let adjMatrix = inputAdjMatrix;

    for(let x = 0; i < objectMatrix.size; i++){
        console.log("Graph Generation LEFT: " + x + "/" + objectMatrix.size);
        for(let y = 0; y < objectMatrix[x].size; y++) {
            
            let weight = 0;
            //If we're not the left most node in the graph
            if(y !== 0) {
                //If the node we're traveling to is too high for our drone we just set an infinately high weight
                if(objectMatrix[x][y-1].height > ceiling) {
                    weight = 2147483647;
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
                else if(objectMatrix[x][y-1].precipitation12H !== "*" || objectMatrix[x][y].precipitation24H !== "*") {
                    weight = weights.twelveHour;
                }

                //set windspeed weightings
                if(objectMatrix[x][y].windSpeed > 5) {
                    if(windOncoming(set.bearing, objectMatrix[x][y].windDirection, "left")){
                        weight = weight + weights.windSpeed;
                    }
                    else if(windTail(set.bearing, objectMatrix[x][y].windDirection, "left")){
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

                adjMatrix = addEdge(start, end, weight, adjMatrix);

            }
        }
    }

    return adjMatrix;
}

function determineRightWeights(set, inputAdjMatrix, ceiling) {
    const weightsRaw = fs.readFileSync('../weights.json');
    const weights = JSON.parse(weightsRaw);
    
    let objectMatrix = set.array;
    let adjMatrix = inputAdjMatrix;

    for(let x = 0; i < objectMatrix.size; i++){
        console.log("Graph Generation RIGHT: " + x + "/" + objectMatrix.size);
        for(let y = 0; y < objectMatrix[x].size; y++) {
            
            let weight = 0;
            //If we're not the left most node in the graph
            if(y !== 4) {
                //If the node we're traveling to is too high for our drone we just set an infinately high weight
                if(objectMatrix[x][y+1].height > ceiling) {
                    weight = 2147483647;
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
                else if(objectMatrix[x][y+1].precipitation12H !== "*" || objectMatrix[x][y].precipitation24H !== "*") {
                    weight = weights.twelveHour;
                }

                //set windspeed weightings
                if(objectMatrix[x][y].windSpeed > 5) {
                    if(windOncoming(set.bearing, objectMatrix[x][y].windDirection, "right")){
                        weight = weight + weights.windSpeed;
                    }
                    else if(windTail(set.bearing, objectMatrix[x][y].windDirection, "right")){
                        weight = weight + weights.windTail;
                    }

                }

                //Set displacement Weights (for moving left or right instead of straight)
                if(y === 1){
                    weight = weight + weights.farOff;
                }
                else if(y === 3){
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

                adjMatrix = addEdge(start, end, weight, adjMatrix);

            }
        }
    }

    return adjMatrix;
}

function determineForwardWeights() {}

function determineWeights() {

}

module.exports = {

    createGraph(set) {

        let adjMatrix = createEmptyAdjMatrix(set.array.length);

        //adjMatrix = determineLeftWeights(set, adjMatrix, set.ceiling);

        //adjMatrix = determineRightWeights(set, adjMatrix, set.ceiling);
        
        console.log(adjMatrix);
        
        set.adjMatrix = adjMatrix;

        return set;

    }


}