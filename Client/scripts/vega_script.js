function visualize_bar_chart(result){
    let clusters = result['clusters'];
    let min = result['normalize_values']['_min'];
    let max = result['normalize_values']['_max'];
    let latList = [];
    let longList = [];
    clusters.forEach(element => {
        latList.push(denormalize(element['lat'], max, min));
        longList.push(denormalize(element['lon'], max, min));
    });
    // convert to the format of the example
    let combinedData = [];
    for (let i = 0; i < latList.length; i++){

    }
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

    let yourVlSpec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 400,
        "height": 200,
        "padding": 5,

        "data": [
            {
                "name": "table",
                "values": [
                    {"category": "A", "amount": 28},
                    {"category": "B", "amount": 55},
                    {"category": "C", "amount": 43},
                    {"category": "D", "amount": 91},
                    {"category": "E", "amount": 81},
                    {"category": "F", "amount": 53},
                    {"category": "G", "amount": 19},
                    {"category": "H", "amount": 87}
                ]
            }
        ],

        "signals": [
            {
                "name": "tooltip",
                "value": {},
                "on": [
                    {"events": "rect:mouseover", "update": "datum"},
                    {"events": "rect:mouseout",  "update": "{}"}
                ]
            }
        ],

        "scales": [
            {
                "name": "xscale",
                "type": "band",
                "domain": {"data": "table", "field": "category"},
                "range": "width",
                "padding": 0.05,
                "round": true
            },
            {
                "name": "yscale",
                "domain": {"data": "table", "field": "amount"},
                "nice": true,
                "range": "height"
            }
        ],

        "axes": [
            { "orient": "bottom", "scale": "xscale" },
            { "orient": "left", "scale": "yscale" }
        ],

        "marks": [
            {
                "type": "rect",
                "from": {"data":"table"},
                "encode": {
                    "enter": {
                        "x": {"scale": "xscale", "field": "category"},
                        "width": {"scale": "xscale", "band": 1},
                        "y": {"scale": "yscale", "field": "amount"},
                        "y2": {"scale": "yscale", "value": 0}
                    },
                    "update": {
                        "fill": {"value": "steelblue"}
                    },
                    "hover": {
                        "fill": {"value": "red"}
                    }
                }
            },
            {
                "type": "text",
                "encode": {
                    "enter": {
                        "align": {"value": "center"},
                        "baseline": {"value": "bottom"},
                        "fill": {"value": "#333"}
                    },
                    "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                        "text": {"signal": "tooltip.amount"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                    }
                }
            }
        ]
    }
    vegaEmbed('#vis', yourVlSpec);
}

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