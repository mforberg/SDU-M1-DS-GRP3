$(document).ready(function () {
    $("#createVisualizationButton").click(function () {
        $.ajax({
            type: "GET",
            url: 'database/database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'getData',
                monthnumber: document.getElementById("month").value,
                yearnumber: document.getElementById("year").value
            },

            success: function (obj) {
                if (!('error' in obj)) {
                    visualize_all_graphs(obj.result);
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

    $("#updateButton").click(function () {
        $.ajax({
            type: "GET",
            url: 'database/database_connection.php',
            dataType: 'json',
            data: {
                functionname: 'updateData'
            },

            success: function (obj) {
                if (!('error' in obj)) {
                    console.log(obj.result);
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
