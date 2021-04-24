const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./db/dbConnector"));
fastify.register(require("./db/jsonConnector"));
fastify.register(require("./helpers/auth"));
const entities = require("./calls/entities");
const data = require("./calls/data");
const misc = require("./calls/misc");
const middleware = require("./helpers/middleware");
middleware.init(fastify);
entities.init(fastify, middleware);
data.init(fastify, middleware);
misc.init(fastify, middleware);

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
