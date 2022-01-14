function sum(a, b) {
    if ([a, b].every(item => Number.isFinite(item))) {
        return a + b;
    }
    throw new TypeError()
}

module.exports = sum;
