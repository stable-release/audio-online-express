const argon2 = require("argon2");
const { ARGON_SECRET, ARGON_TIME, ARGON_MEM, ARGON_PAR } = process.env;

async function generateHash(seed) {
    try {
        seed = `${seed}`;
        const hash = await argon2.hash(seed, {
            timeCost: ARGON_TIME,
            memoryCost: ARGON_MEM,
            parallelism: ARGON_PAR,
            type: argon2.argon2i,
            secret: Buffer.from(`${ARGON_SECRET}`),
        });
        return hash;
    } catch (err) {
        console.err(err);
    }
}

async function verifyHash(hash, seed) {
    try {
        hash = `${hash}`;
        seed = `${seed}`;
        const verified = await argon2.verify(hash, seed, {
            timeCost: ARGON_TIME,
            memoryCost: ARGON_MEM,
            parallelism: ARGON_PAR,
            type: argon2.argon2i,
            secret: Buffer.from(`${ARGON_SECRET}`),
        });
        return verified;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    hash: {
        generateHash,
        verifyHash,
    },
};
