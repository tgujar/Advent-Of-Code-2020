// Puzzle available at https://adventofcode.com/2020/day/17

const fs = require('fs');
let slice;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    slice = data.toString().split("\n").map(row => row.split(""));
} catch (e) {
    console.log('Error:', e.stack);
}

class Dimension {
    constructor(dimLengths, defaultFill = 0) { // lengths starting with the innermost dimension
        if (dimLengths.some(len => len <= 0 || len !== Math.floor(len))) {
            throw new Error("Dimension lengths have to be positive integers");
        }
        this.store = new Array(dimLengths.reduce((a, b) => a * b, 1)).fill(defaultFill);
        this.lens = [...dimLengths];
        this.multipliers = this.lens.map((_, idx) => this.lens.slice(0, idx).reduce((a, b) => a * b, 1));
        this.defaultFill = defaultFill;
    }
    get Dims() {
        return this.lens.length;
    }
    getElemIdx(posInDim) { // dim index starting from innermost dimension
        let idx = 0;
        for (let i = 0; i < posInDim.length; i++) {
            if (posInDim[i] > this.lens[i]) {
                throw new Error(`Position ${posInDim[i]} greater than dimesion length ${this.lens[i]}`);
            }
            else {
                idx += this.multipliers[i] * posInDim[i]
            }
        }
        return idx;
    }
    addElem(posInDim, elem) { //posInDim is an array consisting of positions in dimensions starting from innermost
        this.store[this.getElemIdx(posInDim)] = elem;
    }
    replaceElem(posInDim, replaceWith = this.defaultFill) {
        this.store[this.getElemIdx(elem, ...posInDim)] = replaceWith;
    }
    adjacentKernel(...posInDim) { // position in Dimension, index starting from innermost dimension
        if (posInDim.length !== this.lens.length) {
            throw new Error("Specifiy all coordinated of the element");
        }
        const slicer = (store, dimIdx) => {
            if (dimIdx < 0) return store;
            const min = posInDim[dimIdx] === 0 ? posInDim[dimIdx] : posInDim[dimIdx] - 1;
            const max = posInDim[dimIdx] === this.lens[dimIdx] - 1 ? posInDim[dimIdx] : posInDim[dimIdx] + 1;
            let slice = [];
            for (let idx = min; idx <= max; idx++) {
                slice.push(store.slice(idx * this.multipliers[dimIdx], (idx + 1) * this.multipliers[dimIdx]));
            }
            return slice.reduce((elems, s) => elems.concat(slicer(s, dimIdx - 1)), []);
        }
        return slicer(this.store, posInDim.length - 1);
    }

}

class PocketDim extends Dimension {
    constructor(slice, dimensions, active = "#", inactive = ".") {
        super([slice[0].length, slice.length, ...new Array(dimensions - 2).fill(1)], inactive);
        slice.forEach((row, r) => {
            row.forEach((col, c) => this.addElem([c, r], col))
        });
        this.active = active;
    }
    addLayer(num) {
        if (num === 0) return;
        const layerAdder = (dim) => {
            if (dim > this.Dims - 1) return;
            let newStore = [];
            const offset = this.multipliers[dim + 1] || this.store.length - 1;
            const layer = new Array(this.multipliers[dim]).fill(this.defaultFill);
            for (let i = 0; i < this.store.length; i += offset) {
                    newStore.push(
                        ...layer.concat(this.store.slice(i, i + offset), [...layer])
                        );
                }
            this.store = newStore;
            this.lens[dim] += 2;
            this.multipliers = this.lens.map((_, idx) => this.lens.slice(0, idx).reduce((a, b) => a * b, 1));
            return layerAdder(dim + 1);
        }
        layerAdder(0);
        return this.addLayer(num - 1);
    }
    getStats(kernel) {
        if (!kernel) kernel = this.store;
        const actives = kernel.filter(e => e === this.active).length;
        return { actives, inactives: this.store.length - actives };
    }
    iterate(num) {
        if (num === 0) return this;
        this.addLayer(1);
        let newStore = [];
        for (let i = 0; i < this.store.length; i++) {
            let rem = i;
            let indices = new Array(this.Dims).fill(null).map((_, idx) => {
                const q = rem / this.multipliers[this.Dims - idx - 1];
                rem = rem % this.multipliers[this.Dims - idx - 1];
                return Math.floor(q);
            }).reverse();
            const k = this.adjacentKernel(...indices);
            const { actives } = this.getStats(k);
            let cubeIsActive = this.store[i] === this.active;
            if (cubeIsActive && (actives === 3 || actives === 4)) {
                newStore.push(this.active);
            } else if (cubeIsActive) {
                newStore.push(this.inactive);
            } else if (!cubeIsActive && actives === 3) {
                newStore.push(this.active);
            } else {
                newStore.push(this.inactive);
            }
        }
        this.store = newStore;
        return this.iterate(num - 1);
    }
}

/* The solutions runs much slower than the code I originally submitted, maybe using Flat Arrays wasnt the best idea.
Maybe it can be made faster by using Maps instead, since it will cut down on the calculation for indices.
This solution is in some sense better as the number of dimensions can easily be extended.
*/

console.log(new PocketDim(slice, 3).iterate(6).getStats()); // part 1
console.log(new PocketDim(slice, 4).iterate(6).getStats()); // part 2
