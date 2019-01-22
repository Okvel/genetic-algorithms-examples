class Lab3 {
    static _fitnessFunction(tour) {
        var price = 0;
        for (var i = 1; i < tour.length; i++) {
            var start = Lab3.cities.n.indexOf(tour[i-1]);
            var dest = Lab3.cities.n.indexOf(tour[i]);
            price += Math.sqrt(
                Math.pow(Lab3.cities.x[start] - Lab3.cities.x[dest], 2) + Math.pow(Lab3.cities.y[start] - Lab3.cities.y[dest], 2)
            );
        }
        var diff = Lab3.cities.x[Lab3.cities.n.indexOf(tour[tour.length - 1])] - Lab3.cities.x[Lab3.cities.n.indexOf(tour[0])];
        price += Math.sqrt(
            Math.pow(diff, 2) + Math.pow(diff, 2)
        );

        return price;
    }

    static readFile(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          Lab3.getCities(e.target.result);
        };
        reader.readAsText(file);
    }

    static getCities(rawData) {
        var data = rawData.split('\n');
        var start = data.indexOf('NODE_COORD_SECTION') + 1;
        var end = data.indexOf('EOF');
        for (var i = start; i < end; i++) {
            var coords = data[i].split(' ');
            Lab3.cities.n.push(coords[0]);
            Lab3.cities.x.push(coords[1]);
            Lab3.cities.y.push(coords[2]);
        }

        this.getTour(Lab3.cities);
        Drawer.drawCities('graph', Lab3.cities);
    }

    static getTour(points) {
        var tour = '';
        for (var i = 0; i < points.length; i++) {
            if (i == points.length - 1) {
                tour += points[i];
                break;
            }
            tour += points[i] + '-';
        }

        Lab3Starter.graphBlock.children.tour.val(tour);
    }

    static shuffle(data) {
        var newData = [];
        for (var i = 0; i < data.n.length; i++) {
            newData.push(data.n[i]);
        }

        for (var i = data.n.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * i);
            var temp = newData[i];
            newData[i] = newData[j];
            newData[j] = temp;
        }

        return newData;
    }

    static initPopulation(N) {
        var population = [];        
        for (var i = 0; i < N; i++) {
            var tour = this.shuffle(Lab3.cities);
            population.push({
                t: tour,
                p: this._fitnessFunction(tour)
            });
        }

        return population;
    }

    static findBestWay(limit, i, pc, pm, speed, drawerId, funcId, population, N) {
        console.log('iteration', i);
        var avg = this.getAveragePrice(population);
        var best = this.getBestPrice(population);

        if (avg - best.p <= 0.1 || i == limit) {
            console.log('end');
            return;
        }

        setTimeout(function() {
            Drawer.extend(funcId, {
                avg: avg,
                best: best.p
            });
            var bestCoords = {
                x: [],
                y: []
            };
            for (var j = 0; j < best.t.length; j++) {
                var k = Lab3.cities.n.indexOf(best.t[j]);
                bestCoords.x.push(Lab3.cities.x[k]);
                bestCoords.y.push(Lab3.cities.y[k]);
            }
            k = Lab3.cities.n.indexOf(best.t[0]);
            bestCoords.x.push(Lab3.cities.x[k]);
            bestCoords.y.push(Lab3.cities.y[k]);
            Drawer.clear(drawerId);
            Plotly.plot(drawerId, Drawer.getCitiesData(bestCoords), Drawer.getCitiesLayout())
            .then(function () {
                population = Lab3.getNextGeneration(population, pc, pm, N);
                
                var best = Lab3.getBestPrice(population);
                Lab3Starter.graphBlock.children.y.val(best.p.toFixed(3));
                Lab3.getTour(best.t);

                Lab3.findBestWay(limit, ++i, pc, pm, speed, drawerId, funcId, population, N);
            });
        }, speed);
    }

    static getAveragePrice(tours) {
        var sum = 0;
        for (var i = 0; i < tours.length; i++) {
            sum += tours[i].p;
        }

        return sum / tours.length;
    }

    static getBestPrice(tours) {
        tours.sort(function(a, b) {
            return a.p - b.p;
        });

        return tours[0];
    }

    static getNextGeneration(population, pc, pm, N) {
        var o = [];
        for (var i = 0; i < population.length; i++) {
            o.push({
                p: population[i].p,
                t: population[i].t,
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
                t: parents[i].t,
                p: parents[i].p
            });
        }
        for (var i = 0; i < childrens.length; i++) {
            total.push({
                t: childrens[i],
                p: this._fitnessFunction(childrens[i])
            });
        }
        for (var i = 0; i < mutants.length; i++) {
            total.push({
                t: mutants[i],
                p: this._fitnessFunction(mutants[i])
            });
        }
        total.sort(function(a, b) {
            return a.p - b.p;
        });

        population = [];
        population.push({
            t: total[0].t,
            p: total[0].p
        });
        for (var i = 1; i < total.length && i < N; i++) {
            if (!this.equals(total[i-1], total[i])) {
                population.push({
                    t: total[i].t,
                    p: total[i].p
                });
            }
        }

        return population;
    }

    static reproduction(chromosomes) {
        var probabilities = [];
        chromosomes.sort(function(a, b) {
            return a.p - b.p;
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
                if (p - Math.random() < 0) continue;
                var ind = 0;
                do {
                    ind = Math.floor(Math.random() * N);
                } while (ind == i);
                var child1 = [];
                var child2 = [];
                var p1 = parents[i].t;
                var p2 = parents[ind].t;
                for (var k = 0; k < p1.length; k++) {
                    child1.push(0);
                    child2.push(0);
                }
                var stop = false;
                var pointer = 0;
                do {
                    child1[pointer] = p1[pointer];
                    child2[pointer] = p2[pointer];
                    if (child1.includes(p2[pointer])) {
                        stop = true;
                        for (var k = 0; k < child1.length; k++) {
                            if (child1[k] != 0) continue;
                            child1[k] = p2[k];
                            child2[k] = p1[k];
                        }
                    }
                    pointer = p1.indexOf(p2[pointer]);
                } while (!stop);

                childrens.push(child1);
                childrens.push(child2);
            }
        }

        return childrens;
    }

    static mutation(a, p) {
        if (p - Math.random() >= 0) {
            var mutant = [];
            for (var i = 0; i < a.length; i++) {
                mutant.push(a[i]);
            }
            var i = Math.floor(Math.random() * a.length);
            var ind = 0;
            do {
                ind = Math.floor(Math.random() * a.length);
            } while (ind == i);
            var tmp = mutant[i];
            mutant[i] = mutant[ind];
            mutant[ind] = tmp;

            return mutant;
        }

        return null;
    }

    static equals(a, b) {
        for (var i = 0; i < a.t.length; i++) {
            if (a.t[i] != b.t[i]) {
                return false;
            }
        }

        if (a.p - b.p != 0) {
            return false;
        }

        return true;
    }
}

Lab3.cities = {
    n: [],
    x: [],
    y: []
};