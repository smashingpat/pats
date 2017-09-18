const path = require('path');
const Pats = require('./lib');


Pats({
    rootDir: path.resolve(__dirname, 'example'),
});

require('webpack');
