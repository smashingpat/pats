const { createServer } = require('http');
const connect = require('connect');
const { middleware, errorHandler } = require('./middleware');


const PORT = 1337;
const app = connect();
const server = createServer(app);

exports.startServer = (config) => {
    app.use(middleware(config));
    app.use(errorHandler);

    server.listen(PORT, () => {
        console.log(`started at http://localhost:${PORT}`);
    });
};
