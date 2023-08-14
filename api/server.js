const { PORT = 5000, NODE_ENV } = process.env;
const app = require("./app");
const knex = require("./db/connection");

const listener = () => console.log(`Listening on Port ${PORT}`);

NODE_ENV === "production"
    ? knex.migrate
          .latest()
          .then((migrations) => {
              console.log("migrations", migrations);
              app.listen(PORT, listener);
          })
          .catch((error) => {
              console.log(error);
              knex.destroy();
          })
    : app.listen(PORT, listener);
