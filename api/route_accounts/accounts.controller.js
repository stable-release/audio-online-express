const accountsService = require("./accounts.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const { hash } = require("../utils/hash.module");

// Validation
const VALID_PROPERTIES = ["account_username", "account_email", "account_password"];

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
        status: 404,
        message: `Invalid Username and/or Password`,
    });
}

async function isUnique(req, res, next) {
    const { data: { account_username } = {} } = req.body;
    const unique = await accountsService.read(account_username);
    if (!unique) {
        res.locals.account_username = account_username;
        return next();
    }
    next({
        status: 404,
        message: `Invalid Username`
    })
}

// Validate Account Details
async function generateNewHash(req, res, next) {
    const account_password = res.locals.account_password ? res.locals.account_password : req.body.data.account_password;
    const hashed = await hash.generateHash(account_password);
    if (hashed) {
        res.locals.account_password = hashed;
        return next();
    }
    next({
        status: 404,
        message: `Invalid Username and/or Password`
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
        status: 404,
        message: `Invalid Username and/or Password`,
    });
}

async function aggregateAccountDetails(req, res, next) {
    const { data: { account_email } = {} } = req.body;
    const unique = await accountsService.readEmail(account_email);
    if (!unique) {
        res.locals.account_email = account_email;
        return next();
    }
    next({
        status: 404,
        message: "Email invalid"
    })
}

// Create New Account
async function createAccount(req, res, next) {
    const account = {
        account_username: res.locals.account_username,
        account_email: res.locals.account_email,
        password: res.locals.account_password,
    }
    const data = await accountsService.create(account);
    const response = {
        account_id: data.account_id,
        account_username: data.account_username,
        account_email: data.account_email,
    }
    res.status(201).json({ response })
}

module.exports = {
    create: [
        hasProperties("account_username", "account_email", "account_password"),
        hasOnlyValidProperties,
        asyncErrorBoundary(isUnique),
        asyncErrorBoundary(generateNewHash),
        aggregateAccountDetails,
        asyncErrorBoundary(createAccount),
    ],
    read: [
        hasOnlyValidProperties,
        asyncErrorBoundary(accountExists),
        asyncErrorBoundary(verifyHash),
    ],
};
