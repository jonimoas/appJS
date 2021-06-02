let fastify;
let middleware;
function init(f, m) {
  fastify = f;
  middleware = m;
  addDocs(fastify);
  addCalls(fastify);
}

function addDocs(fastify) {
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
  fastify.post(
    "/entity/create",
    middleware.tokenCheck,
    async (request, reply) => {
      let res = await fastify.createTable(request.body);
      await fastify.createEntity(request.body);
      return res;
    }
  );

  fastify.post(
    "/entity/alter",
    middleware.tokenCheck,
    async (request, reply) => {
      await fastify.dropEntity(request.body);
      await fastify.createEntity(request.body);
      return await fastify.alterTable(request.body);
    }
  );

  fastify.post(
    "/entity/drop",
    middleware.tokenCheck,
    async (request, reply) => {
      let res = await fastify.dropTable(request.body);
      await fastify.dropEntity(request.body);
      return res;
    }
  );

  fastify.get(
    "/entity/getAll",
    middleware.tokenCheck,
    async (request, reply) => {
      return await fastify.getAll("entities");
    }
  );
}
exports.init = init;
