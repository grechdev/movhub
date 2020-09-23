import React, { useState, useEffect } from 'react'
import { Input, File } from '../../components/Input/Input'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { validator } from '../../scripts/validator'

const Upload = () => {
  const localStorage = window.localStorage

  const history = useHistory()

  const user = useSelector(state => state.user.user)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState([])

  const [titleValid, setTitleValid] = useState(null)
  const [titleErrors, setTitleErrors] = useState('')

  const [descriptionValid, setDescriptionValid] = useState(null)
  const [descriptionErrors, setDescriptionErrors] = useState('')

  const [fileValid, setFileValid] = useState(null)
  const [fileErrors, setFileErrors] = useState('')

  const handleTitle = value => {
    setTitle(value)

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
    setTitleValid(titleValidator.status)
    titleValidator.status == false && setTitleErrors(titleValidator.errors)
  }

  const handleDescription = value => {
    setDescription(value)

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
    setDescriptionValid(descriptionValidator.status)
    descriptionValidator.status == false && setDescriptionErrors(descriptionValidator.errors)
  }

  const handleFile = file => {
    setFile(file)
    
    const validationRules = [
      {
        condition: file.size <= 1024*1024*4, // 4 MB
        message: `File size can't exceed 4 MB`
      },
      {
        condition: new RegExp('png|jpeg', 'g').test(file.type),
        message: 'Image extension must be .JPEG or .PNG'
      }
    ]

    let fileValidator = validator(validationRules)
    setFileValid(fileValidator.status)
    fileValidator.status == false && setFileErrors(fileValidator.errors)
  }

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("photo", file)
    formData.append("token", localStorage.getItem('accessToken'))
    axios({
      method: 'POST',
      url: 'http://localhost:5000/movies',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => history.push('/movies'))
  }

  useEffect(() => {
    setTitle(title)
    setDescription(description)
  })

  useEffect(() => {
    if(user.id === undefined) {
      history.push('/login')
    }
  })

  return (
    <div className="Upload Form">
      <Input
        classList={[]}
        conditions={{
          default: titleValid === null,
          wrong: titleValid === false,
          correct: titleValid === true,
          error: titleValid === false
        }}
        value={title}
        type='text'
        placeholder='Movie title'
        onChange={handleTitle}
        error={titleErrors}
      />
      <Input
        classList={[]}
        conditions={{
          default: descriptionValid === null,
          wrong: descriptionValid === false,
          correct: descriptionValid === true,
          error: descriptionValid === false
        }}
        value={description}
        type='textarea'
        placeholder='Movie description'
        onChange={handleDescription}
        error={descriptionErrors}
      />
      <File
        conditions={{
          default: fileValid === null,
          wrong: fileValid === false,
          correct: fileValid === true,
          error: fileValid === false
        }}
        file={handleFile}
        error={fileErrors}
      />
      <div className="actions">
        <input disabled={!titleValid || !descriptionValid || !fileValid} className="submit" onClick={handleSubmit} type="submit"/>
        <span onClick={() => history.goBack()} className="cancel">Cancel</span>
      </div>
    </div>
  )
}

export default Upload