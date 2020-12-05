// Puzzle available at https://adventofcode.com/2020/day/5

const fs = require('fs');
let seats;

try {  
    const data = fs.readFileSync('input.txt', 'utf8');
    seats = data.toString().split("\n");    
} catch(e) {
    console.log('Error:', e.stack);
}

function binaryMove(arr, chooseUpper) {
    return arr.reverse().reduce((acc, step, idx) => {
        if (chooseUpper(step)) return acc + 2**idx; // choose upper branch
        return acc; // choose lower branch
    }, 0);
}

function findSeat(seat) {
    const row = binaryMove(seat.slice(0, 7).split(""), (step) => step === "B");
    const col = binaryMove(seat.slice(7).split(""), (step) => step === "R");
    return [row, col];
}

function getId(row, col) {
    return row * 8 + col;
}

function findMySeat(seatIds) {
    const min = Math.min(...seatIds);
    const max = Math.max(...seatIds);
    for (let i = min; i <= max; i++) {
        if (!seatIds.includes(i)) return i;
    }
}

const seatIds = seats
                    .map(seat => findSeat(seat))
                    .map(([row, col]) => getId(row, col));

console.log(Math.max(...seatIds)); // part 1
console.log(findMySeat(seatIds)); // part 2