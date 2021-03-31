var jsondb;

const fastifyPlugin = require("fastify-plugin");
const md5 = require("md5");

async function jsonConnector(fastify, options) {
  init();
  fastify.decorate("low", jsondb);
  fastify.decorate("checkUser", checkUser);
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
      tables: [],
      forms: [],
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

module.exports = fastifyPlugin(jsonConnector);
