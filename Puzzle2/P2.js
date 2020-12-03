// Puzzle available at https://adventofcode.com/2020/day/2

const fs = require('fs');
let input;
try {  
    const data = fs.readFileSync('input.txt', 'utf8');
    input = data.toString().split("\n");    
} catch(e) {
    console.log('Error:', e.stack);
}

// get parameters for each row
const rows = input.map(row => {
    [lower, upper, char, pass] = row.split(/-|:\s|\s/);
    return {lower, upper, char, pass};
})

const validOld = rows.reduce((acc,row) => {
    const matches = row.pass.match(new RegExp(row.char, "g")); // get matches
    // check if number of matches is within bounds
    if (matches && matches.length <= row.upper && matches.length >= row.lower) return acc + 1;
    return acc;
}, 0);

const validNew = rows.reduce((acc,{upper, lower, char, pass}) => {
    // Xor returns true if only one of them is true
    if (pass[lower - 1] == char ^ pass[upper - 1] == char) return acc + 1;
    return acc;
}, 0);

console.log(validOld); // part1
console.log(validNew); // part2