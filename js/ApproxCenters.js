let sketchContainer = null;

async function setup(){
  await UIManagement.getUIreferences();
  ElementsManagement.cities = [];
  sketchContainer = createDiv();
  
  sketchContainer.id('canvasContainer');
  sketchContainer.addClass('sketchContent');
  canvas = createCanvas(sketchContainer.elt.clientWidth, sketchContainer.elt.clientHeight);
  textSize(15);

  canvas.parent(sketchContainer);
}

function windowResized(){
  background(255);
  resizeCanvas(sketchContainer.elt.clientWidth, sketchContainer.elt.clientHeight);
}

function draw(){
  background(255);

  let tmpAlgCenters = findNearestCenters(ElementsManagement.algorithmCenters);
  let tmpArbCenters = findNearestCenters(ElementsManagement.arbitraryCenters);

  for (let city in ElementsManagement.cities){
    ElementsManagement.cities[city].display();

    let x1 = ElementsManagement.cities[city].x;
    let y1 = ElementsManagement.cities[city].y

    if(tmpAlgCenters[city]){
      let x2 = tmpAlgCenters[city].center[0];
      let y2 = tmpAlgCenters[city].center[1];
      let d = int(tmpAlgCenters[city].dist);
      if(d != 0){
        if(tmpAlgCenters[city]['minradius'])
          strokeWeight(6);
        stroke('red');

        line(x1, y1, x2, y2);
        push();
        let m = (y2 - y1) / (x2 - x1);
        let textx = (x2 + x1) / 2;
        let texty = m*textx - m*x1 + y1;

        strokeWeight(0.5);
        stroke('black');
        text(nfc(d, 1), textx, texty);
        pop();  
      } 
    }
    if(tmpArbCenters[city]){
      let x2 = tmpArbCenters[city].center[0];
      let y2 = tmpArbCenters[city].center[1];
      let d = int(tmpArbCenters[city].dist);

      if(d != 0){
        strokeWeight(1);
        stroke('green');
        if(tmpArbCenters[city]['minradius']){
          strokeWeight(6);
        }

        line(x1, y1, x2, y2);
        push();
        let m = (y2 - y1) / (x2 - x1);
        let textx = (x2 + x1) / 2;
        let texty = m*textx - m*x1 + y1;
      
        strokeWeight(0.5);
        stroke('black');
        text(nfc(d, 1), textx, texty);
        pop();
      }        
    }
    strokeWeight(1);
    noStroke();
  }

  for (let centers in ElementsManagement.arbitraryCenters){
    ElementsManagement.arbitraryCenters[centers].display();
  }

  for (let centers in ElementsManagement.algorithmCenters){
    ElementsManagement.algorithmCenters[centers].display();
  }
}

function mousePressed(){
  if(UIManagement.showingAlert)
    return;

  let x = Math.round(mouseX);
  let y = Math.round(mouseY);
  if((width*0.001 < x && x < (width - width*0.001)) && (height*0.001 < y && y < (height - height*0.001))){
    if(UIManagement.cityMode){
      let tmpSet = new Set();
      let indexOfSelected = -1;
      for (let city in ElementsManagement.cities){
        tmpSelected = ElementsManagement.cities[city].cityPressed();
        tmpSet.add(tmpSelected);
        if(tmpSelected)
          indexOfSelected = city;
      }
      if(mouseButton == LEFT){
        if(!tmpSet.has(true)){
          newCity = ElementsManagement.addCity(x,y);
          newCity.display();
        }
      }else if(mouseButton == RIGHT && indexOfSelected != -1){
        ElementsManagement.removeCity(indexOfSelected);
      }
    }else if(UIManagement.arbCenterMode){
      let tmpSet = new Set();
      let indexOfSelected = -1;
      for (let center in ElementsManagement.arbitraryCenters){
        tmpSelected = ElementsManagement.arbitraryCenters[center].centerPressed();
        tmpSet.add(tmpSelected);
        if(tmpSelected)
          indexOfSelected = center;
      }
      if(mouseButton == LEFT){
        if(!tmpSet.has(true)){
          newCenter = ElementsManagement.addArbitraryCenter(x,y);
          newCenter.display();
        }
      }else if(mouseButton == RIGHT && indexOfSelected != -1){
          ElementsManagement.removeArbitraryCenter(indexOfSelected);
      }
    }else if(UIManagement.algCenterMode){
      let tmpSet = new Set();
      let indexOfSelected = -1;
      for (let center in ElementsManagement.algorithmCenters){
        tmpSelected = ElementsManagement.algorithmCenters[center].centerPressed();
        tmpSet.add(tmpSelected);
        if(tmpSelected)
          indexOfSelected = center;
      }
      if(mouseButton == LEFT){
        if(!tmpSet.has(true)){
          newCenter = ElementsManagement.addAlgorithmCenter(x,y);
          newCenter.display();
        }
      }else if(mouseButton == RIGHT && indexOfSelected != -1){
        ElementsManagement.removeAlgorithmCenter(indexOfSelected);
      }
    }
  }
}

