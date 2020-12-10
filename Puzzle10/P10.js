const fs = require('fs');
let adapters;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    adapters = data.toString().split("\n").map(entry => Number(entry));
} catch (e) {
    console.log('Error:', e.stack);
}

const allowedJTGDiffs = [1, 2, 3]; // joltage differences allowed
const deviceJoltage = Math.max(...adapters) + 3;

// calculates factorial
function fact(n) {
    if (n === 0) return 1
    return n * fact(n - 1);
}

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

// count number of ways in which the "total" can be expresses as a sum of "allowed"
function countChange(totalJTG, allowed, JTGs = []) {
    const sum = JTGs.reduce((a, b) => a + b, 0);
    if (sum === totalJTG) { // sum of JTGs is same as that required
        /* find number of combinations of the JTGs, i.e if JTGs = [1,2,1,3],
        then combinations of this is also equal to sum */
        return countCombinations(JTGs);  
    } else if (sum > totalJTG || allowed.length === 0) {
        return 0;
    } else {
        return countChange(totalJTG, allowed, JTGs.concat(allowed[0])) // add value to JTGs, and rerun
            + countChange(totalJTG, allowed.slice(1), JTGs); // count combination of totalJTG expressed as subset of allowed
    }
}

// count the number of ways an array can be rearranged to get a new array
function countCombinations(arr) {
    const unique = new Set(arr); // get unique entries in arr
    const nCr = (n, r) => fact(n) / (fact(n - r) * fact(r)); // n!/(n-r)!r!
    let combinations = 1;
    let counted = 0;

    // if arr = [1,2,3,3,5,5,5] then calculate 7C3*4C2*2P1*1P1
    for (let num of unique) {
        let occurances = arr.filter(elem => elem === num).length;
        combinations *= nCr(arr.length - counted, occurances);
        counted += occurances;
    }
    return combinations;
}

function countJTGCombinations(JTGDiffs) {
    return JTGDiffs
            .join("")
            // split into consecutive numbers, e.g "111331" will become ["111", "33", "1"]
            .match(new RegExp(allowedJTGDiffs.map(elem => `${elem}+`).join("|"), "g")) 
            .reduce((acc, patt) => {
                let q = Number(patt[0]); // get the number in the sequence
                /*
                The number can only be replaced by a higher number since we cant add more adapters,
                We are essentially counting the number of ways the total value i.e patt.length * q
                can be split up as sum of allowedJTGDiffs greater than or equal the number in the sequence.
                Then we multiply it with previous calculated combinations (acc)
                */
                return acc * countChange(patt.length * q, allowedJTGDiffs.filter(e => e >= q));
            }, 1)
}

const diffs = getJoltageDiffs(adapters.concat(0, deviceJoltage));

console.log((countElem(diffs, 3)) * countElem(diffs, 1)); // part 1
console.log(countJTGCombinations(diffs)); // part 2
