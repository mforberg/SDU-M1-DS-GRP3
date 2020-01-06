$(document).ready(function () {
    $("#sensorsAndClustersButton").click(function () {
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: { functionname: 'getLocationData',
                    monthnumber: document.getElementById("month").value,
                    yearnumber: document.getElementById("year").value
            },

            success: function (obj) {
                if (!('error' in obj)) {
                    visualize_location_of_sensors_and_clusters(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('STATUS: ' + textStatus + '\nERROR THROWN: ' + errorThrown);
            }
        });

        // $.ajax({
        //     type: "GET",
        //     url: 'database_connection.php',
        //     dataType: 'json',
        //     data: {
        //         functionname: 'getSpecificCluster',
        //         weeknumber: document.getElementById("week").value,
        //         sensorID: document.getElementById("clusterID").value
        //     },
        //
        //     success: function (obj) {
        //         if( !('error' in obj) ) {
        //
        //             // put visualization
        //             console.log(obj.result);
        //
        //         }
        //         else {
        //             console.log(obj.error);
        //         }
        //     },
        //
        //     error: function (xhr, textStatus, errorThrown){
        //         console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
        //     }
        // });
    });
    $("#heatClustersButton").click(function () {
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getClusters',
                monthnumber: document.getElementById("month").value,
                yearnumber: document.getElementById("year").value
            },
            success: function (obj) {
                if (!('error' in obj)) {
                    // put visualization
                    visualize_heatmap(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('STATUS: ' + textStatus + '\nERROR THROWN: ' + errorThrown);
            }
        });
    });
    $("#barChartButton").click(function () {
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getClustersAndNormalValues',
                monthnumber: document.getElementById("month").value,
                yearnumber: document.getElementById("year").value
            },
            success: function (obj) {
                if (!('error' in obj)) {
                    // put visualization
                    visualize_bar_chart(obj.result);
                } else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('STATUS: ' + textStatus + '\nERROR THROWN: ' + errorThrown);
            }
        });
    });

    $("#b4").click(function () {
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getTotalSensors'
            },
            success: function (obj) {
                if (!('error' in obj)) {
                    // put visualization
                    visualize_clusters_average(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('STATUS: ' + textStatus + '\nERROR THROWN: ' + errorThrown);
            }
        });
    });

    $("#b5").click(function () {
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getClusters',
                monthnumber: document.getElementById("month").value,
                yearnumber: document.getElementById("year").value
            },
            success: function (obj) {
                if (!('error' in obj)) {
                    visualize3DGraph(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('STATUS: ' + textStatus + '\nERROR THROWN: ' + errorThrown);
            }
        });
    });


});
