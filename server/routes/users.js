const express = require('express')
const router = express.Router()
const fs = require('fs')
const randomId = require('../scripts/randomid.js')
const updateFile = require('../scripts/updatefile.js')

const users = JSON.parse(fs.readFileSync('database/users.json'))

const updateUsers = () => {updateFile('database/users.json', users)}

// get token

router.post('/auth', (req, res) => {
    let targetUser = users.find(user => user.username == req.body.username)
    if(!!targetUser) {
        if(targetUser.password == req.body.password) {
            targetUser.accessToken = randomId('token')
            updateUsers()
            res.send({
                status: true,
                accessToken: targetUser.accessToken,
            })
        }else{
            res.send({
                status: false,
                message: 'Password is incorrect.'
            })
        }
    }else{
        res.status(404).send({
            status: false,
            message: 'User not found.'
        })
    }
})

// login

router.get('/token/:token', (req, res) => {
    if(users.some(user => user.accessToken == req.params.token)) {
        const user = users.find(user => user.accessToken == req.params.token)
        res.status(200).send({
            status: true,
            result: {
                id: user.id,
                username: user.username,
                rank: user.rank,
                likes: user.likes,
                posts: user.posts
            }
        })
    }else{
        res.status(404).send({
            status: false,
            message: 'User with such token is not found'
        })
    }
})

// register a new user

router.post('/register', (req, res) => {
    let newUser = {
        id: randomId('id'),
        username: req.body.username,
        password: req.body.password,
        rank: 'user',
        posts: [],
        likes: []
    }
    if(!(users.some(user => user.username == newUser.username))) {
        if(newUser.username.length >= 3 && newUser.username.length <= 16) {
            const usernameRegExp = new RegExp('[a-zA-Z0-9_]', 'g')
            if(usernameRegExp.test(newUser.username)) {
                if(newUser.password.length >= 5 && newUser.password.length <= 20) {
                    users.push(newUser)
                    updateUsers()
                    res.send({
                        status: true,
                        message: 'New user has been registered!'
                    })
                }else{
                    res.status(400).send({
                        status: false,
                        message: 'Password must be 5-20 characters'
                    })
                }
            }else{
                res.status(400).send({
                    status: false,
                    message: 'Username can include only alphanumeric characters'
                })
            }
        }else{
            res.status(400).send({
                status: false,
                message: 'Username must be 3-16 characters'
            })
        }
    }else{
        res.status(405).send({
            status: false,
            message: 'This username is already taken.'
        })
    }
})

router.get('/id/:userId', (req, res) => {
    if(users.some(user => user.id == req.params.userId)) {
        const user = users.find(user => user.id == req.params.userId)
        res.status(201).send({
            status: true,
            result: {
                id: user.id,
                username: user.username,
                rank: user.rank,
                likes: user.likes,
                posts: user.posts
            }
        })
    }else{
        res.status(404).send({
            status: false,
            message: 'User with such id is not found'
        })
    }
})

module.exports = router