function mouseDragged() {
  if(UIManagement.cityMode){
    for (let city in ElementsManagement.cities){
      ElementsManagement.cities[city].mouseDragged();
    }
  }else if(UIManagement.arbCenterMode){
    for (let center in ElementsManagement.arbitraryCenters){
      ElementsManagement.arbitraryCenters[center].mouseDragged();
    }
  }else if(UIManagement.algCenterMode){
    for (let center in ElementsManagement.algorithmCenters){
      ElementsManagement.algorithmCenters[center].mouseDragged();
    }
  }
}

function approxWithoutRAlgorithm() {
  ElementsManagement.algorithmCenters.length = 0;
  let centersNumber = ElementsManagement.centersNumber;
  let tmpCities = ElementsManagement.cities.slice(0);

  let firstCityIndex = Math.floor(Math.random()*tmpCities.length);
  let firstCity = tmpCities[firstCityIndex];
  let newCenter = ElementsManagement.addAlgorithmCenter(firstCity.x,firstCity.y);
  newCenter.display();

  tmpCities.splice(firstCityIndex,1);

  while((ElementsManagement.algorithmCenters.length != centersNumber) && (ElementsManagement.algorithmCenters.length != ElementsManagement.cities.length)){
    let distFromCenters = []
    tmpCities.forEach((city, cityIndex) =>{
      distFromCenters[cityIndex] = Number.MAX_SAFE_INTEGER;
      ElementsManagement.algorithmCenters.forEach((center, centerIndex) =>{
        tmpDist = dist(city.x, city.y , center.x, center.y)
        if(tmpDist < distFromCenters[cityIndex]){
          distFromCenters[cityIndex] = tmpDist;
        }
      })
    })
    let maxCity = distFromCenters.indexOf(Math.max(...distFromCenters));
    let tmpNewCenter = tmpCities[maxCity];
    newCenter = ElementsManagement.addAlgorithmCenter(tmpNewCenter.x,tmpNewCenter.y);
    newCenter.display();

    tmpCities.splice(maxCity,1);
  }
}
 
function findNearestCenters(arrayCenters) {
  let nearestCenter = [];
  let distFromCenters = [];
  let check = false;
  ElementsManagement.cities.forEach((city, cityIndex) =>{
    nearestCenter[cityIndex] = null;
    distFromCenters[cityIndex] = Number.MAX_SAFE_INTEGER;
    arrayCenters.forEach((center, centerIndex) =>{
      check = true;
      tmpDist = dist(city.x, city.y , center.x, center.y)
      if(tmpDist < distFromCenters[cityIndex]){
        distFromCenters[cityIndex] = tmpDist; 
        nearestCenter[cityIndex] = {center:[center.x ,center.y],dist:tmpDist};
      }
    })
  })
  let maxCity = distFromCenters.indexOf(Math.max(...distFromCenters));
  if(maxCity != -1 && check)
    nearestCenter[maxCity]['minradius'] = true;

  return nearestCenter;
}


