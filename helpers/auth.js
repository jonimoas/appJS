const fastifyPlugin = require("fastify-plugin");
const jwt = require("jsonwebtoken");

async function auth(fastify, options) {
  fastify.decorate("createToken", createToken);
  fastify.decorate("checkToken", checkToken);
}

function createToken(user) {
  return jwt.sign({ user: user }, "s");
}
function checkToken(token) {
  return jwt.verify(token, "s", function (err, decoded) {
    if (err) {
      return false;
    }
    return true;
  });
}

module.exports = fastifyPlugin(auth);
