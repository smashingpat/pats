module.exports = (cases, defaultValue = null) => key =>
    cases[key] || defaultValue;
