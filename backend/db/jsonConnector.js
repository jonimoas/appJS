var jsondb;

const fastifyPlugin = require("fastify-plugin");
const md5 = require("md5");

async function jsonConnector(fastify, options) {
  init();
  fastify.decorate("low", jsondb);
  fastify.decorate("checkUser", checkUser);
  fastify.decorate("getForm", getForm);
  fastify.decorate("getTable", getTable);
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

module.exports = fastifyPlugin(jsonConnector);
