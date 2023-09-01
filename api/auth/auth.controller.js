const jose = require("jose");
const { ALG } = process.env;

// Authentication
// Token Generation
async function generateToken(req, res, next) {
    const account = {
        account_id: res.locals.account_id,
        account_username: res.locals.account_username,
    };

    const edPrivateKey = await jose.importJWK(global.privateJwk);
    const keyId = 0;
    const alg = ALG;
    const jwt = await new jose.SignJWT(account)
        .setProtectedHeader({ alg, key: `${keyId}` })
        .setIssuedAt()
        .setIssuer(`${req.originalUrl}`)
        .setAudience(`${res.locals.account_id}`)
        .setExpirationTime("1h")
        .sign(edPrivateKey);
    res.status(204).json({ jwt: jwt });
}

// Token Verification
async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const jwt = authHeader && authHeader.split(" ")[1];
    if (jwt == null)
        return next({ status: 401, message: "CREDENTIALS INVALID" });

    const edPublicKey = keyIdentifier(jwt);
    try {
        const { payload, protectedHeader } = await jose.jwtVerify(
            `${jwt}`,
            edPublicKey
        );
        console.log("header: ", protectedHeader);
        console.log("payload: ", payload);
        next();
    } catch (err) {
        next({
            status: 500,
            message: `${err}`,
        });
    }
}

// Claims to Key Validation
async function keyIdentifier(token) {
    const claims = jose.decodeJwt(token);
    const keyId = claims.keyId ? claims.keyId : "None";
    let key;
    switch (keyId) {
        case "1":
            key = await jose.importJWK(global.data.publicJwk_1);
            return key;
        case "2":
            key = await jose.importJWK(global.data.publicJwk_2);
            return key;
        default:
            break;
    }
}

module.exports = {
    generateToken,
    authenticateToken,
};
