// Puzzle available at https://adventofcode.com/2020/day/11

const fs = require('fs');
let seats;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    seats = data.toString();
} catch (e) {
    console.log('Error:', e.stack);
}

class GameOfSeats {
    constructor(seats, getKernel, occupy, leave) {
        this.seats = seats;
        this.getKernel = getKernel;
        this.occupy = occupy;
        this.leave = leave;
    }
    get rowLength() {
        return this.seats[0].length;
    }
    get colLength() {
        return this.seats.length
    }
    get occupied() {
        // Number of occupied seats
        return this.seats.reduce((acc, row) => {
            return acc + row.reduce((count, col) => col === "#" ? count + 1 : count, 0);
        }, 0);
    }
    static fromString(str, kernel, occupy, leave) {
        return new GameOfSeats(
            str.trim().split("\n").map(row => row.split("")),
            kernel,
            occupy,
            leave);
    }
    iterate() {
        let next = "";
        for (let row = 0; row < this.colLength; row++) {
            for (let col = 0; col < this.rowLength; col++) {
                let kernel = this.getKernel(this.seats, row, col);
                if (this.seats[row][col] === "L" && this.occupy(kernel)) {
                    next += "#";
                } else if (this.seats[row][col] === "#" && this.leave(kernel)) {
                    next += "L";
                } else {
                    next += this.seats[row][col];
                }
            }
            next += "\n";
        }
        return GameOfSeats.fromString(next, this.getKernel, this.occupy, this.leave);
    }
    isStable(next) {
        // if seats dont change from one iteration to other, its stable
        return JSON.stringify(this.seats) === JSON.stringify(next.seats);
    }
    getStable() {
        let next = this.iterate();
        if (this.isStable(next)) return next;
        else return next.getStable();
    }
}

// generates a function which dictates if the seat can be occupied, based on kernel
function genOccupy(maxOccupanices) {
    return (kernel) => kernel.reduce((acc, seat) => seat === "#" ? acc + 1 : acc, 0) <= maxOccupanices;
}

// generates a function which dictates if the seat will be left, based on kernel
function genLeave(minOccupancies) {
    return (kernel) => kernel.reduce((acc, seat) => {
        return seat === "#" ? acc + 1 : acc
    }, 0) > minOccupancies; // we dont use >= here, since the seat current seat gets counted in kernel
}

// find adjacent 8 pieces
function kernel(seats, row, col) {
    let minCol; let maxCol; let minRow; let maxRow;
    let rowLength = seats[0].length;
    let colLength = seats.length;
    minCol = col === 0 ? col : col - 1;
    minRow = row === 0 ? row : row - 1;
    maxCol = col === rowLength - 1 ? col : col + 1;
    maxRow = row === colLength - 1 ? row : row + 1;
    let kernel = [];
    for (let i = minRow; i <= maxRow; i++) {
        kernel.push(...seats[i].slice(minCol, maxCol + 1));
    }
    return kernel;
}

// find adjacent pieces which are not floor
function altKernel(seats, row, col) {
    let maxCol = seats[0].length - 1;
    let maxRow = seats.length - 1;
    const directions = {
        left: (r, c) => [r, c - 1],
        right: (r, c) => [r, c + 1],
        topleft: (r, c) => [r - 1, c - 1],
        topright: (r, c) => [r - 1, c + 1],
        btmleft: (r, c) => [r + 1, c - 1],
        btmright: (r, c) => [r + 1, c + 1],
        up: (r, c) => [r - 1, c],
        down: (r, c) => [r + 1, c],
    }
    function findSeat(r, c, f) {
        [r, c] = f(r, c);
        if (c > maxCol || r > maxRow || r < 0 || c < 0) return ".";
        return seats[r][c] === "." ? findSeat(r, c, f) : seats[r][c];
    }
    let kernel = [seats[row][col]];
    for (let func in directions) {
        kernel.push(findSeat(row, col, directions[func]));
    }
    return kernel;
}

let game1 = GameOfSeats.fromString(seats, kernel, genOccupy(0), genLeave(4)); // part 1
console.log(game1.getStable().occupied);

let game2 = GameOfSeats.fromString(seats, altKernel, genOccupy(0), genLeave(5)); // part 2
console.log(game2.getStable().occupied);
