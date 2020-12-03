// Puzzle available at https://adventofcode.com/2020/day/2

const fs = require('fs');
let input;
try {
    const data = fs.readFileSync('input.txt', 'utf8');
    input = data.toString().split("\n");
} catch (e) {
    console.log('Error:', e.stack);
}

// get parameters for each row
const rows = input.map(row => {
    [lower, upper, char, pass] = row.split(/-|:\s|\s/);
    return { lower, upper, char, pass };
})

function countCorrect(rows, isValid) {
    return rows.reduce((acc, row) => {
        if (isValid(row)) return acc + 1;
        return acc;
    }, 0)
}

const validOld = ({ lower, upper, char, pass }) => {
    const matches = pass.match(new RegExp(char, "g")); // get matches
    // check if number of matches is within bounds
    return matches && matches.length <= upper && matches.length >= lower;
};

const validNew = ({ lower, upper, char, pass }) => {
    // Xor returns true if only one of them is true
    return pass[lower - 1] == char ^ pass[upper - 1] == char
}

console.log(countCorrect(rows, validOld)); // part1
console.log(countCorrect(rows, validNew)); // part2