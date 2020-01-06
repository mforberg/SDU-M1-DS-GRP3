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
    let clusters = result['clusters'];
    let normalize_values = result['normalize_values'];
    let min = normalize_values[0]['low'];
    let max = normalize_values[0]['high'];
    let latList = [];
    let longList = [];
    clusters.forEach(element => {
        // latList.push(denormalize(element['lat'], max, min));
        // longList.push(denormalize(element['lon'], max, min));
        latList.push(element['lat']);
        longList.push(element['lat']);
    });
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);
    location_map.setView([latMid, longMid], 11);
    makeSensorDots(sensors, location_map);
    makeClusterCircles(latList, longList, location_map);
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
        // TODO: Check when true data is received.
        let value = (1.0 - element['P1']) * 240;
        colorList.push("hsl(" + value + ", 100%, 50%)");
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

function makeClusterCircles(latList, longList, map){
    for(let i = 0; i < latList.length; i++) {
        let circle = L.circle([latList[i], longList[i]], {
            color: 'blue',
            fillColor: '#0000ff',
            fillOpacity: 0,
            radius: 2
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

function denormalize(normalValue, max, min) {
    return normalValue * (max - min) + min;
}