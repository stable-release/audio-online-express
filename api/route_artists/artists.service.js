const knex = require("../db/connection");


function list() {
    return knex("artists").select("*");
}

module.exports = {
    list,
}