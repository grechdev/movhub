const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const randomId = require('../scripts/randomid')
const updateFile = require('../scripts/updatefile')
const AccessControl = require('../scripts/accesscontrol')

const movies = JSON.parse(fs.readFileSync('database/movies.json'))
const users = JSON.parse(fs.readFileSync('database/users.json'))

const updateMovies = () => {updateFile('database/movies.json', movies)}
const updateUsers = () => {updateFile('database/users.json', users)}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './media/')
  },
  filename: function(req, file, cb) {
    cb(null, `${randomId('img')}.${file.mimetype.slice(-3)}`)
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
    cb(null, true)
  }else{
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 7
  },
  fileFilter: fileFilter
})

const movieValidator = (movie) => {
  let textRegExp = new RegExp(`^[a-zA-Z0-9"':;!?., _-]*$`)
  let errors = {
    title: textRegExp.test(movie.title) && movie.title.length >= 2 && movie.title.length <= 20,
    description: textRegExp.test(movie.description) && movie.description.length >= 20 && movie.description.length <= 1000
  }

  if( !(errors.title && errors.description) ) {
    return false
  }

  return true
}

// get movies

router.get('/', (req, res) => {
  let page = req.query.page ? req.query.page : 1
  let limit = 10
  let tempMovies = [...movies]
  let sort = req.query.sort
  
  if(sort === 'popular') {
    console.log(req.query)
    tempMovies.sort((a, b) => b.likesCount - a.likesCount)
  }else if(sort === 'favorite') {
    if(new AccessControl().isUser(req.headers.accesstoken)){
      const user = users.find(user => user.accessToken === req.headers.accesstoken)
      tempMovies = tempMovies.filter(movie => user.likes.includes(movie.id))
    }
  }else{
    tempMovies.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }
  
  if(req.query.search !== undefined){
    const titleRegExp = new RegExp(req.query.search, 'i')
    tempMovies = tempMovies.filter(movie => titleRegExp.test(movie.title))
  }

  res.send({
    maxPage: Math.ceil(tempMovies.length/limit),
    page: page,
    result: tempMovies.slice(0+limit*(page-1),(limit-1)*page+1)
  })
})

// post movie

router.post('/', upload.single('photo'), (req, res) => {
  if(new AccessControl().isUser(req.body.token)){
    const user = users.find(user => user.accessToken == req.body.token)
    const newMovie = {
      id: randomId('id'),
      title: req.body.title,
      description: req.body.description,
      path: req.file.path,
      owner: user.id,
      likesCount: 0,
      liked: [],
      date: (new Date()).toISOString()
    }
    if (movieValidator(req.body)) {
      movies.push(newMovie)
      user.posts.push(newMovie.id)
      updateMovies()
      updateUsers()
      res.status(201).send({status: true, message: 'Movie has been posted, thank you!'})
    }else{
      fs.unlinkSync(req.file.path)
      res.status(403).send({
        status: false,
        message: 'Movie did not pass validation'
      })
    }
  }else{
    fs.unlinkSync(req.file.path)
    res.status(403).send({
      status: false,
      message: `Access denied: Access token doesn't exist`
    })
  }
})

// find by id

router.post('/id/:movieId', async (req, res) => {
  if (movies.some(movie => movie.id == req.params.movieId)) {
    const movie = await movies.find(movie => movie.id == req.params.movieId)
    const owner = await users.find(user => user.id == movie.owner)
    const editPermission = await new AccessControl().isOwnerOrAdmin(req.body.accessToken, req.params.movieId)
    res.send({
      ...movie,
      ownerName: owner.username,
      editPermission: editPermission
    })
  }else{
    res.status(404).send({
      status: false,
      message: 'Movie did not found.'
    })  
  }
})

// delete movie

router.delete('/id/:movieId', (req, res) => {
  if(new AccessControl().isOwnerOrAdmin(req.body.token, req.params.movieId)){
    const user = users.find(user => user.posts.includes(req.params.movieId))
    let targetMovie = movies.find(movie => movie.id == req.params.movieId)
    console.log(user)
    let targetIndex = {
      movies: movies.indexOf(targetMovie),
      userPosts: user.posts.indexOf(targetMovie.id)
    }
    console.log(targetIndex.userPosts)
    movies.splice(targetIndex.movies, 1)
    user.posts.splice(targetIndex.userPosts, 1)
    updateMovies()
    updateUsers()
    fs.unlinkSync(targetMovie.path)
    res.send({
      status: true,
      message: `Movie with ${req.params.movieId} has been deleted!`
    })
  }else{
    console.log(req.body)
    res.status(403).send({
      status: false,
      message: `Access denied: Access token doesn't exist.`
    })
  }
})

// patch movie

router.patch('/id/:movieId', (req, res) => {
  if(new AccessControl().isOwnerOrAdmin(req.body.token, req.params.movieId)) {
    if(movieValidator(req.body)){
      let targetMovie = movies.find(movie => movie.id == req.params.movieId)
      let targetIndex = movies.indexOf(targetMovie)
      movies[targetIndex].title = req.body.title
      movies[targetIndex].description = req.body.description
      updateMovies()
      res.status(201).send({
        status: true,
        message: `Movie's content has been changed!`
      })
    }else{
      res.status(403).send({
        status: false,
        message: 'Title or description did not pass criteries'
      })
    }
  }else{
    res.status(403).send({
      status: false,
      message: `Access denied: Access token doesn't exist.`
    })
  }
})

// patch movie

router.patch('/id/:movieId', (req, res) => {
  if(new AccessControl().isOwnerOrAdmin(req.body.token, req.params.movieId)) {
    let targetMovie = movies.find(movie => movie.id == req.params.movieId)
    let targetIndex = movies.indexOf(targetMovie)
    movies[targetIndex].title = req.body.title
    movies[targetIndex].description = req.body.description
    updateMovies()
    res.status(201).send({
      status: true,
      message: `Movie's content has been changed!`
    })
  }else{
    res.status(403).send({
      status: false,
      message: `Access denied: Access token doesn't exist.`
    })
  }
})

// leave a like

router.patch('/like/:movieId', (req, res) => {
  if (new AccessControl().isUser(req.body.token)){
    const user = users.find(user => user.accessToken == req.body.token)
    const userIndex = users.indexOf(user)
    const targetMovie = movies.find(movie => movie.id == req.params.movieId)
    const movieIndex = movies.indexOf(targetMovie)
    const usersMovieIndex = user.likes.indexOf(targetMovie.id)

    if (movies.some(movie => movie.id == req.params.movieId)) {
      if (user.likes.includes(req.params.movieId)) {
        users[userIndex].likes.splice(usersMovieIndex,1)
        console.log(movieIndex)
        movies[movieIndex].likesCount--
        movies[movieIndex].liked.splice(movies[movieIndex].liked.indexOf(users[userIndex].id),1)
      }else if(!(user.likes.includes(req.params.movieId))) {
        users[userIndex].likes.push(targetMovie.id)
        movies[movieIndex].likesCount++
        movies[movieIndex].liked.push(users[userIndex].id)
      }
      updateMovies()
      updateUsers()
      res.status(201).send({
        status: true,
        message: 'Like state has been changed!'
      })
    }else{
      res.status(404).send({
        status: false,
        message: 'Movie not found.'
      })
    }

  }else{
    res.status(403).send({
      status: false,
      message: `Access denied: Access token doesn't exist.`
    })
  }
})

module.exports = router