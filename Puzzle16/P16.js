// Puzzle available at https://adventofcode.com/2020/day/16
const fs = require('fs');
let fields, nearby, myTicket;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    [fields, myTicket, nearby] = data.toString().split("\n\n").map(lines => lines.split("\n"));
    myTicket = myTicket[1];
    nearby = nearby.slice(1)

} catch (e) {
    console.log('Error:', e.stack);
}

function getTicketValues(ticket) {
    return ticket.split(",").map(num => Number(num));
}
function getFieldRanges(fields) {
    const mapping = new Map();
    for (let field of fields) {
        const [name, ranges] = field.split(":");
        mapping.set(name.trim(), ranges.split("or").map(range => range.split("-").map(val => Number(val))));
    }
    return mapping;
}

function inRange(value, ...ranges) {
    for (let range of ranges) {
        if (range.some(r => value >= r[0] && value <= r[1])) return true;
    }
    return false;
}

function findErrRate(fields, nearby) {
    const dataRanges = Array.from(getFieldRanges(fields).values());
    return nearby.reduce((err, ticket) => {
        return err + getTicketValues(ticket).reduce((acc, val) => {
            return inRange(val, ...dataRanges) ? acc : acc + val;
        }, 0);
    }, 0);
}

function isValid(ticketValues, fieldMap) {
    const dataRanges = Array.from(fieldMap.values());
    for (let num of ticketValues) {
        if (!inRange(num, ...dataRanges)) return false;
    }
    return true;
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function getPossibleFieldSet(ticket, fieldMap) {
    return ticket.reduce((f, num) => {
        let t = new Set();
        for (let name of fieldMap.keys()) {
            if (inRange(num, fieldMap.get(name))) t.add(name);
        }
        return f.concat(t);
    }, []);
}

function decodeFieldsPositions(fieldMap, tickets) {
    const validTkts = tickets.map(tkt => getTicketValues(tkt)).filter(ticket => isValid(ticket, fieldMap));
    let possibleFields = validTkts.reduce((acc, ticket) => {
        let curr = getPossibleFieldSet(ticket, fieldMap);
        return curr.map((param, idx) => {
            return {
                fields: acc[idx] ? intersection(acc[idx].fields, param) : param,
                pos: idx
            }
        })
    }, []);
    possibleFields.sort((a, b) => b.fields.size - a.fields.size);

    let decoded = possibleFields
        .map((obj, idx) => {
            const other = possibleFields.slice(idx);
            return other.reduce((curr, next) => {
                return {
                    fields: difference(curr.fields, next.fields),
                    pos: obj.pos
                }
            })
        })
    decoded.sort((a, b) => a.pos - b.pos);
    return decoded.map(elem => Array.from(elem.fields)[0]);
}

const findMul = (decodedPos, ticket) => {
    return decodedPos.reduce((mul, f, idx) => {
                if (/^departure/.test(f)) return mul * ticket[idx]; 
                return mul;
            }, 1);
}

console.log(findErrRate(fields, nearby)); // part 1
console.log(findMul(decodeFieldsPositions(getFieldRanges(fields), nearby), getTicketValues(myTicket))); // part 2

