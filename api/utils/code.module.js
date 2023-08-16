require("dotenv").config();
const { CODE_LENGTH } = process.env;
const { random } = require("@lukeed/csprng");

function generateCode() {
    let sum = "";
    const array = random( Number(CODE_LENGTH) );
    array.forEach((value, index) => {
        value = Number(value);
        let number = parseInt(value / 10 ** (value.toString().length - 1));
        sum += number.toString();
    });

    return sum;
}

module.exports = {
    generateCode,
};