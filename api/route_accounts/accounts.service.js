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

module.exports = {
    create,
    read,
    readEmail
}