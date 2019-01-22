class Drawer {

    static linesForChart(data) {
        return [{
            mode: 'line',
            x: data.x,
            y: data.y,
            showlegend: false
        }]
    }

    static markersForChart(data) {
        return [{
            mode: 'markers',
            x: data.x,
            y: data.y,
            marker: {
                color: 'red',
                size: 8
            },
            showlegend: false
        }]
    }

    static draw(divId, config) {
        Plotly.plot(divId, this.linesForChart(config.data), config.layout);
    }

    static clear(divId) {
        Plotly.purge(divId);
    }

    static addPoints(divId, values) {
        Plotly.plot(divId, this.markersForChart(values));
    }

    static activate(divId, config, xdtick) {
        Plotly.plot(divId, [{
            mode: 'line',
            y: [],
            name: 'average',
            line: {
                color: 'orange'
            }
        },
        {
            mode: 'line',
            y: [],
            name: 'best',
            line: {
                color: 'green'
            }
        }], {
            title: 'Average and best values',
            xaxis: {
                dtick: xdtick,
                showticklabels: false
            },
            yaxis: {
                range: config.range,
                dtick: config.dtick
            }
        });
    }

    static deleteTraces(divId, traceId) {
        Plotly.deleteTraces(divId, traceId);
    }

    static extend(divId, data) {
        Plotly.extendTraces(divId, {y: [[data.avg], [data.best]]}, [0, 1]);
    }

    static drawLevels(divId, data) {
        Plotly.plot(divId, [{
            x: data.x,
            y: data.y,
            z: data.z,
            ncontours: 30,
            showscale: false,
            type: 'contour'
        }], {
            title: 'Fitness function plot',
            xaxis: {
                range: [-100, 100],
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                range: [-100, 100],
                showgrid: false,
                zeroline: false
            }
        });
    }

    static drawCities(divId, data) {
        Plotly.plot(divId, this.getCitiesData(data), this.getCitiesLayout());
    }

    static getCitiesData(data) {
        return [{
            mode: 'lines+markers',
            x: data.x,
            y: data.y,
            marker: {
                size: 8
            },
            showlegend: false
        }];
    }

    static getCitiesLayout() {
        return {
            title: 'Cities graph',
            xaxis: {
                range: [0, 80],
                showgrid: false,
                showline: false,
                zeroline: false,
                showticklabels : false
            },
            yaxis: {
                range: [0, 80],
                showgrid: false,
                showline: false,
                zeroline: false,
                showticklabels : false
            }
        }
    }
}