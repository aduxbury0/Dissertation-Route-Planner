

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

/* 

    {
        x: 3
        y: 2

    }




*/

function addEdge(start, end, weight, matrix) {

    const relativeStartLocation = ((start.x * 5) + start.y);
    const relativeEndLocation = ((end.x * 5) + end.y);
    
    matrix[relativeStartLocation][relativeEndLocation] = weight;
    
    return matrix;

}


module.exports = {

    createGraph(set) {

        let adjMatrix = createEmptyAdjMatrix(set.array.length);
        //let adjMatrix = createEmptyAdjMatrix(4);

        // const one = {
        //     x: 0,
        //     y: 4
        // }

        // const two = {
        //     x: 3,
        //     y: 2
        // }


        // adjMatrix = addEdge(one, two, 5, adjMatrix);

        return adjMatrix;

    }


}