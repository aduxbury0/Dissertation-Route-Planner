

function dijkstra(set) {

    let unvisited = []
    let visited = []
    const adjMatrix = set.adjMatrix

    // Creating set of all nodes, setting all distances values to infinity, and the initial node's distance to 0
    for(let i = 0; i < adjMatrix.length; i++){
        unvisited.push({
            id: i,
            distanceValue: Infinity,
            through: -1
        });
        if(i == 2){
            unvisited[i].distanceValue = 0;
        }
    }

    let currentNode = 2;
    let destinationNode = unvisited.length - 3;
    let destinationVisited = false;
    let connected = true;

    while(!destinationVisited){

        let neighbours = [];
        let currentNodeIndex = null;

        //find the current node's actual location in the array
        for(let i = 0; i < unvisited.length; i++) {
            if(unvisited[i].id === currentNode){
                currentNodeIndex = i;

            }
        }
        //Create a set of neighbours using every index where it's value isnt 0 on the specific adjacency matrix line
        for(let i = 0; i < adjMatrix[currentNode].length; i++){
            if(adjMatrix[currentNode][i] !== 0){
                neighbours.push({
                    id: i,
                    weight: adjMatrix[currentNode][i]
                });
            }
        }

        neighbours.forEach(neighbour => {
            let neighbourIndex = null;

            for(let i = 0; i < unvisited.length; i++) {
                if(unvisited[i].id === neighbour.id) {
                    neighbourIndex = i;
                }
            }
            if(neighbourIndex === null){
                return;
            }

            let tentativeWeight = unvisited[currentNodeIndex].distanceValue + neighbour.weight;
            if(tentativeWeight < unvisited[neighbourIndex].distanceValue) {
                unvisited[neighbourIndex].distanceValue = tentativeWeight;
                unvisited[neighbourIndex].through = currentNode;
            }
        });

        //move current node to visited, remove from unvisited
        visited.push(unvisited[currentNodeIndex]);
        unvisited.splice(currentNodeIndex, 1);


        let lowest = Infinity;
        let lowestID = 0;
        for(let i = 0; i < unvisited.length; i++) {
            if(unvisited[i].distanceValue < lowest){
                lowest = unvisited[i].distanceValue;
                lowestID = unvisited[i].id;
            }
        }
        
        //We finish if we've just done the destination node or if the graph isn't connected
        if(currentNode === destinationNode){
            destinationVisited = true;
            console.log("Reached final node: " + currentNode);
            break;
        }

        //Break from loop if the graph isn't connected (as all remaining distances are infinity)
        if(lowest === Infinity){
            connected = false;
            console.log("Unconnected Graph");
            break;
        }

        currentNode = lowestID;

    }

    return visited;
}

function getRoute(visitedNodes, endNodeId) {

    let currentNode = endNodeId;
    let start = 2;
    let weight = 0;
    let route = [];
    let atStart = false;
    
    while(!atStart) {
        
        if(currentNode === start){
            route.push(2);
            atStart = true;
            break;
        }

        for(let i = 0; i < visitedNodes.length; i++) {

            if(visitedNodes[i].id === currentNode){

                route.push(visitedNodes[i].id)
                currentNode = visitedNodes[i].through;
                break;
            }

        }
    }

    return route.reverse();

}

module.exports  = {

    findPath(set){
        const visitedNodes = dijkstra(set);
        set.shortestPath = getRoute(visitedNodes, set.adjMatrix.length - 3);

        return set;

    }

}