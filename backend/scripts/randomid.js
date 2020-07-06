module.exports = function(prefix) {
    return `${prefix.toString()}${Date.now().toString().slice(3).split('').reverse().join('')}`
}