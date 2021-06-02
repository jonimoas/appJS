var sqldb;

const { default: fastify } = require("fastify");
const fastifyPlugin = require("fastify-plugin");

async function dbConnector(fastify, options) {
  init();
  fastify.decorate("knex", sqldb);
  fastify.decorate("createTable", createTable);
  fastify.decorate("alterTable", alterTable);
  fastify.decorate("dropTable", dropTable);
  fastify.decorate("simpleSelect", simpleSelect);
  fastify.decorate("join", join);
  fastify.decorate("insert", insert);
  fastify.decorate("update", update);
}

async function createTable(options) {
  return sqldb.schema
    .createTable(options.name, async function(table) {
      table.increments();
      table.timestamps(true, true);
      table.boolean("deleted").defaultTo(false);
      for (const c of options.columns) {
        if (c.foreign) {
          await table
            .integer(c.name)
            .references("id")
            .inTable(c.foreignTable);
        } else {
          addSimpleColumn(table, c.name, c.type);
        }
      }
    })
    .then((r) => {
      return r;
    });
}

function alterTable(options) {
  fastify.alterEntity(options);
  switch (options.action) {
    case "drop":
      return sqldb.schema.table(options.table, async (r) => {
        return r.dropColumn(options.column);
      });
    case "insert":
      if (options.foreign) {
        return (
          sqldb.schema.table(options.table),
          async (r) => {
            return r
              .integer(options.name)
              .references("id")
              .inTable(options.foreignTable);
          }
        );
      } else {
        return sqldb.schema.table(options.table, async (r) => {
          return addSimpleColumn(r, options.name, options.type);
        });
      }
  }
}

function dropTable(options) {
  return sqldb.schema.dropTable(options.name, async (r) => {
    return r;
  });
}

function addSimpleColumn(table, name, type) {
  switch (type) {
    case "integer":
      return table.integer(name);
    case "decimal":
      return table.decimal(name);
    case "string":
      return table.string(name);
    case "bool":
      return table.boolean(name);
  }
}

function init() {
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

async function simpleSelect(
  table,
  columns = "*",
  filters = [],
  limit = 10,
  offset = 0,
  orderField = "id",
  order = "desc"
) {
  let filterString = "";
  for (const f of filters) {
    filterString += " " + f.field + " " + f.operator + " " + f.value + " and";
  }
  return await sqldb(table)
    .select(columns)
    .whereRaw(filterString == "" ? "id>=1" : filterString.slice(0, -3))
    .limit(limit)
    .offset(offset)
    .orderBy(orderField, order);
}

function join(
  table,
  columns = "*",
  filters = [],
  joins = [],
  limit = 10,
  offset = 0,
  orderField = "id",
  order = "desc"
) {
  let joinString = "";
  let filterString = "";
  for (const j of joins) {
    joinString +=
      " " + j.type + " join " + j.table + " on " + j.field1 + "=" + j.field2;
  }
  for (const f of filters) {
    filterString += " " + f.field + " " + f.operator + " " + f.value + " and";
  }
  return sqldb(table)
    .select(columns)
    .joinRaw(joinString)
    .whereRaw(filterString == "" ? "id>=1" : filterString.slice(0, -3))
    .limit(limit)
    .offset(offset)
    .orderBy(orderField, order);
}

function insert(table, data) {
  return sqldb(table).insert(data);
}

function update(table, data, id) {
  return sqldb(table)
    .update(Object.assign(data, { updated_at: new Date() }))
    .where({ id: id });
}

module.exports = fastifyPlugin(dbConnector);
