var jsondb;

const fastifyPlugin = require("fastify-plugin");
const md5 = require("md5");

async function jsonConnector(fastify, options) {
  init();
  fastify.decorate("low", jsondb);
  fastify.decorate("checkUser", checkUser);
  fastify.decorate("getForm", getForm);
  fastify.decorate("getTable", getTable);
  fastify.decorate("createEntity", createEntity);
  fastify.decorate("dropEntity", dropEntity);
  fastify.decorate("alterEntity", alterEntity);
  fastify.decorate("add", add);
  fastify.decorate("edit", edit);
  fastify.decorate("remove", remove);
}

function init() {
  const low = require("lowdb");
  const FileSync = require("lowdb/adapters/FileSync");
  const adapter = new FileSync("./db.json");

  jsondb = low(adapter);
  jsondb
    .defaults({
      users: [
        {
          username: "admin",
          password: "21232f297a57a5a743894a0e4a801fc3",
          level: 0,
        },
      ],
      tables: [
        {
          name: "notFound",
          title: "No Such Table",
          fields: [],
          form: "notfound",
          level: 0,
        },
      ],
      forms: [
        {
          name: "notfound",
          title: "No Such Form",
          mainElement: {},
          secondElements: [],
          level: 0,
        },
      ],
      entities: [],
    })
    .write();
}

function checkUser(username, password) {
  let user = jsondb.get("users").find({ username: username }).value();
  console.log(user);
  if (user == undefined) {
    return false;
  }
  if (md5(password) == user.password) {
    return true;
  }
  return false;
}

function getForm(name) {
  let form = jsondb.get("forms").find({ name: name }).value();
  if (form) {
    return form;
  }
  return jsondb.get("forms").find({ name: "notFound" }).value();
}

function getTable(name) {
  let table = jsondb.get("tables").find({ name: name }).value();
  if (table) {
    return table;
  }
  return jsondb.get("tables").find({ name: "notFound" }).value();
}

function createEntity(body) {
  return jsondb
    .get("entities")
    .push({ name: body.name, schema: body.columns })
    .write();
}

function alterEntity(body) {
  let entity = jsondb.get("entities").find({ name: body.name }).value();
  let schema = entity.schema;
  if (body.action == "drop") {
    schema = schema.filter((r) => r.name != body.column);
  } else {
    schema.push({
      name: body.name,
      type: body.type,
      foreign: body.foreign,
      foreignTable: body.foreignTable,
    });
  }
  return jsondb
    .get("entities")
    .find({ name: body.name })
    .assign({
      schema: schema,
    })
    .write();
}

function dropEntity(body) {
  return jsondb.get("entities").remove({ name: body.name }).write();
}

function add(table, body) {
  return jsondb.get(table).push(body).write();
}

function edit(table, body) {
  return jsondb.get(table).find({ name: body.name }).assign(body).write();
}

function remove(table, body) {
  return jsondb.get(table).remove({ name: body.name }).write();
}
module.exports = fastifyPlugin(jsonConnector);
