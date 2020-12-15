// Puzzle available at https://adventofcode.com/2020/day/15
const fs = require('fs');
let startSeq;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
     startSeq = data
                    .toString()
                    .split(",")
                    .map(digit => Number(digit))

} catch (e) {
    console.log('Error:', e.stack);
}

// This finds the Van Eck's sequence https://oeis.org/A181391
function findNth(num, startSeq) {
    const store = new Map(startSeq.map((digit, idx) => {
        return [digit, idx]
    }));
    let last = startSeq[startSeq.length - 1];
    // calculate next terms till num - 2, 
    for (let i = startSeq.length - 1; i < num - 1; i++) {
        const next = i - store.get(last) || 0; // calculate the next term
        store.set(last, i); // store the last seen(i) at key {last}
        last = next;
    }
    return last;  // last conatins the (num - 1) term, since indexes start at 0, this is ans 
}

console.log(findNth(2020, startSeq)); // part 1
console.log(findNth(30000000, startSeq)); // part 2