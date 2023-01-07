// import http package from Node
const http = require('http');
// import the express app
const app = require('./backend/app');
// import debug
const debug = require('debug')('node-angular')

// error handling function for port
const normalizePort = val => {
  var port = parseInt(val,10)

  if(isNaN(port)){
    //named pipe
    return val
  }

  if (port >= 0){
    //port number
    return port
  }

  return false
}
// error nadling function to check which type of error occured
const onError = error => {
  if(error.syscall !== "listen"){
    throw error
  }
  const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
  switch (error.code){
    case "EACCES":
      console.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + "is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = ()=> {
  const addr = server.address()
  const bind = typeof addr === "string" ? "pipe" + addr : "port" + port
  debug('Listening on ' + bind)
}

// declare the port
const port = normalizePort(process.env.PORT || "3000")


// set the port in express app
app.set('port',port)

// seting the express app server with error handling
const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)
server.listen(port)
