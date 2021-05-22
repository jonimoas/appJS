let fastify;
exports.init = function (f) {
  fastify = f;
};

exports.tokenCheck = {
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
