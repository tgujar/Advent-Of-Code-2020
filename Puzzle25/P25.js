const doorKey = 11239946;
const cardKey = 10464955;
const subject = 7;
const div = 20201227;

function powModN(num, power, n) {
    let temp = 1;
    for (let i = 1; i <= power; i++) {
        temp = (temp*num) % n;
    }
    return temp;
}

function findLoops(key, subject) {
    let loops = 0;
    let temp = 1;
    while(temp !== key) {
        temp = (temp*subject) % div;
        console.log(temp);
        loops++;
    } 
    return loops;
} 

console.log(powModN(cardKey,findLoops(doorKey, subject), div));