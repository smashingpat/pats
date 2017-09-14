exports.middleware = (req, res, next) => {
    next();
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
