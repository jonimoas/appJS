let fastify;
let middleware;
function init(f, m) {
  fastify = f;
  middleware = m;
  addDocs(fastify);
  addCalls(fastify);
}

function addDocs(fastify) {
  fastify.get("/auth/login", (request, reply) => {
    return { username: "string", password: "string" };
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
}

exports.init = init;
