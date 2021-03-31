var sqldb;

const fastifyPlugin = require("fastify-plugin");

async function dbConnector(fastify, options) {
  init();
  fastify.decorate("knex", sqldb);
  fastify.decorate("createTable", createTable);
  fastify.decorate("alterTable", alterTable);
  fastify.decorate("dropTable", dropTable);
}

async function createTable(options) {
  return sqldb.schema
    .createTable(options.name, async function (table) {
      table.increments();
      table.timestamps(true, true);
      table.boolean("deleted");
      for (const c of options.columns) {
        if (c.foreign) {
          await table.integer(c.name).references("id").inTable(c.foreignTable);
        } else {
          await addSimpleColumn(table, c.name, c.type);
        }
      }
    })
    .then((r) => {
      return r;
    });
}

async function alterTable(options) {
  switch (options.action) {
    case "drop":
      return await sqldb.schema.table(options.table, async (r) => {
        return await r.dropColumn(options.column);
      });
    case "insert":
      if (options.foreign) {
        return (
          await sqldb.schema.table(options.table),
          async (r) => {
            return await r
              .integer(options.name)
              .references("id")
              .inTable(options.foreignTable);
          }
        );
      } else {
        return sqldb.schema.table(options.table, async (r) => {
          return await addSimpleColumn(r, options.name, options.type);
        });
      }
  }
}

function dropTable(options) {
  return sqldb.schema.dropTable(options.name, async (r) => {
    return r;
  });
}

async function addSimpleColumn(table, name, type) {
  switch (type) {
    case "integer":
      return await table.integer(name);
    case "decimal":
      return await table.decimal(name);
    case "string":
      return await table.string(name);
    case "bool":
      return await table.boolean(name);
  }
}

function init() {
  const path = require("path");
  const knex = require("knex");
  console.log("init knex");
  sqldb = knex({
    client: "sqlite3",
    connection: {
      filename: "./db.sqlite",
      acquireConnectionTimeout: 2000,
    },
    useNullAsDefault: true,
  });
  console.log("knex complete");
}

module.exports = fastifyPlugin(dbConnector);
