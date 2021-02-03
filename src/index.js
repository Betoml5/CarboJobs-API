const app = require("./app");
const { config } = require("./config");

app.listen(config.port, () => {
  console.log(`Server corriendo en el puerto: http:localhost:${config.port}`)
})


