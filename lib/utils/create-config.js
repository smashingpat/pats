module.exports = (settings = {}) => {
    if (!settings.rootDir) throw new Error(`expected rootDir, received \`${settings.rootDir}\``);

    return {
        rootDir: settings.rootDir,
    };
};
