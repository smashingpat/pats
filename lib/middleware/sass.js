const fs = require('mz/fs');
const url = require('url');
const chokidar = require('chokidar');
const path = require('path');
const util = require('util');
const sass = require('node-sass');


const sassRender = util.promisify(sass.render);

const createSassBundler = (filepath) => {
    const watcher = chokidar.watch(filepath);
    let lastResult = null;

    const bundleSass = async () => {
        lastResult = null;
        const { css } = await sassRender({ file: filepath });
        lastResult = css;

        return css;
    };

    const getResult = async () => {
        if (lastResult) {
            return lastResult;
        }
        const css = await bundleSass();

        return css;
    };

    watcher.on('change', bundleSass);

    return getResult;
};

module.exports = (config) => {
    const { files } = config;
    const bundles = files
        .reduce((obj, file) => {
            const cssext = '.css';
            const cssfilename = path.basename(file, path.extname(file)) + cssext;
            const urlpath = url.resolve('/', cssfilename);
            const filepath = path.join(config.rootDir, file);
            const assertSass = /.s(c|a)ss$/.test(filepath);
            const assertExists = fs.existsSync(filepath);

            return (assertSass && assertExists) ? Object.assign({}, obj, {
                [urlpath]: createSassBundler(filepath),
            }) : obj;
        }, {});

    return async (req, res, next) => {
        const bundle = bundles[req.url];
        if (bundle) {
            try {
                const contents = await bundle();

                res.end(contents);
            } catch (err) {
                next(err);
            }
        } else {
            next();
        }
    };
};
