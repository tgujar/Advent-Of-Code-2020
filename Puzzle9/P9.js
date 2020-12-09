// Puzzle available at https://adventofcode.com/2020/day/9

const fs = require('fs');
let code;

try {
    code = fs
            .readFileSync("input.txt")
            .toString()
            .split("\n")
            .map(elem => Number(elem));
} catch(e) {
    console.log("Error:", e.stack);
}

function findInvalidIndex(code, preambleLen) {
    for (let i = preambleLen; i < code.length; i++) {
        const target = code.slice(i-preambleLen, i); // get target slice
        if (!target.some(elem => target.includes(code[i] - elem))) {
            // find if current element is a sum of any two elems in target
            return i // return index of invalid element
        }
    }
}

function contiguousSumArray(codeIdx, code) {
    for (let i = 0; i < code.length; i++) {
        let sum = 0;
        for (let j = i; sum < code[codeIdx]; j++) {
            sum += code[j];
            if (sum === code[codeIdx]) {
                return code.slice(i, j + 1);
            }
        }
    }
}

const encWeakness = (csum) => {
    // return the sum of max and min in contiguous sum
    return Math.min(...csum) + Math.max(...csum);
}

const invalidIndex = findInvalidIndex(code, 25);
console.log(code[invalidIndex]); // part 1
console.log(encWeakness(contiguousSumArray(invalidIndex, code))); // part 2