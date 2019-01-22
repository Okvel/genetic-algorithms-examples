class Lab2 {
    static _fitnessFunction(x1, x2) {
        return 0.5 + (
            Math.pow(
                Math.sin(
                    Math.sqrt(Math.pow(x1, 2) + Math.pow(x2, 2))
                ), 2
            ) - 0.5
        ) / Math.pow(
            (
                1 + 0.001 * (Math.pow(x1, 2) + Math.pow(x2, 2))
            ), 2
        );
    }

    static calculate(a, b) {
        const x = [];
        const y = [];
        const z = [];

        for (let x1 = a; x1 <= b; x1 += 10) {
            for (let x2 = a; x2 <= b; x2 += 10) {
                let f = this._fitnessFunction(x1, x2);
                x.push(x1);
                y.push(x2);
                z.push(f);
            }
        }

        return {
            x: x,
            y: y,
            z: z
        }
    }

    static initPopulation(a, b, limit) {
        var population = {
            x: [],
            y: [],
            z: []
        };
        var i = 0;
        while (i < limit) {
            var x1 = Math.random() * (b - a) + a;
            var x2 = Math.random() * (b - a) + a;
            var y = this._fitnessFunction(x1, x2);
            if (!population.z.includes(y)) {
                population.x.push(x1);
                population.y.push(x2);
                population.z.push(y);
                i++;
            }
        }

        return population;
    }

    static findMin(N, limit, pc, pm, drawerId, funcId, population, i, speed, formElements) {
        var avg = this.getAverageFuncValue(population, N);
        var best = this.getBestFuncValue(population, N);
        if (avg - best.z <= 0.1 || i == limit) {
            formElements.x1.val(best.x.toFixed(3));
            formElements.x2.val(best.y.toFixed(3));
            formElements.y.val(best.z.toFixed(3));
            Drawer.deleteTraces(drawerId, 1);
            Drawer.extend(funcId, {
                avg: avg,
                best: best.z
            });
            Plotly.plot(drawerId, Drawer.markersForChart(population));
            console.log('end');
            return;
        }

        setTimeout(function() {
            Drawer.deleteTraces(drawerId, 1);
            Drawer.extend(funcId, {
                avg: avg,
                best: best.z
            });
            Plotly.plot(drawerId, Drawer.markersForChart(population))
            .then(function(){
                population = Lab2.getNextGeneraion(population, pc, pm, N);

                var best = Lab2.getBestFuncValue(population);
                formElements.x1.val(best.x.toFixed(3));
                formElements.x2.val(best.y.toFixed(3));
                formElements.y.val(best.z.toFixed(3));

                Lab2.findMin(N, limit, pc, pm, drawerId, funcId, population, ++i, speed, formElements);
            });
        }, speed);
    }

    static getAverageFuncValue(values) {
        var sum = 0;
        for (var i = 0; i < values.z.length; i++) {
            sum += values.z[i];
        }

        return sum / values.z.length;
    }

    static getBestFuncValue(values) {
        var items = [];
        for (var i = 0; i < values.x.length; i++) {
            items.push({
                z: values.z[i],
                x: values.x[i],
                y: values.y[i]
            });
        }
        items.sort(function(a, b) {
            return a.z - b.z;
        });

        return items[0];
    }

    static getNextGeneraion(population, pc, pm, N) {
        var o = [];
        for (var i = 0; i < population.x.length; i++) {
            o.push({
                x: population.x[i],
                y: population.y[i],
                z: population.z[i],
                n: 0
            });
        }

        var parents = this.reproduction(o);
        var childrens = this.crossover(parents, pc);
        var mutants = [];
        for (var i = 0; i < childrens.length; i++) {
            var mutant = this.mutation(childrens[i], pm);
            if (mutant != null) {
                mutants.push(mutant);
            }
        }

        var total = [];
        for (var i = 0; i < parents.length; i++) {
            total.push({
                x: parents[i].x,
                y: parents[i].y,
                z: parents[i].z
            });
        }
        for (var i = 0; i < childrens.length; i++) {
            total.push({
                x: childrens[i].x,
                y: childrens[i].y,
                z: this._fitnessFunction(childrens[i].x, childrens[i].y)
            });
        }
        for (var i = 0; i < mutants.length; i++) {
            total.push({
                x: mutants[i].x,
                y: mutants[i].y,
                z: this._fitnessFunction(mutants[i].x, mutants[i].y)
            });
        }
        total.sort(function(a, b) {
            return a.z - b.z;
        });

        population = {
            x: [],
            y: [],
            z: []
        }
        population.x.push(total[0].x);
        population.y.push(total[0].y);
        population.z.push(total[0].z);
        for (var i = 1; i < total.length && i < N; i++) {
            if (!this.equals(total[i-1], total[i])) {
                population.x.push(total[i].x);
                population.y.push(total[i].y);
                population.z.push(total[i].z);
            }
        }

        if (population.x.length < N) {
            var tmpX = [];
            for (var i = 0; i < population.x.length; i++) {
                tmpX.push(population.x[i]);
            }
            tmpX.sort(function(a, b) {
                return a - b;
            });

            var tmpY = [];
            for (var i = 0; i < population.y.length; i++) {
                tmpY.push(population.y[i]);
            }
            tmpY.sort(function(a, b) {
                return a - b;
            });

            for (var i = population.x.length; i < N; i++) {
                var x = Math.floor(Math.random() * (tmpX[tmpX.length - 1] - tmpX[0]) + tmpX[0]);
                var y = Math.floor(Math.random() * (tmpY[tmpY.length - 1] - tmpY[0]) + tmpY[0]);
                population.x.push(x);
                population.y.push(y);
                population.z.push(this._fitnessFunction(x, y));
            }
        }

        return population;
    }

    static reproduction(chromosomes) {
        var probabilities = [];
        chromosomes.sort(function(a, b) {
            return a.z - b.z;
        });
        var N = chromosomes.length;
        var a = Math.random() + 1;
        var b = 2 - a;
        for (var i = 0; i < N; i++) {
            var p = 1 / N * (a - (a - b) * i / (N - 1));
            probabilities[i] = p;
        }

        for (var i = 0; i < N; i++) {
            var pointer = Math.random();
            var stop = false;
            var j = 0;
            while (!stop) {
                var value = probabilities[0];;
                if (j != 0) {
                    for (var k = 0; k < j + 1; k++) {
                        value += probabilities[k];
                    }
                }
                if (value - pointer >= 0) {
                    chromosomes[j].n += 1;
                    stop = true;
                } else {
                    j++;
                }
            }
        }

        return chromosomes;
    }

    static crossover(a, p) {
        var parents = [];
        for (var i = 0; i < a.length; i++) {
            if (a[i].n != 0) {
                parents.push(a[i]);
            }
        }

        var childrens = [];
        var N = parents.length;
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < parents[i].n; j++) {
                var ind = 0;
                do {
                    ind = Math.floor(Math.random() * N);
                } while (ind == i);
                var x = parents[i].x;
                var y = parents[i].y;
                if (p - Math.random() >= 0) {
                    x = parents[i].x + Math.random() * (parents[ind].x - parents[i].x);
                }
                if (p - Math.random() >= 0) {
                    y = parents[i].y + Math.random() * (parents[ind].y - parents[i].y);
                }

                childrens.push({
                    x: x,
                    y: y
                });
            }
        }

        return childrens;
    }

    static mutation(a, p) {
        if (p - Math.random() >= 0) {
            return {
                x: a.x + Math.pow(-1, Math.round(Math.random())) * 0.5 * Math.random(),
                y: a.y + Math.pow(-1, Math.round(Math.random())) * 0.5 * Math.random()
            };
        }

        return null;
    }

    static equals(a, b) {
        if (a.x - b.x != 0) {
            return false;
        }

        if (a.y - b.y != 0) {
            return false;
        }

        if (a.z - b.z != 0) {
            return false;
        }

        return true;
    }
}