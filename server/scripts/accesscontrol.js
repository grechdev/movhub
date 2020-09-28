const fs = require('fs')

const users = JSON.parse(fs.readFileSync('database/users.json'))

module.exports = class AccessControl {
    isAdmin(token) {
        return users.some(user => user.accessToken == token && user.rank == 'admin') && token !== null && token !== undefined
    }
    isOwner(token, postId) {
        return users.some(user => user.accessToken == token && user.posts.includes(postId)) && token !== null && token !== undefined
    }
    isOwnerOrAdmin(token, postId) {
        return this.isAdmin(token) || this.isOwner(token, postId) && token !== null && token !== undefined
    }
    isUser(token) {
        return users.some(user => user.accessToken == token) && token !== null && token !== undefined
    }
}