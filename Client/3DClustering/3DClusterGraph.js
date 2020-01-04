function visualize3DGraph(result) {
   /* Plotly.d3.json(result, function (err, rows) {

        function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
        }

        var data = [{
            x: unpack(rows, 'lon'),
            y: unpack(rows, 'lat'),
            z: unpack(rows, 'P1'),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                color: 'rgb(23, 190, 207)',
                size: 2
            }
        }, {
            alphahull: 7,
            opacity: 0.1,
            type: 'mesh3d',
            x: unpack(rows, 'lon'),
            y: unpack(rows, 'lat'),
            z: unpack(rows, 'P1')
        }];

        var layout = {
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
                    type: 'linear',
                    zeroline: false
                },
                yaxis: {
                    type: 'linear',
                    zeroline: false
                },
                zaxis: {
                    type: 'linear',
                    zeroline: false
                }
            },
            title: '3D Clustering',
            width: 477
        };

        Plotly.newPlot('3DClustering', data, layout);

    });
*/
    var data = result;


    function unpack(rows, key) {
        return rows.map(function (row) { return row[key]; });
    }

    var data1 = [{
        x: unpack(data, 'lon'),
        y: unpack(data, 'lat'),
        z: unpack(data, 'P1'),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            color: 'rgb(23, 190, 207)',
            size: 2
        }
    }, {
        alphahull: 7,
        opacity: 0.1,
        type: 'mesh3d',
        x: unpack(data, 'lon'),
        y: unpack(data, 'lat'),
        z: unpack(data, 'P1')
    }];

    var layout = {
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
                type: 'linear',
                zeroline: false
            },
            yaxis: {
                type: 'linear',
                zeroline: false
            },
            zaxis: {
                type: 'linear',
                zeroline: false
            }
        },
        title: '3D Clustering',
        width: 477
    };

    Plotly.newPlot('3DClustering', data1, layout);

};