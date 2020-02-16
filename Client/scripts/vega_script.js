function visualize_bar_chart(idList, p1List){
    // convert to the format of the example
    let exampleFormat = [];
    for (let i = 0; i < idList.length; i++){
        let inner = {};
        inner['id'] = idList[i];
        inner['p1'] = p1List[i].toFixed(2);
        inner.sort(function(a, b){return a - b});
        exampleFormat.push(inner);
    }



    let jsonData = JSON.stringify(exampleFormat);
    let yourVlSpec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 600,
        "height": 200,
        "padding": 5,

        "data": [
            {
                "name": "table",
                "values": jsonData
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
                "domain": {"data": "table", "field": "id", "type": "text", "sort": "ascending"},
                "range": "width",
                "padding": 0.05,
                "round": true
            },
            {
                "name": "yscale",
                "domain": {"data": "table", "field": "p1", "type": "text", "sort": "ascending"},
                "nice": true,
                "range": "height"
            }
        ],

        "axes": [
            { "orient": "bottom", "scale": "xscale", "title": "Cluster ID" },
            { "orient": "left", "scale": "yscale", "title": "P10 Value" }
        ],

        "marks": [
            {
                "type": "rect",
                "from": {"data":"table"},
                "encode": {
                    "enter": {
                        "x": {"scale": "xscale", "field": "id", "type": "text", "sort": "ascending"},
                        "width": {"scale": "xscale", "band": 1},
                        "y": {"scale": "yscale", "field": "p1", "type": "text", "sort": "ascending"},
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
                        "x": {"scale": "xscale", "signal": "tooltip.id", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.p1", "offset": -2},
                        "text": {"signal": "tooltip.p1"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"p1": 1}
                        ]
                    }
                }
            }
        ]
    };
    vegaEmbed('#vis', yourVlSpec);
}