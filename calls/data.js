let fastify;
let middleware;
function init(f, m) {
  fastify = f;
  middleware = m;
  addCalls(fastify);
}

function addCalls(fastify) {
  fastify.post(
    "/data/create",
    middleware.tokenCheck,
    async (request, reply) => {
      return await fastify.insert(request.body.table, request.body.data);
    }
  );

  fastify.post("/data/alter", middleware.tokenCheck, async (request, reply) => {
    return await fastify.update(
      request.body.table,
      request.body.data,
      request.body.id
    );
  });

  fastify.post(
    "/data/delete",
    middleware.tokenCheck,
    async (request, reply) => {
      return await fastify.update(
        request.body.table,
        { deleted: true },
        request.body.id
      );
    }
  );

  fastify.post("/data/get", middleware.tokenCheck, async (request, reply) => {
    if (request.body.joins) {
      return await fastify.join(
        request.body.table,
        request.body.columns,
        request.body.filters,
        request.body.joins,
        request.body.limit,
        request.body.offset,
        request.body.orderField,
        request.body.order
      );
    } else {
      return await fastify.simpleSelect(
        request.body.table,
        request.body.columns,
        request.body.filters,
        request.body.limit,
        request.body.offset,
        request.body.orderField,
        request.body.order
      );
    }
  });
}
exports.init = init;
