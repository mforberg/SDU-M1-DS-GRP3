function visualize3DGraph(latList, longList, p1List) {
    let data1 = [{
        x: longList,
        y: latList,
        z: p1List,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            color: 'rgb(23, 190, 207)',
            size: 2
        }
    }];

    let layout = {
        autosize: true,
        height: 480,
        scene: {
            aspectratio: {
                x: 1,
                y: 1,
                z: 1
            },
            camera: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                eye: {
                    x: 1.25,
                    y: 1.25,
                    z: 1.25
                },
                up: {
                    x: 0,
                    y: 0,
                    z: 1
                }
            },
            xaxis: {
                title: 'Longitude',
                type: 'linear',
                zeroline: false
            },
            yaxis: {
                title: 'Latitude',
                type: 'linear',
                zeroline: false
            },
            zaxis: {
                title: 'P10',
                type: 'linear',
                zeroline: false
            }
        },
        title: '3D Clustering',
        width: 477
    };

    Plotly.newPlot('3DClustering', data1, layout);

}