// Puzzle available at https://adventofcode.com/2020/day/3

const fs = require('fs');
let input;
const slopes = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 5, y: 1},
    {x: 7, y: 1},
    {x: 1, y: 2}
]

try {  
    const data = fs.readFileSync('input.txt', 'utf8');
    input = data.toString().split("\n");    
} catch(e) {
    console.log('Error:', e.stack);
}

function countTrees(input, slope) {
    let pos = -slope.x; // initialize position
    return input.reduce((trees, row, idx) => {
        if (idx % slope.y === 0) {
            // if Toboggan goes to this row
            pos = pos + slope.x; // update position
            if (row[pos % row.length] === "#") return trees + 1;
        }
        return trees;
    }, 0);
}

console.log(countTrees(input, {x:3,y:1})); // part1
console.log(slopes.reduce((mul, slope) => countTrees(input, slope) * mul, 1)); // part2