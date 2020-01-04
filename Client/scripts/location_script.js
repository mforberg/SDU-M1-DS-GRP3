let location_map;
let heat_map;
let cluster_average;
document.addEventListener("DOMContentLoaded", function(event ){
    location_map = L.map('locationmap');
    heat_map = L.map('sensorheat');
    cluster_average = L.map('clusterAverage');
});


function visualize_location_of_sensors_and_clusters(result){
    // Retrieve sensors and clusters from result.
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
    //let map = L.map('locationmap').setView([latMid, longMid], 11);
    location_map.setView([latMid, longMid], 11);
    makeSensorDots(sensors, location_map);
    makeClusterCircles(clusters, location_map);
    addMap(location_map);
}

function visualize_heatmap(result){
    let heatList = [];
    let latList = [];
    let longList = [];
    result.forEach(element => {
        let temp = [];
        latList.push(element['lat']);
        longList.push(element['lon']);
        temp.push(element['lat']);
        temp.push(element['lon']);
        //TODO: Convert P1 to an intensity
        temp.push(element['P1']);
        heatList.push(temp);
    });
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);
    heat_map.setView([latMid, longMid], 11);
    let heat = L.heatLayer(
        heatList // lat, lng, intensity
    , {radius: 15}).addTo(heat_map);
    addMap(heat_map);
}

function visualize_clusters_average(result){
    let latList = [];
    let longList = [];
    let colorList = [];
    result.forEach(element => {
        latList.push(element['lat']);
        longList.push(element['lon']);
        // TODO: change int to be an element from result.
        let value = (1.0 - element['P1']) * 240;
        colorList.push("hsl(" + value + ", 100%, 50%)");
        //colorList.push('red');
    });
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);
    cluster_average.setView([latMid, longMid], 11);
    visualize_clusters_with_color(result, cluster_average, colorList);
    addMap(cluster_average);
}

function visualize_clusters_with_color(result, map, colorList){
    for(let i = 0; i < result.length; i++) {
        let circle = L.circle([result[i]['lat'], result[i]['lon']], {
            color: colorList[i],
            //color: "hsl(100, 100%, 50%)",
            fillColor: '#0000ff',
            fillOpacity: 0,
            radius: result[i]['range']
        }).addTo(map);
    }
}

function getMedianFromList(pointList, startInt, amount){
    if (pointList.length === 1){
        return pointList[0];
    }
    let tempList = [];
    for(let i = startInt; i < startInt + amount; i++){
        tempList.push(parseFloat(pointList[i]));
    }
    let sortedList = tempList.sort();
    return sortedList[Math.ceil(sortedList.length / 2)];
}

function makeSensorDots(result, map) {
    for(let i = 0; i < result.length; i++){
        let circle = L.circle([result[i]['lat'], result[i]['lon']], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 0.3
        }).addTo(map);
    }
}

function makeClusterCircles(result, map){
    for(let i = 0; i < result.length; i++) {
        let circle = L.circle([result[i]['lat'], result[i]['lon']], {
            color: 'blue',
            fillColor: '#0000ff',
            fillOpacity: 0,
            radius: result[i]['range']
        }).addTo(map);
    }
}

function addMap(map){
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZ3J1cHBlOSIsImEiOiJjazFraDBuMHkwYjF2M2RwZTMwcG8xN3A2In0.HEkSoG1OZLOExq_3KNiZVA'
    }).addTo(map);
}