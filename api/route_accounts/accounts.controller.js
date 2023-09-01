const accountsService = require("./accounts.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const { hash } = require("../utils/hash.module");
const { generateCode } = require("../utils/code.module");
const { sendCode } = require("../utils/email.module");
const { convertToUTC } = require("../utils/time.module");
const { generateToken } = require("../auth/auth.controller");

// Validation
const VALID_PROPERTIES = [
    "account_username",
    "account_email",
    "account_password",
    "verification_code",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length)
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
    next();
}

async function accountExists(req, res, next) {
    const { account_username, account_password } = req.body.data;
    const { account_id } = await accountsService.read(account_username);
    if (account_id) {
        res.locals.account_id = account_id;
        res.locals.account_username = account_username;
        res.locals.account_password = account_password;
        return next();
    }
    next({
        status: 401,
        message: `Invalid Username and/or Password`,
    });
}

async function isUniqueUsername(req, res, next) {
    const { data: { account_username } = {} } = req.body;
    const unique = await accountsService.read(account_username);
    if (!unique) {
        res.locals.account_username = account_username;
        return next();
    }
    next({
        status: 401,
        message: `Invalid Username`,
    });
}

async function isUniqueEmail(req, res, next) {
    const { data: { account_email } = {} } = req.body;
    const unique = await accountsService.readEmail(account_email);
    if (!unique) {
        res.locals.account_email = account_email;
        return next();
    }
    next({
        status: 401,
        message: "Email invalid",
    });
}

// Validate Account Details
async function generateNewHash(req, res, next) {
    const account_password = res.locals.account_password
        ? res.locals.account_password
        : req.body.data.account_password;
    const hashed = await hash.generateHash(account_password);
    if (hashed) {
        res.locals.account_password = hashed;
        return next();
    }
    next({
        status: 401,
        message: `Invalid Username and/or Password`,
    });
}

async function verifyHash(req, res, next) {
    const { data: password = {} } = await accountsService.read(
        res.locals.account_username
    );
    const verified = await hash.verifyHash(
        password,
        res.locals.account_password
    );
    if (verified) {
        return next();
    }
    next({
        status: 401,
        message: `Invalid Username and/or Password`,
    });
}

// Create New Account
async function createAccount(req, res, next) {
    const account = {
        account_username: res.locals.account_username,
        account_email: res.locals.account_email,
        password: res.locals.account_password,
    };
    const data = await accountsService.create(account);
    const response = {
        account_id: data.account_id,
        account_username: data.account_username,
        account_email: data.account_email,
    };
    res.status(201).json({ response });
}

async function newCode(req, res, next) {
    const code = generateCode();
    const data = {
        account_email: res.locals.account_email,
        code: code,
    };
    console.log(data);
    const account = await accountsService.createEmailCode(data);
    if (account) {
        sendCode(res.locals.account_email, "Authorization Code", code);
        console.log("code sent");
        return next();
    }
    next({
        status: 401,
        message: "Error",
    });
}

async function verifyCode(req, res, next) {
    const { data: { account_email, verification_code } = {} } = req.body;
    const { code, updated_at } = await accountsService.readEmailCode(
        account_email
    );
    const { futureTimestamp, currentTimestamp } = convertToUTC(updated_at, 300);
    if (!code) {
        return next({
            status: 402,
            message: "Missing entry",
        });
    }
    if (currentTimestamp > futureTimestamp) {
        return next({
            status: 401,
            message: "Code expired",
        });
    }
    if (code !== verification_code) {
        return next({
            status: 403,
            message: "Code invalid",
        });
    }
    const { account_username } = await accountsService.readEmail(account_email);
    const [{ verified }] = await accountsService.updateVerification(
        account_username
    );
    if (verified) {
        res.status(201).json({ data: "verified" });
    }
}

async function refreshEmailCode(req, res, next) {
    const { data: { account_email } = {} } = req.body;
    const newCode = generateCode();
    const entry = await accountsService.updateEmailCode(account_email, newCode);
    const code = entry[0].code;
    if (code === newCode) {
        sendCode(account_email, "Authorization Code", newCode);
        res.status(201);
    }
}

module.exports = {
    // New account call
    create: [
        hasProperties("account_username", "account_email", "account_password"),
        hasOnlyValidProperties,
        asyncErrorBoundary(isUniqueUsername),
        asyncErrorBoundary(isUniqueEmail),
        asyncErrorBoundary(generateNewHash),
        asyncErrorBoundary(newCode),
        asyncErrorBoundary(createAccount),
    ],
    // Login call
    read: [
        hasOnlyValidProperties,
        asyncErrorBoundary(accountExists),
        asyncErrorBoundary(verifyHash),
        asyncErrorBoundary(generateToken),
    ],
    // PUT call to verify code and change account to verified[True]
    updateVerification: [
        hasProperties("account_email", "verification_code"),
        hasOnlyValidProperties,
        asyncErrorBoundary(verifyCode),
    ],
    // PUT call to request new code
    updateRequestCode: [
        hasProperties("account_email"),
        hasOnlyValidProperties,
        asyncErrorBoundary(refreshEmailCode),
    ],
};
