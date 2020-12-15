// Puzzle available at https://adventofcode.com/2020/day/13
const fs = require('fs');
let arrival, buses;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    [arrival, buses] = data.toString().split("\n");
    arrival = Number(arrival);
    buses = buses.split(",").map((id, idx) => {
        return {id: Number(id), offset: idx}
    }).filter(elem => !isNaN(elem.id));

} catch (e) {
    console.log('Error:', e.stack);
}

function findBusWait(arrival, buses) {
    let busWait = buses
                .map(({id}) => {
                    let r = arrival % id;
                    if (r) return {id: id, wait: id - r};
                    return {id: id, wait: 0};
                })
                .reduce((leastWait, rem) => {
                    if (rem.wait < leastWait.wait) return rem;
                    return leastWait;
                });
    return busWait;
}

function mulInv(a, b) {
    let b0 = b;             // Apply extended Euclid Algorithm        
    let x0 = 0; let x1 = 1;
    if (b === 1) return 1;
    while (a > 1) {
        let q = Math.floor(a / b);
        [x0, x1] = [x1 - q * x0, x0];
        [a, b] = [b, a % b];
    }
    if (x1 < 0) return x1 + b0;
    return x1;
}

// Uses Chinese Remainder theorem
// Reference: https://rosettacode.org/wiki/Chinese_remainder_theorem
function CRT(n, a) {
    const prod = n.reduce((a, b) => a * b);
    let sum = 0n;
    for (let i = 0; i < n.length; i++) {
        let partialProd = prod / n[i];
        sum += BigInt(partialProd) * BigInt(mulInv(partialProd, n[i])) * BigInt(a[i]);
    }
    return sum % BigInt(prod);
}

function findTimestamp(buses) {
    const ids = buses.map(({id}) => id);
    const offsets = buses.map(({offset}) => offset);
    const maxOffset = Math.max(...offsets);
    /*
    We need to map to maxOffset - offsets[i] since CRT will give us a value, which has
    remainders as given in the second argument. For e.g if the remainder is a for some n and CRT gives us 
    y, then (y - a) % n = 0. But, here we want the case (y + a) % n = 0, hence the described calculation.

    We then subtract maxOffset as from CRT we get a value which is perfectly divisible by the last id and we want 
    it to be perfectly divisible by the first.
    */
    return CRT(ids, offsets.map(o => maxOffset - o)) - BigInt(maxOffset);
}


let leastBusWait = findBusWait(arrival, buses);
console.log(leastBusWait.id * leastBusWait.wait); // part 1
console.log(findTimestamp(buses)); // part 2