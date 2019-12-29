function visualize_locations2(result){
    let yourVlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        data: {
            values:
                result
        },
        mark: 'point',
        encoding: {
            "x": {"field": "lon", "type": "quantitative", "scale": {"domain": [20, 25]}},
            "y": {"field": "lat", "type": "quantitative", "scale": {"domain": [40, 45]}}
        }
    };
    vegaEmbed('#vis', yourVlSpec);
}