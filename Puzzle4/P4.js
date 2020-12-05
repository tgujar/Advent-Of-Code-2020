// Puzzle available at https://adventofcode.com/2020/day/4

const fs = require('fs');
let passports;

try {
    const data = fs.readFileSync('input.txt', 'utf8');
    passports = data.toString() // get data as string
        .split(/\n{2}/) // get seperate passport data
        // map to an object
        .map(data => { 
            return data.split(/\n|\s/) // get seperate fields
                // combine fields in an object 
                .reduce((passport, field) => {
                    let [name, value] = field.split(":");
                    return { ...passport, [name]: value };
                }, {});
        });
} catch (e) {
    console.log('Error:', e.stack);
}

function countValid(passports, isValid) {
    return passports.reduce((total, passport) => isValid(passport) ? total + 1: total, 0);
}

const isPassportValidOld = (passport) => {
    let fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
    for (let field of fields) {
        if (!passport.hasOwnProperty(field)) return false;
    }
    return true;
};

const isPassportValidNew = (passport) => {
    let fields = [
        {
            name: 'byr',
            isValid: (value) => Number(value) >=1920 && Number(value) <= 2002
        },
        {
            name: 'iyr',
            isValid: (value) => Number(value) >=2010 && Number(value) <= 2020
        },
        {
            name: 'eyr',
            isValid: (value) => Number(value) >=2020 && Number(value) <= 2030
        },
        {
            name: 'hgt',
            isValid: (value) => {
                const scale = value.slice(value.length - 2);
                if (scale !== "cm" && scale !== "in") return false;
                return scale == "cm" ? 
                parseInt(value) >= 150 && parseInt(value) <= 193 : 
                parseInt(value) >= 59 && parseInt(value) <= 76;
            }
        },
        {
            name: 'hcl',
            isValid: (value) => /^#[0-9a-f]{6}$/.test(value)
        },
        {
            name: 'ecl',
            isValid: (value) => ['amb','blu','brn','gry','grn','hzl','oth'].includes(value)
        },
        {
            name: 'pid',
            isValid: (value) => /^[0-9]{9}$/.test(value)
        }
    ];
    for (let field of fields) {
        if (!(passport.hasOwnProperty(field.name) && field.isValid(passport[field.name])))
            // if passport doesnt have property or field is invalid, return false
            return false;
    }
    return true;
};

console.log(countValid(passports, isPassportValidOld)); //part 1
console.log(countValid(passports, isPassportValidNew)); //part 2