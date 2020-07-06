import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Like from '../../components/Like/Like'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import NotFound from '../../components/NotFound/NotFound'
import { Input } from '../../components/Input/Input'
import { useHistory } from 'react-router-dom'
import { validator } from '../../scripts/validator'
import './Movie.css'

const Utilities = props => {
    const [deleteMode, setDeleteMode] = useState(false)
    return (
        <div className="Utilities">
            <button onClick={() => props.setEditMode()} className="Utilities__item Utilities__edit"><EditIcon /></button>
                {props.editMode && <button onClick={props.acceptEdit} disabled={props.disableEditAccept} className="Accept Utilities__item"><CheckIcon/></button>}
                {props.editMode && <button onClick={props.discardEdit} className="Discard Utilities__item"><CloseIcon/></button>}
            <button onClick={() => setDeleteMode(!deleteMode)} className="Utilities__item Utilities__delete"><DeleteIcon /></button>
                {deleteMode && <button onClick={props.handleDelete} className="Accept Utilities__item"><CheckIcon/></button>}
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
        <div className="Movie">
            <div className="Movie__poster">
                <div className="Movie__img-wrapper">
                    <img src={`http://localhost:5000/${post.path}`} alt="" className="Movie__img"/>
                </div>
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
            <div className="Movie__content">
                <div className="Movie__info">
                    {!editMode ? 
                        <div className="Movie__title">{post.title}</div>:
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
                        <div className="Movie__description">{post.description}</div>:
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
                    <div className="Movie__posted">
                        — Posted by <span className="Movie__owner">
                            {user.posts !== undefined && user.posts.includes(post.id) ? 'you' : post.ownerName}
                        </span> at {dateHandler(post.date)}
                    </div>
                </div>
                <div className="actions">
                    <span onClick={() => history.go(-1)} className="Movie__back"><div className="tempArrow"></div> back to gallery</span>
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