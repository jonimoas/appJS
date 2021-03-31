const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./db/dbConnector"));
fastify.register(require("./db/jsonConnector"));
fastify.register(require("./helpers/auth"));
const entities = require("./calls/entities");
entities.init(fastify);

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
