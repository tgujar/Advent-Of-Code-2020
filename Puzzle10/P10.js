const fs = require('fs');
let adapters;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    adapters = data.toString().split("\n").map(entry => Number(entry));
} catch (e) {
    console.log('Error:', e.stack);
}

const deviceJoltage = Math.max(...adapters) + 3;

// counts the number of occurances of elem in arr
const countElem = (arr, elem) => arr.filter(i => i === elem).length;

//returns the jolatge differences
function getJoltageDiffs(adapters) {
    const diff = adapters
        .sort((a, b) => a - b) // we want to go from minimum to maximum joltage
        .map((adp, idx) => {
            return adapters[idx + 1] - adp; // map to differences
        });
    return diff.slice(0, diff.length - 1); // remove the last value, which is NaN
}

// referenced from http://tiny.cc/pim6tz, changed my solution because this was much more elegant
function countCombos(adapters) {
    let mem = new Map().set("0", 1);
    adapters.sort((a,b) => a - b);
    adapters.push(adapters[adapters.length - 1] + 3);
    for (let a of adapters) {
        mem.set(String(a), (mem.get(String(a-1)) || 0) + 
                        (mem.get(String(a-2)) || 0) + 
                        (mem.get(String(a-3)) || 0));
    }
    return mem.get(String(adapters[adapters.length - 1]));
}

const diffs = getJoltageDiffs(adapters.concat(0, deviceJoltage));

console.log((countElem(diffs, 3)) * countElem(diffs, 1)); // part 1
console.log(countCombos(adapters)); // part 2
