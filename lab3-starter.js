var Lab3Starter = {
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
            y: null,
            tour: null
        },

        init: function () {
            'use strict';
            this.element = $('#graph_block');
            this.children.N = $('#N', this.element);
            this.children.pc = $('#pc', this.element);
            this.children.pm = $('#pm', this.element);
            this.children.limit = $('#limit', this.element);
            this.children.speed = $('#speed', this.element);
            this.children.y = $('#y', this.element);
            $('#file', this.element).on('change', Lab3.readFile);
            this.children.tour = $('#tour', this.element);
        },

        render: function () {
            'use strict';
            let graphId = 'graph';
            let valuesId = 'values';

            Drawer.clear(graphId);
            Drawer.activate(valuesId, {range: [400, 3000], dtick: 200}, 100);
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

            var population = Lab3.initPopulation(N);

            Drawer.clear(valuesId);
            Drawer.activate(valuesId, {range: [400, 3000], dtick: 200}, 100);

            Lab3.findBestWay(limit, 0, pc, pm, speed, graphId, valuesId, population, N);
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
    Lab3Starter.init(this);
    Lab3Starter.render();
})();