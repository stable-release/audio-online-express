const jose = require("jose");

async function keyGen() {
    const { publicKey, privateKey } = await jose.generateKeyPair("EdDSA");
    const publicJwk = await jose.exportJWK(publicKey);
    const privateJwk = await jose.exportJWK(privateKey);
    const now = new Date();
    console.log(now.getMinutes());
    // check for global.time
    if (now.getMinutes() > 29) {
        global.data = {
            publicJwk_1: publicJwk,
            privateJwk_1: privateKey,
        }
    } else {
        global.data = {
            publicJwk_2: publicJwk,
            privateJwk_2: privateJwk,
        }
    }
    console.log(global.data.publicJwk_2)
}

module.exports = {
    keyGen
}
