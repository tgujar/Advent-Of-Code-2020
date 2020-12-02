const fs = require('fs');
try {  
    let data = fs.readFileSync('input.txt', 'utf8');
    entries = data.toString().split("\n").map(entry => Number(entry));    
} catch(e) {
    console.log('Error:', e.stack);
}

function findParts(entries, sum, splits) {
    let part;
    if (splits === 1) return entries.includes(sum) ? [sum] : null;
    for (let entry of entries) {
        if (part = findParts(entries, sum - entry, splits - 1)) {
            return [entry, ...part]
        }
    }
}

console.log(findParts(entries, 2020, 2));
console.log(findParts(entries, 2020, 3));