/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("accounts", (table) => {
        table.bigIncrements("account_id").primary();
        table.string("account_username").unique().notNullable();
        table.text("account_email").unique().notNullable();
        table.text("password").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("accounts");
};
