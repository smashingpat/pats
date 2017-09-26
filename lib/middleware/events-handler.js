const chalk = require('chalk');


const colorByStatus = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
        return 'green';
    }

    if (statusCode >= 300 && statusCode < 400) {
        return 'grey';
    }

    if (statusCode >= 400 && statusCode < 500) {
        return 'blue';
    }

    if (statusCode >= 500 && statusCode < 600) {
        return 'red';
    }

    return 'grey';
};

exports.eventsHandler = () => (req, res, next) => {


    next();
};
