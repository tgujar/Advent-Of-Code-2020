// Puzzle available at https://adventofcode.com/2020/day/1

const fs = require('fs');
let entries;
try {  
    let data = fs.readFileSync('input.txt', 'utf8');
    entries = data.toString().split("\n").map(entry => Number(entry));    
} catch(e) {
    console.log('Error:', e.stack);
}

// assuming entries are unique
function findParts(entries, sum, splits) {
    let part;
    // if only one number is needed, find it in the array
    if (splits === 1) return entries.includes(sum) ? [sum] : null;

    for (let entry of entries) {
        if (part = findParts(entries.filter(e => e !== entry), sum - entry, splits - 1)) {
            // select an entry and find other parts which complete the sum
            return [entry, ...part]
        }
    }
}

console.log(findParts(entries, 2020, 2));
console.log(findParts(entries, 2020, 3));
