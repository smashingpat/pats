const connect = require('connect');
const serveStatic = require('serve-static');
const createConfig = require('../utils/create-config');
const sassHandler = require('./sass');

exports.createMiddleware = (settings) => {
    const config = createConfig(settings);
    const middleware = connect();

    middleware.use(sassHandler(config));
    middleware.use(serveStatic(config.rootDir));

    return middleware;
};

exports.errorHandler = (err, req, res, next) => {
    if (err) {
        const errorObject = {
            message: err.message || err,
            status: err.status || 500,
            stack: err.stack || null,
            stackHighlighted: err.stack
                ? err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
                : null,
        };

        res.statusCode = errorObject.status;
        res.end(`<pre>${errorObject.stackHighlighted || errorObject.message}</pre>`);
    } else {
        next();
    }
};
