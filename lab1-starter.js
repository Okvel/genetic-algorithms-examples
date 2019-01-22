var Lab1Starter = {
    window: null,
    main: null,

    graphBlock: {
        element: null,
        children: {
            N: null,
            g: null,
            pc: null,
            pm: null,
            limit: null,
            speed: null,
            f: null,
            t: null
        },
        init: function () {
            'use strict';
            this.element = $('#graph_block');
            this.children.N = $('#N', this.element);
            this.children.g = $('#g', this.element);
            this.children.pc = $('#pc', this.element);
            this.children.pm = $('#pm', this.element);
            this.children.limit = $('#limit', this.element);
            this.children.speed = $('#speed', this.element);
            this.children.f = $('#f', this.element);
            this.children.t = $('#t', this.element);
        },
        render: function () {
            'use strict';
            let graphId = 'graph';
            let valuesGraphId = 'values';

            Drawer.clear(graphId);
            Drawer.draw(graphId, {
                data: Lab1.calculate(-6, 6),
                layout: {
                    title: 'Fitness function plot',
                    xaxis: {
                        range: [-6.5, 6.5],
                        dtick: 1
                    },
                    yaxis: {
                        range: [-10.5, 10.5]
                    }
                }
            });
            Drawer.addPoints(graphId, []);
            Drawer.activate(valuesGraphId, {range: [-10, 2], dtick: 1}, 1);
        },

        calculate: function() {
            'use strict';
            let N = this.children.N.prop('value');
            let g = this.children.g.prop('value');
            let pc = this.children.pc.prop('value');
            let pm = this.children.pm.prop('value');
            let limit = this.children.limit.prop('value');
            let speed = this.children.speed.prop('value');
            let graphId ='graph';
            let functionId = 'values';

            var population = Lab1.initPopulation(N, g, -6, 6);

            Drawer.clear(functionId);
            Drawer.activate(functionId, {range: [-10, 2], dtick: 1}, 1);

            Lab1.findMin(-6, 6, limit, N, g, pc, pm, graphId, functionId, population, 0, speed, {f: this.children.f, t: this.children.t});
        }
    },

    init: function (window) {
        'use strict';
        this.window = window;
        this.main = $('#main');

        this.graphBlock.init(this.main);
        this.main.append(this.graphBlock.element);
    },

    render: function () {
        "use strict";
        this.graphBlock.render();
    },

    calculate: function() {
        'use strict';
        this.graphBlock.calculate();
    }
};

(() => {
    'use strict';
    Lab1Starter.init(this);
    Lab1Starter.render();
})();