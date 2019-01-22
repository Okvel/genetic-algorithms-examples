class Lab1 {
    static _fitnessFunction(t) {
        return (1.3 * t + 1.9) * Math.cos(1.1 * Math.PI * t - 1.5);
    }

    static calculate(a, b) {
        const x = [];
        const y = [];

        for (let t = a; t < b; t += 0.01) {
            let result = Lab1._fitnessFunction(t);

            x.push(t);
            y.push(result);
        }

        return {
            x: x,
            y: y
        }
    }

    static toReal(num, a, b) {
        var dec = 0;
        var n = num.length;
        for (var i = n-1; i >= 0; i--) {
            dec += num[n - 1 - i] * Math.pow(2, i);
        }

        return a + dec * (b - a) / (Math.pow(2, n) - 1);
    }

    static toBinary(num, n) {
        var str = parseInt(num, 10).toString(2);
        if (str.length < n) {
            var diff = n - str.length;
            for (var i = 0; i < diff; i++) {
                str = '0' + str;
            }
        }
        
        var num = [];
        for (var i = 0; i < str.length; i++) {
            num.push(parseInt(str[i]));
        }

        return num;
    }

    static calculateNumOfParts(a, b, k) {
        var num = (b - a) * Math.pow(10, k);
        return Math.ceil(Math.log(num) / Math.log(2));
    }

    static initPopulation(limit, numOfGenomes, a, b) {
        var population = {
            x: [],
            y: [],
            binX: []
        };
        var elements = [];
        var i = 0;
        while (i < limit) {
            var element = Math.floor(Math.random() * (Math.pow(2, numOfGenomes) - 1));
            if (!elements.includes(element)) {
                elements.push(element);
                i++;
            }
        }

        for (var i = 0; i < limit; i++) {
            var x = this.toBinary(elements[i], numOfGenomes);
            var rX = this.toReal(x, a, b);
            population.binX.push(x);
            population.x.push(rX);
            population.y.push(this._fitnessFunction(rX));
        }

        return population;
    }

    static reproduction(chromosomes) {
        var probabilities = [];
        chromosomes.sort(function(a, b) {
            return a.f - b.f;
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

    static crossover(chromosomes, probability) {
        var parents = [];
        for (var i = 0; i < chromosomes.length; i++) {
            if (chromosomes[i].n != 0) {
                parents.push(chromosomes[i]);
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
                var p = Math.random();
                if (probability - p >= 0) {              
                    childrens.push(this.swap(parents[i].t, parents[ind].t));
                }
            }
        }

        return childrens;
    }

    static swap(a, b, left, right) {
        var c1 = [];
        var c2 = [];
        var k = Math.floor(Math.random() * a.length);
        for (var i = 0; i < k; i++) {
            c1.push(a[i]);
            c2.push(b[i]);
        }
        for (var i = k; i < b.length; i++) {
            c1.push(b[i]);
            c2.push(a[i]);
        }

        var c1Val = this._fitnessFunction(this.toReal(c1, left, right));
        var c2Val = this._fitnessFunction(this.toReal(c2, left, right));
        if (c1Val - c2Val <= 0) {
            return c1;
        }

        return c2;
    }

    static mutation(chromosome, probability) {
        var mutedChromosome = chromosome;
        var p = Math.random();
        if (probability - p >= 0) {
            var i = Math.floor(Math.random() * chromosome.length);
            mutedChromosome[i] = 1 - chromosome[i];
            return mutedChromosome;
        }

        return null;
    }

    static getAverageFuncValue(values) {
        var sum = 0;
        for (var i = 0; i < values.y.length; i++) {
            sum += values.y[i];
        }

        return sum / values.y.length;
    }

    static getBestFuncValue(values) {
        var items = [];
        for (var i = 0; i < values.y.length; i++) {
            items.push({
                f: values.y[i],
                t: values.x[i]
            });
        }
        items.sort(function(a, b) {
            return a.f - b.f;
        });

        return items[0];
    }

    static findMin(a, b, limit, n, g, pc, pm, drawerId, funcId, population, i, speed, formElements) {
        var avg = this.getAverageFuncValue(population);
        var best = this.getBestFuncValue(population);
        if (avg - best.f <= 0.1 || i == limit) {
            formElements.f.val(best.f.toFixed(3));
            formElements.t.val(best.t.toFixed(3));
            Drawer.deleteTraces(drawerId, 1);
            Drawer.extend(funcId, {
                avg: avg,
                best: best.f
            });
            Plotly.plot(drawerId, Drawer.markersForChart(population));
            console.log('end');
            return;
        }

        setTimeout(function() {
            Drawer.deleteTraces(drawerId, 1);
            Drawer.extend(funcId, {
                avg: avg,
                best: best.f
            });
            Plotly.plot(drawerId, Drawer.markersForChart(population))
            .then(function() {
                population = Lab1.getNextGeneration(a, b, population, g, pm, pc ,n, g);

                var best = Lab1.getBestFuncValue(population);

                formElements.f.val(best.f.toFixed(3));
                formElements.t.val(best.t.toFixed(3));

                Lab1.findMin(a, b, limit, n, g, pc, pm, drawerId, funcId, population, ++i, speed, formElements);
            });
        }, speed);
    }

    static equals (a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] - b[i] != 0) {
                return false;
            }
        }

        return true;
    }

    static getNextGeneration(a, b, population, g, pm, pc, n) {
        var o = [];
        for (var i = 0; i < population.y.length; i++) {
            o.push({
                f: population.y[i],
                t: population.binX[i],
                n: 0
            });
        }

        var parents = this.reproduction(o);
        var childrens = this.crossover(parents, pc);
        var mutants = [];
        for (var i = 0; i < childrens.length; i++) {
            var mutant = this.mutation(this.toBinary(childrens[i], g), pm);
            if (mutant !== null) {
                mutants.push(mutant);
            }
        }

        var total = [];
        for (var i = 0; i < parents.length; i++) {
            total.push({
                t: parents[i].t,
                f: parents[i].f
            });
        }
        for (var i = 0; i < childrens.length; i++) {
            total.push({
                t: childrens[i],
                f: this._fitnessFunction(this.toReal(childrens[i], a, b))
            });
        }
        for (var i = 0; i < mutants.length; i++) {
            total.push({
                t: mutants[i],
                f: this._fitnessFunction(this.toReal(mutants[i], a, b))
            });
        }
        total.sort(function(a, b) {
            return a.f - b.f;
        });
        
        population = {
            binX: [],
            x: [],
            y: []
        };
        population.binX.push(total[0].t);
        population.x.push(this.toReal(total[0].t, a, b));
        population.y.push(total[0].f);
        for (var i = 1; i < total.length && i < n; i++) {
            if (!this.equals(total[i-1].t, total[i].t)) {
                population.binX.push(total[i].t);
                population.x.push(this.toReal(total[i].t, a, b));
                population.y.push(total[i].f);
            }
        }

        if (population.y.length < n) {
            var elements = [];
            var tmpX = [];
            for (var i = 0; i < population.x.length; i++) {
                tmpX.push({x: population.x[i], bin: population.binX[i]});
            }
            tmpX.sort(function(a, b) {
                return a.x - b.x;
            });

            var min = 0;
            var max = 0;
            for (var i = g-1; i >= 0; i--) {
                min += tmpX[0].bin[g - 1 - i] * Math.pow(2, i);
                max += tmpX[tmpX.length-1].bin[g - 1 - i] * Math.pow(2, i);
            }

            var i = population.y.length;
            while (i < n) {
                var element = Math.floor(Math.random() * (max - min) + min);
                if (!elements.includes(element)) {
                    elements.push(element);
                    i++;
                }
            }
    
            for (var i = 0; i < elements.length; i++) {
                var x = this.toBinary(elements[i], g);
                var rX = this.toReal(x, a, b);
                population.binX.push(x);
                population.x.push(rX);
                population.y.push(this._fitnessFunction(rX));
            }
        }

        return population;
    }
}