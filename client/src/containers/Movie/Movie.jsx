import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import axios from 'axios'

import Like from '../../components/Like/Like'

import { MdEdit, MdCheck, MdDelete, MdClose } from 'react-icons/md';

import NotFound from '../../components/NotFound/NotFound'
import { Input } from '../../components/Input/Input'
import { useHistory } from 'react-router-dom'

import { validator } from '../../scripts/validator'

const Utilities = props => {
  const [deleteMode, setDeleteMode] = useState(false)
  return (
    <div className="utilities">
      <button onClick={() => props.setEditMode()} className="item edit"><MdEdit /></button>
        {props.editMode && <button onClick={props.acceptEdit} disabled={props.disableEditAccept} className="accept item"><MdCheck /></button>}
        {props.editMode && <button onClick={props.discardEdit} className="discard item"><MdClose /></button>}
      <button onClick={() => setDeleteMode(!deleteMode)} className="item delete"><MdDelete /></button>
        {deleteMode && <button onClick={props.handleDelete} className="accept item"><MdCheck /></button>}
    </div>
  )
}

const Movie = ({match}) => {
  const {
    movieId 
  } = match.params

  const localStorage = window.localStorage

  const [isFound, setIsFound] = useState('')

  const history = useHistory()

  const [post, setPost] = useState({})

  const user = useSelector(state => state.user.user)

  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editDescription, setEditDescription] = useState(post.description)

  const [editTitleValid, setEditTitleValid] = useState(null)
  const [editTitleErrors, setEditTitleErrors] = useState('')

  const [editDescriptionValid, setEditDescriptionValid] = useState(null)
  const [editDescriptionErrors, setEditDescriptionErrors] = useState('')

  const fetchMovie = movieId => {
    axios.post(`http://localhost:5000/movies/id/${movieId}`, {
      accessToken: localStorage.getItem('accessToken')
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setPost(res.data)
          setIsFound(true)
        }
      })
      .catch(err => {
        if (err.status == 404) {
          setIsFound(false)
        }
      })
  }

  const dateHandler = rawDate => {
    const tempDate = new Date(rawDate)

    const time = `${tempDate.getHours()}:${tempDate.getMinutes()}`
    const date = `${tempDate.getDate()} ${tempDate.toLocaleString('default', { month: 'long'}).slice(0,3)}`
    const year = tempDate.getFullYear()
    
    const newDate = `${time} ${date} ${year}`

    return newDate
  }

  const likeHandler = id => {
    axios.patch(`http://localhost:5000/movies/like/${id}`, {
      token: localStorage.getItem('accessToken'),
      postId: movieId
    }).then(() => {
      fetchMovie(movieId)
    })
  }

  const acceptEdit = () => {
    axios.patch(`http://localhost:5000/movies/id/${movieId}`, {
      token: localStorage.getItem('accessToken'),
      title: editTitle,
      description: editDescription
    }).then(res => {
      if(res.status >= 200 && res.status < 300) {
        setEditMode(false)
        fetchMovie(movieId)
      }
    })
  }

  const discardEdit = () => {
    setEditTitle(post.title)
    setEditDescription(post.description)
    setEditMode(false)
  }

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/movies/id/${movieId}`, {
      data: {
        token: localStorage.getItem('accessToken')
      }
    }).then(res => {
      if(res.status >= 200 && res.status < 300) {
        history.push('/movies')
      }
    })
  }

  const handleTitle = value => {
    setEditTitle(value)

    const validationRules = [
      {
        condition: new RegExp(`^[a-zA-Z0-9"':;!?., _-]*$`).test(value),
        message: 'Only alphanumeric characters are allowed'
      },
      {
        condition: value.length <= 20,
        message: `Title's length can't exceed 20 characters`
      },
      {
        condition: value.length >= 2,
        message: `Title's length must be at least 2 characters`
      }
    ]

    let titleValidator = validator(validationRules)
    setEditTitleValid(titleValidator.status)
    titleValidator.status == false && setEditTitleErrors(titleValidator.errors)
  }

  const handleDescription = value => {
    setEditDescription(value)

    const validationRules = [
      {
        condition: new RegExp(`^[a-zA-Z0-9"':;!?., _-]*$`).test(value),
        message: 'Only alphanumeric characters and special symbols are allowed'
      },
      {
        condition: value.length <= 1000,
        message: `Description's length can't exceed 1000 characters`
      },
      {
        condition: value.length >= 20,
        message: `Description's length must be at least 20 characters`
      }
    ]

    let descriptionValidator = validator(validationRules)
    setEditDescriptionValid(descriptionValidator.status)
    descriptionValidator.status == false && setEditDescriptionErrors(descriptionValidator.errors)
  }

  useEffect(() => {
    fetchMovie(movieId)
  }, [])

  useEffect(() => {
    if(editTitle === undefined){setEditTitle(post.title)}
    if(editDescription === undefined){setEditDescription(post.description)}
  })

  useEffect(() => {
    setIsFound(isFound)
  }, [isFound])

  return isFound ? (
    <div className="movie">
      <div className="poster">
        <img src={`http://localhost:5000/${post.path}`} alt="" className="img"/>
        <div className="actions">
          <Like
            background={true}
            id={post.id}
            onLike={() => likeHandler(movieId)}
            count={post.likesCount}
            isLiked={post.liked.includes(user.id)}
          />
        </div>
      </div>
      <div className="content">
        <div className="info">
          {!editMode ? 
            <div className="title">{post.title}</div>:
            <Input
              classList={['editTitle']}
              type='text'
              conditions={{
                default: editTitleValid === null,
                wrong: editTitleValid === false,
                correct: editTitleValid === true,
                error: editTitleValid === false
              }}
              onChange={handleTitle}
              value={editTitle}
              error={editTitleErrors}
              appear={'bottom'}
            />
          }
          {!editMode ?
            <div className="description">{post.description}</div>:
            <Input
              classList={['editDescription']}
              type='textarea'
              conditions={{
                default: editDescriptionValid === null,
                wrong: editDescriptionValid === false,
                correct: editDescriptionValid === true,
                error: editDescriptionValid === false
              }}
              onChange={handleDescription}
              value={editDescription}
              error={editDescriptionErrors}
              appear='bottom'
            />    
          }
          <div className="posted">
            — Posted by <span className="owner">
              {user.posts !== undefined && user.posts.includes(post.id) ? 'you' : post.ownerName}
            </span> at {dateHandler(post.date)}
          </div>
        </div>
        <div className="actions">
          <span onClick={() => history.go(-1)} className="back"><div className="tempArrow"></div> back to gallery</span>
        </div>
        {post.editPermission && 
          <Utilities
            editMode={editMode}
            setEditMode={() => setEditMode(!editMode)}
            acceptEdit={acceptEdit}
            discardEdit={discardEdit}
            handleDelete={handleDelete}
            disableEditAccept={!editTitleValid || !editDescriptionValid}
          />
        }
      </div>
    </div>
  ): (<NotFound />)
}

export default Movie