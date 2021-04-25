let fastify;
let middleware;
function init(f, m) {
  fastify = f;
  middleware = m;
  addCalls(fastify);
}

function addCalls(fastify) {
  fastify.get("/tables/render/:table", async (request, reply) => {
    return await fastify.getTable(request.params.table);
  });
}
exports.init = init;
