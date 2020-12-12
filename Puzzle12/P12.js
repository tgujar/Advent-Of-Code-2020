// Puzzle available at https://adventofcode.com/2020/day/12

const fs = require('fs');
const ComplexNumber = require('./complex-numbers') // I had this made alread :)
let moves;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    moves = data
            .toString()
            .split("\n")
            .map(str => {
                return {comm: str[0], units: Number(str.slice(1))}
            });
} catch (e) {
    console.log('Error:', e.stack);
}

class CompassVect extends ComplexNumber {
    constructor(north = 0, east = 0, south = 0, west = 0) {
        super(east - west, north - south);
    }
    get east() {
        return this.real;
    } 
    get north() {
        return this.imag;
    }
    turn(dir, deg) {
        if (deg % 90 !== 0) throw new Error("turns can only be a multiple of 90");
        let rot = deg % 360;
        if (rot === 0) return new CompassVect(this.north, this.east);
        if (dir === "L") {
            let i = new CompassVect(1, 0);
            return this.mul(i).turn(dir, deg - 90);     
        } else {
            let negi = new CompassVect(-1, 0);
            return this.mul(negi).turn(dir, deg - 90);
        }
        
    }
    mul(compassVect) {
        let c = super.mul(compassVect);
        return new CompassVect(c.imag, c.real);
    }
    add(compassVect) {
        let c = super.add(compassVect);
        return new CompassVect(c.imag, c.real);
    }
    extend(mag) {
        return new CompassVect(this.north * mag, this.east * mag)
    }
    get manhattanDist() {
        return Math.abs(this.north) + Math.abs(this.east);
    }
}

function followMoves(moves, facing) {
    let ship = new CompassVect();
    let dir = new CompassVect(facing.north, facing.east);
    const shipActions = {
        N: (ship, units) => ship.add(new CompassVect(units)),
        E: (ship, units) => ship.add(new CompassVect(0, units)),
        W: (ship, units) => ship.add(new CompassVect(0,0,0, units)),
        S: (ship, units) => ship.add(new CompassVect(0,0, units)),
        F: (ship, units) => ship.add(dir.extend(units)) 
    }
    for (let move of moves) {
        if (move.comm === "L" || move.comm === "R") {
            dir = dir.turn(move.comm, move.units);
        } else {
            ship = shipActions[move.comm](ship, move.units);
        }
    }
    return ship;
}

function followWaypoint(moves, waypoint) {
    let ship = new CompassVect();
    const wpActions = {
        N: (wp, units) => wp.add(new CompassVect(units)),
        E: (wp, units) => wp.add(new CompassVect(0, units)),
        W: (wp, units) => wp.add(new CompassVect(0,0,0, units)),
        S: (wp, units) => wp.add(new CompassVect(0,0, units)),
        L: (wp, units) => wp.turn("L", units),
        R: (wp, units) => wp.turn("R", units)
    }
    for (let move of moves) {
        if (move.comm === "F") {
            ship = ship.add(waypoint.extend(move.units))
        } else {
            waypoint = wpActions[move.comm](waypoint, move.units);
        }
    } 
    return ship;
} 

const facing = new CompassVect(0,1,0,0);
const startWP = new CompassVect(1, 10);
console.log(followMoves(moves, facing).manhattanDist);
console.log(followWaypoint(moves, startWP).manhattanDist);
