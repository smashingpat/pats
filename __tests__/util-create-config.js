const createConfig = require('../lib/utils/create-config');


it('should create a config', () => {
    const settings = {
        rootDir: '/',
    };

    const config = createConfig(settings);

    expect(typeof config.rootDir).toBe('string');
});

it('is should throw an error if setting `rootDir` is missing', () => {
    const settings = {
        foo: 'foo',
    };

    expect(() => createConfig(settings)).toThrowError();
});
