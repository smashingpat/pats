const fs = require('mz/fs');
const path = require('path');
const createConfig = require('./utils/create-config');


const createBundler = async (file) => {
    const fileExists = await fs.exists(file);

    if (!fileExists) return null;

    return 'test';
};

const createBundlers = async (files) => {
    const bundlers = await Promise.all(files.map(createBundler));

    return bundlers.filter(Boolean);
};

exports.middleware = (settings) => {
    const config = createConfig(settings);
    const files = config.files.map(file => path.resolve(config.rootDir, file));
    const bundlers = createBundlers(files);

    bundlers
        .then(console.log)
        .catch(console.error);

    return (req, res, next) => bundlers
        .then(result => res.end(result.toString()))
        .catch(err => next(err));
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
