const logger = require("../logs/logger");
const { WebSocketServer } = require("ws");
const http = require("http");

/**
 * Server
 */

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
    logger.info(`WebSocket server is running on port ${port}`);
});

/**
 *  Clients
 */
const { v4: uuidv4 } = require("uuid");
const clients = {};

// new client connection request
wsServer.on("connection", function(connection) {
    // Generate a unique code for every user
    const userId = uuidv4();
    logger.info("recieved a new connection.")

    // Store the connection and handle messages
    clients[userId] = connection;
    console.log(`${userId} connected.`)
})

