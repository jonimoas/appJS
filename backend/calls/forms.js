let fastify;
let middleware;
function init(f, m) {
  fastify = f;
  middleware = m;
  addCalls(fastify);
}

function addCalls(fastify) {
  fastify.get("/forms/render/:form", async (request, reply) => {
    return await fastify.getForm(request.params.form);
  });
}
exports.init = init;
