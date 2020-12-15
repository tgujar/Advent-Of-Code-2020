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

function findNth(num, startSeq) {
    const store = new Map(startSeq.map((digit, idx) => {
        return [digit, {latest: idx, prev: idx}]
    }));
    let last = startSeq[startSeq.length - 1];
    for (let i = startSeq.length; i < num; i++) {
        const positions = store.get(last);
        last = positions.latest - positions.prev;
        if (store.has(last)) {
            store.set(last, {latest: i, prev: store.get(last).latest});
        } else {
            store.set(last, {latest: i, prev: i});
        }
    }
    return Array.from(store.keys()).find(key => store.get(key).latest === num - 1);
}

console.log(findNth(2020, startSeq)); // part 1
console.log(findNth(30000000, startSeq)); // part 2
