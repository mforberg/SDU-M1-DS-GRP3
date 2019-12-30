
function visualize_location_of_sensors_and_clusters(result){
    let sensors = result['sensor_location'];
    let clusters = result['cluster_location'];
    let latList = [];
    let longList = [];
    sensors.forEach(element => {
        latList.push(element['lat']);
        longList.push(element['lon']);
    });
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);
    let map = L.map('locationmap').setView([latMid, longMid], 11);
    makePoly(map, latList, longList);
    visualize_clusters(clusters, map)
}

function visualize_clusters(result, map){
    let latList = [];
    let longList = [];
    let radiusList = [];
    result.forEach(element => {
        latList.push(element['lat']);
        longList.push(element['lon']);
        radiusList.push(element['range']);
    });
    makeClusterCircles(map, latList, longList, radiusList)
}

function getMedianFromList(pointList, startInt, amount){
    let tempList = [];
    for(let i = startInt; i < startInt + amount; i++){
        tempList.push(parseFloat(pointList[i]));
    }
    let sortedList = tempList.sort();
    return sortedList[Math.ceil(sortedList.length / 2)];
}

function makePoly(map, latList, longList) {
    for(let i = 0; i < latList.length; i++){
        let circle = L.circle([latList[i], longList[i]], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 0.3
        }).addTo(map);
    }

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZ3J1cHBlOSIsImEiOiJjazFraDBuMHkwYjF2M2RwZTMwcG8xN3A2In0.HEkSoG1OZLOExq_3KNiZVA'
    }).addTo(map);
}

function makeClusterCircles(map, latList, longList, radius){
    for(let i = 0; i < latList.length; i++) {
        let circle = L.circle([latList[i], longList[i]], {
            color: 'blue',
            fillColor: '#0000ff',
            fillOpacity: 0,
            radius: radius[i]
        }).addTo(map);
    }

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZ3J1cHBlOSIsImEiOiJjazFraDBuMHkwYjF2M2RwZTMwcG8xN3A2In0.HEkSoG1OZLOExq_3KNiZVA'
    }).addTo(map);
}