function makeGraph(allCities) {
	let aGraphData = [];

	for(let i=0; i<allCities.length; i++){
		let cityA = allCities[i];
		for(let j=i+1; j<allCities.length;j++){
			let cityB = allCities[j];
			let tempDist = dist(cityA.x, cityA.y, cityB.x, cityB.y);
			aGraphData.push([i,j,tempDist]);
		}
	}

	return aGraphData;
}

function createAdjMatrix(V, G) {
	let adjMatrix = [];
	for (let i = 0; i < V; i++) {
		adjMatrix.push([]);
		for (let j = 0; j < V; j++) { adjMatrix[i].push(0); }
	}
	for (let i = 0; i < G.length; i++) {
		adjMatrix[G[i][0]][G[i][1]] = G[i][2];
		adjMatrix[G[i][1]][G[i][0]] = G[i][2];
	}
	return adjMatrix;
}

function findMST(allCities) {
	let G = makeGraph(allCities);
	let centersNumber = ElementsManagement.cities.length;

	let adjMatrix = createAdjMatrix(centersNumber, G);

	// arbitrarily choose initial vertex from graph
	let vertex = 0;

	// initialize empty edges array and empty MST
	let MST = [];
	let edges = [];
	let visited = [];
	let minEdge = [null,null,Infinity];

	// run prims algorithm until we create an MST
	// that contains every vertex from the graph
	while (MST.length !== centersNumber-1) {

		// mark this vertex as visited
		visited.push(vertex);

		// add each edge to list of potential edges
		for (let r = 0; r < centersNumber; r++) {
			if (adjMatrix[vertex][r] !== 0) {
				edges.push([vertex,r,adjMatrix[vertex][r]]);
			}
		}

		// find edge with the smallest weight to a vertex
		// that has not yet been visited
		for (let e = 0; e < edges.length; e++) {
			if (edges[e][2] < minEdge[2] && visited.indexOf(edges[e][1]) === -1) {
				minEdge = edges[e];
			}
		}

		// remove min weight edge from list of edges
		edges.splice(edges.indexOf(minEdge), 1);

		// push min edge to MST
		MST.push(minEdge);

		// start at new vertex and reset min edge
		vertex = minEdge[1];
		minEdge = [null,null,Infinity];

	}

	return MST;

}

function findDisconnectedGraphs(graph) {
	let aComponents = [];

	for(let i=0; i<graph.length; i++){
		let [a,b,d] = graph[i];
		let bInserted = false;

		//if edge matches with another group then add it in or create new group
		for(let j=0; j< aComponents.length; j++){
			let aGroup = aComponents[j];
			if(aGroup.includes(a) || aGroup.includes(b)){
				aGroup = Array.from(new Set(aGroup.concat([a,b])));
				aComponents[j] = aGroup;
				bInserted = true;
				break;
			}
		}

		if(!bInserted){
			aComponents.push([a,b]);
		}
	}

	return aComponents;
}

function handleClusterMaking(allCities, centersNumber) {
	let MST = findMST(allCities);

	let aSortedMST = MST.sort(([a1, b1, d1], [a2, b2, d2]) => d2 - d1);

	let iEdgesToRemove = centersNumber - 1;
	aSortedMST.splice(0, iEdgesToRemove);

	return findDisconnectedGraphs(aSortedMST);
}

