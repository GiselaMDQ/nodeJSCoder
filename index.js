const port = 8080
const server = require('./src/app')


// Chequeo SERVIDOR EN PUERTO 8080
server.listen(port, () => {
  console.log(`Mi servidor corriendo en el port ${port}`)
})
