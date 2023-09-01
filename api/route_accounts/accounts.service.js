const knex = require("../db/connection");

function create(account) {
    return knex("accounts").insert(account).returning("*").then((createdAccount) => createdAccount[0]);
}

function read(account_username) {
    return knex("accounts").select("*").where("account_username", account_username).first();
}

function readEmail(account_email) {
    return knex("accounts").select("*").where("account_email", account_email).first();
}

function updateVerification(account_username) {
    return knex("accounts").where("account_username", account_username).update({
        verified: true,
    }, ["account_username", "verified"]);
}

// Code Table
function createEmailCode(account) {
    return knex("email_validation").insert(account).returning("*").then((createdAccount) => createdAccount[0]);
}

function readEmailCode(account_email) {
    return knex("email_validation").where("account_email", account_email).select("*").first();
}

function updateEmailCode(account_email, code) {
    return knex("email_validation").where({account_email: account_email}).update({
        code: code
    }, ["code"]);
}

function deleteEmailCode(account_email) {
    return knex("email_validation").where("account_email", account_email).delete();
}

module.exports = {
    create,
    read,
    readEmail,
    updateVerification,
    // Code Table
    createEmailCode,
    readEmailCode,
    updateEmailCode,

}