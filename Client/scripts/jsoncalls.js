$(document).ready(function(){
    $("#b1").click(function(){
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {functionname: 'getLocationData'},

            success: function (obj) {
                if( !('error' in obj) ) {
                    visualize_location_of_sensors_and_clusters(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown){
                console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
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
    $("#b2").click(function(){
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getSensors',
                weeknumber: document.getElementById("week").value
            },
            success: function (obj) {
                if( !('error' in obj) ) {
                    // put visualization
                    visualize_heatmap(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown){
                console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
            }
        });
    });
    $("#b3").click(function(){
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getClusters',
                weeknumber: document.getElementById("week").value
            },
            success: function (obj) {
                if( !('error' in obj) ) {
                    // put visualization
                    visualize_stacked_bar_chart(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown){
                console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
            }
        });
    });
    $("#b4").click(function(){
        $.ajax({
            type: "GET",
            url: 'database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getTotalSensors'
            },
            success: function (obj) {
                if( !('error' in obj) ) {
                    // put visualization
                    visualize_heatmap(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (xhr, textStatus, errorThrown){
                console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
            }
        });
    });
});