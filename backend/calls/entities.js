let fastify;
function init(f) {
  fastify = f;
  addDocs(fastify);
  addCalls(fastify);
}

function addDocs(fastify) {
  fastify.get("/auth/login", (request, reply) => {
    return { username: "string", password: "string" };
  });

  fastify.get("/entity/create", (request, reply) => {
    return {
      name: "string",
      columns: [{ name: "string", type: "integer/bool/string/decimal" }],
    };
  });

  fastify.get("/entity/alter", (request, reply) => {
    return {
      table: "string",
      action: "insert/drop",
      name: "string",
      type: "integer/bool/string/decimal",
    };
  });

  fastify.get("/entity/drop", (request, reply) => {
    return {
      name: "string",
    };
  });
}

function addCalls(fastify) {
  fastify.post("/auth/login", async (request, reply) => {
    if (fastify.checkUser(request.body.username, request.body.password)) {
      return fastify.createToken(request.body.username);
    } else {
      reply.code(403).send();
    }
  });

  fastify.post("/entity/create", tokenCheck, async (request, reply) => {
    return await fastify.createTable(request.body);
  });

  fastify.post("/entity/alter", tokenCheck, async (request, reply) => {
    return await fastify.alterTable(request.body);
  });

  fastify.post("/entity/drop", tokenCheck, async (request, reply) => {
    return await fastify.dropTable(request.body);
  });
}
exports.init = init;

let tokenCheck = {
  onRequest: [
    (request, reply, next) => {
      if (!fastify.checkToken(request.query.token)) {
        reply.code(403).send();
      } else {
        next();
      }
    },
  ],
};
