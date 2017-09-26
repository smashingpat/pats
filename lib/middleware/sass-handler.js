const chokidar = require('chokidar');
const path = require('path');
const url = require('url');
const sass = require('node-sass');
const { promisify } = require('util');


const sassRender = promisify(sass.render);

const createSassBundler = (filepath) => {
    const watcher = chokidar.watch(filepath);
    let lastCssResult = null;
    let lastBundle = null;

    async function bundle() {
        console.log('start bundling');

        const bundleSass = async () => {
            try {
                lastCssResult = null;
                const result = await sassRender({ file: filepath });
                lastCssResult = result.css.toString();
                watcher.add(result.stats.includedFiles);

                console.log('done bundling');

                return lastCssResult;
            } catch (err) {
                return Promise.reject(err);
            }
        };

        lastBundle = bundleSass();

        return lastBundle;
    }

    async function onChangeHandler() {
        try {
            bundle();
        } catch (err) {
            console.error(err);
        }
    }


    watcher.on('ready', onChangeHandler);
    watcher.on('change', onChangeHandler);

    const get = async () => lastCssResult || lastBundle || bundle();

    return {
        get,
    };
};


exports.sassHandler = (config) => {
    const { rootDir, files } = config;
    const cssExtension = '.css';
    const bundlers = files.reduce((obj, filename) => {
        if (/.(sass)|(scss)$/.test(filename)) {
            const filepath = path.resolve(rootDir, filename);
            const cssFilename = path.join(
                path.dirname(filename),
                path.basename(filename, path.extname(filename)) + cssExtension,
            );
            const cssFileurl = url.resolve('/', cssFilename);
            const bundler = createSassBundler(filepath);

            return Object.assign({}, obj, {
                [cssFileurl]: bundler,
            });
        }
        return obj;
    }, {});


    return async (req, res, next) => {
        const { pathname } = url.parse(req.url);
        const bundle = bundlers[pathname];

        if (bundle) {
            try {
                const css = await bundlers['/style.css'].get();

                res.writeHead(200, {
                    'Content-Type': 'text/css',
                });
                res.end(css);
            } catch (err) {
                next(err);
            }
        } else {
            next();
        }
    };
};
