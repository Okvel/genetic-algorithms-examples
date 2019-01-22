var Lab2Starter = {
    window: null,
    main: null,

    graphBlock: {
        element: null,
        children: {
            N: null,
            pc: null,
            pm: null,
            limit: null,
            speed: null,
            x1: null,
            x2: null,
            y: null
        },

        init: function () {
            'use strict';
            this.element = $('#graph_block');
            this.children.N = $('#N', this.element);
            this.children.pc = $('#pc', this.element);
            this.children.pm = $('#pm', this.element);
            this.children.limit = $('#limit', this.element);
            this.children.speed = $('#speed', this.element);
            this.children.x1 = $('#x1', this.element);
            this.children.x2 = $('#x2', this.element);
            this.children.y = $('#y', this.element);
        },

        render: function () {
            'use strict';
            let graphId = 'graph';
            let valuesId = 'values';

            Drawer.clear(graphId);
            Drawer.drawLevels(graphId, Lab2.calculate(-100, 100));
            Drawer.addPoints(graphId, []);
            Drawer.activate(valuesId, {range: [0, 1], dtick: 0.1}, 1);
        },

        calculate: function() {
            'use strict';
            let N = this.children.N.prop('value');
            let pc = this.children.pc.prop('value');
            let pm = this.children.pm.prop('value');
            let limit = this.children.limit.prop('value');
            let speed = this.children.speed.prop('value');
            let graphId ='graph';
            let valuesId = 'values';

            var population = Lab2.initPopulation(-100, 100, N);

            Drawer.clear(valuesId);
            Drawer.activate(valuesId, {range: [0, 1], dtick: 0.1}, 1);

            Lab2.findMin(N, limit, pc, pm, graphId, valuesId, population, 0, speed, {x1: this.children.x1, x2: this.children.x2, y: this.children.y});
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
        'use strict';
        this.graphBlock.render();
    },

    calculate: function() {
        'use strict';
        this.graphBlock.calculate();
    }
};

(() => {
    'use strict';
    Lab2Starter.init(this);
    Lab2Starter.render();
})();