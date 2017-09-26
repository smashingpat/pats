const connect = require('connect');
const serveStatic = require('serve-static');
const { sassHandler } = require('./sass-handler');
const createConfig = require('../utils/create-config');

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
            stack: err.stack || null,
            stackHighlighted: err.stack
                ? err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
                : null,
        };

        res.writeHead(500, {
            'Content-Type': 'text/html',
        });
        res.end(`<pre>${errorObject.stackHighlighted || errorObject.message}</pre>`);
    } else {
        next();
    }
};
