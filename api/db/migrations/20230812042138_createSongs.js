/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("songs", (table) => {
    table.increments("song_id").primary(); // Sets songs_id as the primary key
    table.string("song_title");
    table.date("song_date");
    table.integer("artist_id"); // Foreign key artist_id from table artists
    table.foreign("artist_id").references("artist_id").inTable("artists").onDelete("cascade");
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("songs");
};