function generateWeightedCoGCenters(aCityClusters) {
	let aAllCities = ElementsManagement.cities;

	aCityClusters.forEach(aCluster=>{
		let cSumXP = 0;
		let cSumYP = 0;
		let iSumP = 0;
		aCluster.forEach(sCity=>{
			let oCityData = aAllCities[Number(sCity)];
			cSumXP += oCityData.x * oCityData.population;
			cSumYP += oCityData.y * oCityData.population;
			iSumP += oCityData.population;
		})

		let tmpNewCenterX = Math.floor(cSumXP/iSumP);
		let tmpNewCenterY = Math.floor(cSumYP/iSumP);

		let newCenter = ElementsManagement.addAlgorithmCenter(tmpNewCenterX, tmpNewCenterY);
		newCenter.display();
	});
}

function approxWithCenterOfGravityAlgorithm() {
	ElementsManagement.algorithmCenters.length = 0;
	let centersNumber = ElementsManagement.centersNumber;
	let allCities = ElementsManagement.cities;

	let aCityClusters = handleClusterMaking(allCities, centersNumber);
	generateWeightedCoGCenters(aCityClusters)

}

function approxWithLloydAlgorithm() {
  ElementsManagement.algorithmCenters.length = 0;
	let centersNumber = ElementsManagement.centersNumber;
  let allCities = ElementsManagement.cities;

  let sites_x = allCities.map(city => city.x);
  let sites_y = allCities.map(city => city.y);
  let cluster = kmeans([sites_x, sites_y], centersNumber);
  let data = cluster.predict();

  data.centroids.map(point => {
    let newCenter = ElementsManagement.addAlgorithmCenter(point[0], point[1]);
    newCenter.display();

    return point;
  });
}

function approxWithSimpleMedianAlgorithm() {
	ElementsManagement.algorithmCenters.length = 0;
	let centersNumber = ElementsManagement.centersNumber;
	let allCities = ElementsManagement.cities;

	let sites_x = allCities.map(city => city.x);
	let sites_y = allCities.map(city => city.y);
	let cluster = kmeans([sites_x, sites_y], centersNumber);
	let data = cluster.predict();

	let aCentroids = data.centroids.map(point => {return {x:point[0], y:point[1]}});

	let aNearestCenters = findNearestCenters(aCentroids);
	let aNodeClusters = findClustersFromCentroids(aNearestCenters);

	generateCentersSimpleMedianAlgorithm(aNodeClusters);
}

function findClustersFromCentroids(aNearestCenters) {
	let oClusters = {};
	aNearestCenters.forEach((oData, iIndex)=>{
		let sCenterKey = oData.center[0]+""+oData.center[1];
		if(oClusters[sCenterKey]){
			oClusters[sCenterKey].push(iIndex);
		}else{
			oClusters[sCenterKey] = [iIndex];
		}
	})

	return Object.values(oClusters);
}

function generateCentersSimpleMedianAlgorithm(aCityClusters) {
	let aAllCities = ElementsManagement.cities;

	aCityClusters.forEach(aCluster => {
		let iSumP = 0;
		aCluster.forEach(sCity => {
			let oCityData = aAllCities[Number(sCity)];
			iSumP += oCityData.population;
		});
		let medianSumP = (iSumP + 1) / 2;

		//To find X co-ordinate of centroid;
		let aSortedByX = aCluster.sort((a, b) => aAllCities[Number(a)].x - aAllCities[Number(b)].x);
		let centerX = 0;
		let popComparator = 0;
		for(let sCity of aSortedByX){
			let oCityData = aAllCities[Number(sCity)];
			popComparator += oCityData.population;
			if (popComparator >= medianSumP) {
				centerX = oCityData.x;
				break;
			}
		}

		//To find Y co-ordinate of centroid;
		let aSortedByY = aCluster.sort((a, b) => aAllCities[Number(a)].y - aAllCities[Number(b)].y);
		let centerY = 0;
		popComparator = 0;
		for(let sCity of aSortedByY){
			let oCityData = aAllCities[Number(sCity)];
			popComparator += oCityData.population;
			if (popComparator >= medianSumP) {
				centerY = oCityData.y;
				break;
			}
		}

		let newCenter = ElementsManagement.addAlgorithmCenter(centerX, centerY);
		newCenter.display();
	});
}