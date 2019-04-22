const matrix = require('./matrixCreate');
const objectCre = require('./objectCreation');
const graphCre = require('./graphCreation');
const dijkstras = require('./dijkstra');
const apiCalls = require('./apiRequests');


function getAirspaceData(set) {
    return new Promise((resolve, reject) => {
        let lat1 = set.array[0][0][0];
        let lng1 = set.array[0][0][1];
        let lat2 = set.array[set.array.length-1][4][0];
        let lng2 = set.array[set.array.length-1][4][1];

        apiCalls.airspaceCall(lat1, lng1, lat2, lng2)
            .then(states => {
                if(states === null || states === undefined){
                    resolve(false, 0);
                }
                else {
                    let counter = 0;
                    for(let i = 0; i < states.length; i++){
                        if(states[i][7] <= set.ceiling ){
                            counter++
                        }
                    }
                    resolve(true, counter);

                }


            })
            .catch(err => reject(err));
    });  
}


module.exports = {

    routeFinder(req) {
        return new Promise((resolve, reject) => {
            

             const start = {lat: parseFloat(req.query.lat1),lng: parseFloat(req.query.lng1)}
             const end = {lat: parseFloat(req.query.lat2),lng: parseFloat(req.query.lng2)}
             const cieling = parseFloat(req.query.ciel);
        
            let set = matrix.createMatrix(start, end, cieling);
            objectCre.createObjectMatrix(set)
                .then(newSet => {
                    set = newSet;
                    set = graphCre.createGraph(set);
                    set = dijkstras.findPath(set);
                    let route = [];

                    for(let i = 0; i < set.shortestPath.length; i++){
                        let x = Math.floor(set.shortestPath[i] / 5);
                        let y = set.shortestPath[i] % 5;
                        route.push(set.array[x][y]);
                    }


                    getAirspaceData(set)
                        .then((aircraftToF, aircraftBelowCiel) => {

                            finalData = {
                                route: route,
                                distance: ((route.length - 2) * 1000) + set.distanceToFinal,
                                aircraft: aircraftToF,
                                aircraftBelowCieling: aircraftBelowCiel
                            }

                            console.log(finalData);

                            resolve(finalData);
                        })
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        })
    }
}