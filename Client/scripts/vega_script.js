function visualize_stacked_bar_chart(result){
    // convert to the format of the example
    let combinedData = [];
    result.forEach(element => {
        let topData = {};
        topData['x'] = element['_month'];
        topData['y'] = element['P1'] - element['P2'];
        topData['c'] = 1;
        let bottomData ={};
        bottomData['x'] = element['_month'];
        bottomData['y'] = element['P2'];
        bottomData['c'] = 2;
        // order matters
        combinedData.push(bottomData);
        combinedData.push(topData);
    });
    let jsonData = JSON.stringify(combinedData);

    // let yourVlSpec = {
    //     "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    //     "data": [
    //         {
    //             "name": "table",
    //             "values": jsonData
    //         }
    //
    //     ],
    //     "mark": "bar",
    //     "encoding": {
    //         "x": {
    //             "timeUnit": "month",
    //             "field": "x",
    //             "type": "ordinal",
    //             "axis": {"title": "Month of the year"}
    //         },
    //         "y": {
    //             "aggregate": "y",
    //             "type": "quantitative",
    //             "axis": {"title": "poopoo"}
    //         },
    //         "color": {
    //             "field": "c",
    //             "type": "nominal",
    //             "scale": {
    //                 "domain": ["1", "2"],
    //                 "range": ["#e7ba52", "#c76986"]
    //             },
    //             "legend": {"title": "Particulate Matter"}
    //         }
    //     }
    // };



    let yourVlSpec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 300,
        "height": 200,
        "padding": 5,

        "data": [
        {
            "name": "table",
            "values": jsonData,
            "transform": [
                {
                    "type": "stack",
                    "groupby": ["x"],
                    "field": "y"
                }
            ]
        }
    ],

        "scales": [
        {
            "name": "x",
            "type": "band",
            "range": "width",
            "domain": {"data": "table", "field": "x"}
        },
        {
            "name": "y",
            "type": "linear",
            "range": "height",
            "nice": true, "zero": true,
            "domain": {"data": "table", "field": "y1"}
        },
        {
            "name": "color",
            "type": "ordinal",
            "range": "category",
            "domain": {"data": "table", "field": "c"}
        }
    ],

        "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "Month of the year"},
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Particulate Matter"}
    ],

        "marks": [
        {
            "type": "rect",
            "from": {"data": "table"},
            "encode": {
                "enter": {
                    "x": {"scale": "x", "field": "x"},
                    "width": {"scale": "x", "band": 1, "offset": -1},
                    "y": {"scale": "y", "field": "y0"},
                    "y2": {"scale": "y", "field": "y1"},
                    "fill": {"scale": "color", "field": "c"}
                },
                "update": {
                    "fillOpacity": {"value": 1}
                },
                "hover": {
                    "fillOpacity": {"value": 0.5}
                }
            }
        }
    ]
    };
    vegaEmbed('#vis', yourVlSpec);
}