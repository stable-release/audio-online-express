const knex = require("../db/connection");


function list() {
    return knex("artists").select("*");
}

function read(artistId) {
    return knex("artists").select("*").where({ artist_id: artistId }).first();
}

function findArtist(artistName) {
    return knex("artist").select("*").whereLike("artist_name", `%${artistName}%`);
}

module.exports = {
    list,
    read,
    findArtist,
}