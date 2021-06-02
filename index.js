const fastify = require("fastify")({
  logger: true,
});
const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
fastify.register(require("./db/dbConnector"));
fastify.register(require("./db/jsonConnector"));
fastify.register(require("./helpers/auth"));
fastify.register(require("fastify-cors"), (instance) => (req, callback) => {
  let corsOptions = { origin: true };
  callback(null, corsOptions);
});
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "dist"),
});
const entities = require("./calls/entities");
const data = require("./calls/data");
const misc = require("./calls/misc");
const middleware = require("./helpers/middleware");
middleware.init(fastify);
entities.init(fastify, middleware);
data.init(fastify, middleware);
misc.init(fastify, middleware);
function buildVue() {
  let routes = [];
  fs.readdirSync("./src/ext").forEach((file) => {
    if (file.indexOf(".vue") > 0) {
      routes.push({
        name: file.split(".")[0],
        file: file,
      });
    }
  });
  console.log(routes);
  fs.writeFileSync("./routes.json", JSON.stringify(routes));
  child = exec("npm run build").stderr.pipe(process.stderr);
}
buildVue();
const start = async () => {
  try {
    await fastify.listen(8000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
