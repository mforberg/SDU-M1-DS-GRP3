let location_map;
let heat_map;
// let cluster_average;
document.addEventListener("DOMContentLoaded", function(event ){
    location_map = L.map('locationmap');
    heat_map = L.map('sensorheat');
    // cluster_average = L.map('clusterAverage');
});

function visualize_all_graphs(result){
    //instantiate
    let sensors = result['sensor_location'];
    let clusters = result['clusters'];
    let normalize_values = result['normalize_values'];
    let min = normalize_values[0]['low'];
    let max = normalize_values[0]['high'];
    let latList = [];
    let longList = [];
    let idList = [];
    let p1List = [];
    clusters.forEach(element => {
        latList.push(denormalize(element['lat'], max, min));
        longList.push(denormalize(element['lon'], max, min));
        idList.push(element['id']);
        p1List.push(denormalize(element['P1'], max, min));
    });
    // Visualize location of sensors and clusters on location map
    location_map_visualization(sensors, latList, longList, idList, p1List);
    // Visualize heat on heat map
    heat_map_visualization(p1List, latList, longList);
    // Visualize bar chart
    visualize_bar_chart(idList, p1List);
    // 3D graph of clusters
    visualize3DGraph(latList, longList, p1List);
    // Visualize normal maps
    setViews(latList, longList);
}

function location_map_visualization(sensors, latList, longList, idList, p1List){
    let normal_list = create_normalize_list(p1List);
    // get color
    let colorList = [];
    normal_list.forEach(variable => {
        // TODO: Check when true data is received.
        let value = (1.0 - variable) * 240;
        colorList.push("hsl(" + value + ", 100%, 50%)");
    });

    makeSensorDots(sensors, location_map);
    makeClusterCircles(latList, longList, idList, colorList, location_map);
    addMap(location_map);
}

function heat_map_visualization(p1List, latList, longList){
    let heatList = [];
    for (let i = 0; i < p1List.length; i++){
        let heatTemp = [];
        heatTemp.push(latList[i]);
        heatTemp.push(longList[i]);
        heatTemp.push(p1List[i]);
        heatList.push(heatTemp);
    }

    let heat = L.heatLayer(
        heatList // lat, lng, intensity
        , {radius: 15}).addTo(heat_map);
    addMap(heat_map);
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
            color: '#505050',
            fillColor: '#000000',
            fillOpacity: 0.5,
            radius: 0.3
        }).addTo(map);
    }
}

function makeClusterCircles(latList, longList, idList, colorList, map){
    for(let i = 0; i < idList.length; i++) {
        console.log(latList[i]);
        let circle = L.circle([latList[i], longList[i]], {
            color: colorList[i],
            fillColor: '#0000ff',
            fillOpacity: 0,
            radius: 1000
        }).addTo(map).bindPopup("<b>ID</b><br />" + idList[i]);
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

function setViews(latList, longList){
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);
    location_map.setView([latMid, longMid], 11);
    heat_map.setView([latMid, longMid], 11);
    // cluster_average.setView([latMid, longMid], 11);
}

function denormalize(normalValue, high, low) {
    return Number(Number(normalValue) * (Number(high) - Number(low)) + Number(low));
}

function normalize(value, low, high){
    return (value - low) / (high - low);
}

function create_normalize_list(list_of_numbers){
    let low = 10000;
    let high = -1;
    // find highest and lowest value
    list_of_numbers.forEach(variable => {
        if (variable > high){
            high = variable;
        } else if (variable < low){
            low = variable;
        }
    });
    // normalize
    let normal = [];
    list_of_numbers.forEach(variable => {
        normal.push(normalize(variable, low, high));
    });
    return normal;
}

// function visualize_location_of_sensors_and_clusters(result){
//     // Retrieve sensors and clusters from result.
//     let sensors = result['sensor_location'];
//     let clusters = result['clusters'];
//     let normalize_values = result['normalize_values'];
//     let min = normalize_values[0]['low'];
//     let max = normalize_values[0]['high'];
//     let latList = [];
//     let longList = [];
//     let idList = [];
//     clusters.forEach(element => {
//         // latList.push(denormalize(element['lat'], max, min));
//         // longList.push(denormalize(element['lon'], max, min));
//         latList.push(element['lat']);
//         longList.push(element['lon']);
//         idList.push(element['id']);
//     });
//     let latMid = getMedianFromList(latList, 0, latList.length);
//     let longMid = getMedianFromList(longList, 0, longList.length);
//     location_map.setView([latMid, longMid], 11);
//     makeSensorDots(sensors, location_map);
//     makeClusterCircles(latList, longList, idList, location_map);
//     addMap(location_map);
// }

// function visualize_heatmap(result){
//     let heatList = [];
//     let latList = [];
//     let longList = [];
//     result.forEach(element => {
//         let temp = [];
//         latList.push(element['lat']);
//         longList.push(element['lon']);
//         temp.push(element['lat']);
//         temp.push(element['lon']);
//         //TODO: Convert P1 to an intensity
//         temp.push(element['P1']);
//         heatList.push(temp);
//     });
//     let latMid = getMedianFromList(latList, 0, latList.length);
//     let longMid = getMedianFromList(longList, 0, longList.length);
//     heat_map.setView([latMid, longMid], 11);
//     let heat = L.heatLayer(
//         heatList // lat, lng, intensity
//     , {radius: 15}).addTo(heat_map);
//     addMap(heat_map);
// }

// function visualize_clusters_average(result){
//     let latList = [];
//     let longList = [];
//     let colorList = [];
//     result.forEach(element => {
//         latList.push(element['lat']);
//         longList.push(element['lon']);
//         // TODO: Check when true data is received.
//         let value = (1.0 - element['P1']) * 240;
//         colorList.push("hsl(" + value + ", 100%, 50%)");
//     });
//     let latMid = getMedianFromList(latList, 0, latList.length);
//     let longMid = getMedianFromList(longList, 0, longList.length);
//     cluster_average.setView([latMid, longMid], 11);
//     visualize_clusters_with_color(result, cluster_average, colorList);
//     addMap(cluster_average);
// }

// function visualize_clusters_with_color(result, map, colorList){
//     for(let i = 0; i < result.length; i++) {
//         let circle = L.circle([result[i]['lat'], result[i]['lon']], {
//             color: colorList[i],
//             //color: "hsl(100, 100%, 50%)",
//             fillColor: '#0000ff',
//             fillOpacity: 0,
//             radius: 1000
//         }).addTo(map).bindPopup("this is circle");
//
//         // circle.bindPopup("I am a circle.");
//     }
// }