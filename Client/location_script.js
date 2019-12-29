function visualize_locations(result){

    let latList = [];
    let longList = [];
    result.forEach(element => {
        latList.push(element['lat']);
        longList.push(element['lon']);
    });
    let latMid = getMedianFromList(latList, 0, latList.length);
    let longMid = getMedianFromList(longList, 0, longList.length);

    let map = L.map('map').setView([latMid, longMid], 11);
    makePoly(map, latList, longList);
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