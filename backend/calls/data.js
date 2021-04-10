let fastify;
function init(f) {
  fastify = f;
  addCalls(fastify);
}

function addCalls(fastify) {
  fastify.post("/data/create", tokenCheck, async (request, reply) => {
    return await fastify.insert(request.body.table, request.body.data);
  });

  fastify.post("/data/alter", tokenCheck, async (request, reply) => {
    return await fastify.update(
      request.body.table,
      request.body.data,
      request.body.id
    );
  });

  fastify.post("/data/get", tokenCheck, async (request, reply) => {
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
