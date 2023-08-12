/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("artists", (table) => {
    table.increments("artist_id").primary(); // Sets artist_id as the primary key
    table.string("artist_name");
    table.string("artist_location");
    table.text("artist_notes");
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("artists");
};
