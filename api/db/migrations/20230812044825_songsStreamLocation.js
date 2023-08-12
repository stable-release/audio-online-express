/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("songs_streaming_location", (table) => {
    table.integer("song_id").primary(); // Sets songs_id as the primary key
    table.foreign("song_id").references("song_id").inTable("songs").onDelete("cascade"); // Foreign key song_id from table songs
    table.text("song_url");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("songs_streaming_location");
};
