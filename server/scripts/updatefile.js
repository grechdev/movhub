const fs = require('fs')

module.exports = function (filePath, newFile) {
    fs.writeFileSync(filePath, JSON.stringify(newFile))
}