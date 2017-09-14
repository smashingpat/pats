const createConfig = require('./utils/create-config');
const { startServer } = require('./server');


module.exports = function Pats(settings = {}) {
    const config = createConfig(settings);

    startServer(config);
};
