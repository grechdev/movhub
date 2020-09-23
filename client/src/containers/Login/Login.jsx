import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import allActions from '../../actions'
import { validator } from '../../scripts/validator'
import { Input } from '../../components/Input/Input'
import { useHistory } from 'react-router-dom'

const Login = () => {
  const localStorage = window.localStorage

  const [namesCache, setNamesCache] = useState([])

  const [username, setUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(null)
  const [usernameErrors, setUsernameErrors] = useState('')

  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(null)
  const [passwordErrors, setPasswordErrors] = useState('')

  const dispatch = useDispatch()

  const history = useHistory()

  const namesCacheTemp = namesCache

  const handleLogin = e => {
    e.preventDefault()
    if (usernameValid && passwordValid) {
      axios.post('http://localhost:5000/users/auth', {
        username: username,
        password: password
      }).then(res => {
        if (res.data.status) {
          localStorage.setItem('accessToken', res.data.accessToken)
          axios.get(`http://localhost:5000/users/token/${localStorage.getItem('accessToken')}`)
            .then(res => {
              if (res.data.status) {
                dispatch(allActions.userActions.setUser(res.data.result))
                setTimeout(() => {
                  history.push('/movies')
                },500)
              }
            })
        }
      }).catch(() => {
        namesCacheTemp.push(username)
        setNamesCache(namesCacheTemp)
        handleUsername(username)
        document.querySelector('.Login__username').focus()
      })
    }
  }

  const handleUsername = value => {
    setUsername(value)
    
    const validationRules = [
      {
        condition: value.length > 0,
        message: 'Enter username'
      },
      {
        condition: !(namesCache.some(name => name === value)), // if it can't be found
        message: 'User with such username does not exist'
      }
    ]

    const userValidation = validator(validationRules)
    setUsernameValid(userValidation.status)
    userValidation.status == false && setUsernameErrors(userValidation.errors)
  }

  const handlePassword = value => {
    setPassword(value)
    
    const validationRules = [
      {
        condition: value.length > 0,
        message: 'Enter password'
      }
    ]

    const userValidation = validator(validationRules)
    setPasswordValid(userValidation.status)
    userValidation.status == false && setPasswordErrors(userValidation.errors)
  }

  return (
    <form className="form">
      <b className="title">Login</b>
      <Input
        classList={[]}
        conditions={{
          default: usernameValid === null,
          wrong: usernameValid === false,
          correct: usernameValid === true,
          error: usernameValid === false
        }}
        type='text'
        placeholder='username'
        value={username}
        onChange={handleUsername}
        error={usernameErrors}
      />
      <Input
        classList={[]}
        conditions={{
          default: passwordValid === null,
          wrong: passwordValid === false,
          correct: passwordValid === true,
          error: passwordValid === false
        }}
        type='password'
        placeholder='password'
        value={password}
        onChange={handlePassword}
        error={passwordErrors}
      />
      <div className="actions">
        <input type="submit" disabled={!usernameValid || !passwordValid} className="submit" onClick={handleLogin} value='Login'/>
        <span onClick={() => history.goBack()} className="cancel">Cancel</span>
      </div>
    </form>
  )
}

export default Login